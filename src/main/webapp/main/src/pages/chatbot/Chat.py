import os
import datetime
from chatbot import DecoTool
import requests

from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI

from llama_index.core.base.llms.types import ChatMessage, MessageRole, TextBlock
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext, load_index_from_storage
from llama_index.llms.openai import OpenAI

from pymongo import MongoClient

from openai import OpenAI
from emotion_report.router import router as emotion_report_router
from db import db  # ✅ 여기서 가져옴


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 에이전트 전역 
llm = ChatOpenAI(
    # model="gpt-4o",
    model="gpt-3.5-turbo",
    temperature=0.7,
    frequency_penalty=0.2,      # 반복 피하기(적당히)
    presence_penalty=0.4        # 새 아이디어/질문 끌어내기 
)

agent = initialize_agent(
    tools=[DecoTool.get_current_time],
    llm = llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    verbose=True
)

storage_dir = "./storage"

# 기존 방식으로 하면 계속 임베딩이 일어나기 때문에 비용이 계속 추가됨. 
if not os.path.exists(storage_dir):
    documents = SimpleDirectoryReader("./chatbot/data/center").load_data()
    index = VectorStoreIndex.from_documents(documents)
    index.storage_context.persist(persist_dir=storage_dir)
else:
    storage_context = StorageContext.from_defaults(persist_dir=storage_dir)
    index = load_index_from_storage(storage_context)




# MongoDB

load_dotenv()

mongo_client = MongoClient(f"mongodb://{os.environ['MONGO_USER']}:{os.environ['MONGO_PW']}@121.78.128.139:27017/admin")
db = mongo_client["mentalcare"]   # DB 이름
# mongo_client = MongoClient("mongodb://localhost:27017/")
# db = mongo_client["mentalcare"]   # DB 이름
chat_collection = db["chats"]     # 저장되는 폴더 이름
chat_rooms_collection = db["chat_rooms"]
memory_collection = db["chatbot_memories"]  # MongoDB 컬렉션 예시

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(emotion_report_router, prefix="/emotion_report")

class ChatRequest(BaseModel):
    memberno: str
    room_id: str
    message: str

class CreateRoomRequest(BaseModel):
    memberno: str
    room_title: str

class ChatRoomListRequest(BaseModel):
    memberno: str
    
class ChatHistoryRequest(BaseModel):
    memberno: str
    room_id: str

class UpdateRoomTitleRequest(BaseModel):
    room_id: str
    room_title: str

class DeleteRoomRequest(BaseModel):
    memberno: str
    room_id: str

class DeleteAllRoomsRequest(BaseModel):
    memberno: str

class WeeklyReportRequest(BaseModel):
    memberno: str
    room_id: str

session_histories = {}

def save_memory_to_db(session_id, memory):
    history_for_db = []
    for msg in memory.get_all():
        history_for_db.append({
            "role": msg.role.value if hasattr(msg, "role") else msg["role"],
            "content": msg.blocks[0].text if hasattr(msg, "blocks") and msg.blocks else msg.get("content", ""),
        })
    memory_collection.update_one(
        {"session_id": session_id},
        {"$set": {"history": history_for_db}},
        upsert=True
    )

def load_memory_from_db(session_id):
    doc = memory_collection.find_one({"session_id": session_id})
    if doc and "history" in doc:
        return doc["history"]
    else:
        return []    

def dict_to_chatmessage(d):
    # d = {"role": "user", "content": "text"}
    return ChatMessage(
        role=MessageRole(d["role"]),
        blocks=[TextBlock(block_type="text", text=d["content"])]
    )

def get_user_memory(session_id):
    history = load_memory_from_db(session_id)
    memory = ChatMemoryBuffer.from_defaults(token_limit=2000)
    for h in history:
        memory.put(dict_to_chatmessage(h))
    return memory

# SMS
def check_emotion_alert(memberno, recent_emotions):
    risk = sum(1 for emo in recent_emotions if emo in ["우울", "불안", "부정"])
    if risk >= 3:
        # Spring REST API로 보호자 번호 가져와서 SMS 발송 요청
        url = f"http://localhost:9093/alert/emotion/{memberno}"
        payload = {
            "memberno": memberno,
            "emotions": recent_emotions
        }
        try:
            r = requests.post(url, json=payload, timeout=604800)    # 기본 시간 7일
            print("Alert SMS sent, response:", r.text)
        except Exception as e:
            print("Failed to send alert SMS:", e)

def analyze_emotion(text):
    prompt = (
        f"다음 문장의 감정을 '긍정', '부정', '중립', '불안', '우울' 중 하나로 답만 해줘: {text}"
    )
    response = llm.invoke(prompt)

    # 감정 태그만 추출
    emotion = response.content.strip()

    # 예외처리(모델이 엉뚱한 답 줄 때 기본 중립)
    if emotion not in ["긍정", "부정", "중립", "불안", "우울"]:
        emotion = "중립"
    return emotion

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    # 1. 대화 이력 불러오기
    history = list(chat_collection.find({"memberno": req.memberno, "room_id": req.room_id}).sort("timestamp", 1))

    session_id = f"{req.memberno}_{req.room_id}"
    memory = get_user_memory(session_id)

    # 벡터 인덱스 생성 (문서 기반 질의응답)
    query_engine = index.as_chat_engine(
        llm=llm,
        chat_mode="context",
        memory=memory
    )

    system_prompt = (
        "당신은 공감능력이 뛰어난 시니어(노년층) 멘탈케어 전문 챗봇입니다. "
        "항상 따뜻한 말투와 쉬운 단어로, 상대방의 기분과 이야기를 경청하세요. "
        "어떤 고민도 부정하지 말고, 다정하게 격려해 주세요. "
        "상대방의 감정이나 이야기, 추억을 자연스럽게 요약해주고, "
        "긍정적인 한 마디(예: '오늘도 소중한 하루 보내고 계시네요')로 대화를 마무리해 주세요."
        "이름, 고민, 기분, 요청사항 등을 지속적으로 기억하고, 이전 이야기와 이어서 답변하세요."
        "그리고 사용자의 정보를 기억해야돼."
        "필요시 tool을 사용하세요."
    )

    messages = [{"role": "system", "content": system_prompt}]

    for h in history:
        messages.append({"role": "user", "content": h['message']})
        messages.append({"role": "assistant", "content": h['response']})
    messages.append({"role": "user", "content": req.message})

    response = query_engine.chat(req.message)  # 멀티턴 기억력
    reply = str(response)   

    emotion = analyze_emotion(req.message)
    # 4. 저장시 emotion 필드 함께 저장
    chat_collection.insert_one({
        "memberno": req.memberno,
        "room_id": req.room_id,
        "message": req.message,
        "response": reply,
        "timestamp": datetime.datetime.utcnow(),
        "emotion": emotion
    })

    save_memory_to_db(session_id, memory)

    # 최근 5개 메시지 감정 리스트 뽑기
    recent_chats = list(chat_collection.find({
        "memberno": req.memberno,
        "room_id": req.room_id
    }).sort("timestamp", -1).limit(5))
    recent_emotions = [c.get("emotion", "중립") for c in recent_chats if c.get("emotion")]

    # 베포할 때 주석 해제 (채팅 사용할 때마다 문자 보내짐) SMS
    check_emotion_alert(req.memberno, recent_emotions)

    return {"response": reply, "emotion": emotion}

# 채팅방 추가
@app.post("/chat/create-room")
async def create_room(req: CreateRoomRequest):
    import uuid
    room_id = str(uuid.uuid4())
    room = {
        "room_id": room_id,
        "memberno": req.memberno,
        "room_title": req.room_title,
        "created_at": datetime.datetime.utcnow()
    }
    chat_rooms_collection.insert_one(room)
    return {"room_id": room_id, "room_title": req.room_title}


# 채팅방 리스트
@app.post("/chat/room-list")
async def chat_room_list(req: ChatRoomListRequest):
    # req: { memberno: str }
    # 룸 이름 만들고 room_id(DB에 저장 되는 이름)에 변수 할당 + room_title(사용자한테 보이는 이름)
    rooms_list = list(chat_rooms_collection.find({"memberno": req.memberno}).sort("timestamp", 1))
    rooms = []
    for room in rooms_list:
        rooms.append({"room_id": room['room_id'], "room_title": room['room_title']})
    return {"rooms": rooms}


# 채팅 로그
@app.post("/chat/history")
async def chat_history(req: ChatHistoryRequest):
    history = list(chat_collection.find({"memberno": req.memberno, "room_id": req.room_id}).sort("timestamp", 1))
    messages = []
    for h in history:
        messages.append({"from": "user", "text": h['message']})
        messages.append({"from": "bot", "text": h['response']})
    return {"history": messages}


# 대화방 title update
@app.post("/chat/update-room-title")
async def update_room_title(req: UpdateRoomTitleRequest):
    chat_rooms_collection.update_one(
        {"room_id": req.room_id},
        {"$set": {"room_title": req.room_title}}
    )
    return {"status": "ok"}


# 대화방 삭제
@app.post("/chat/delete-room")
async def delete_room(req: DeleteRoomRequest):
    # 방 정보 삭제 (예시: chat_rooms 컬렉션)
    chat_rooms_collection.delete_one({
        "memberno": req.memberno,
        "room_id": req.room_id
    })
    # 대화 기록까지 삭제 
    chat_collection.delete_many({
        "memberno": req.memberno,
        "room_id": req.room_id
    })
    return {"result": "success"}

# 대화방 전체 삭제
@app.post("/chat/delete-all-rooms")
async def delete_all_rooms(req: DeleteAllRoomsRequest):
    # 모든 방 삭제
    chat_rooms_collection.delete_many({"memberno": req.memberno})
    # 모든 채팅 삭제
    chat_collection.delete_many({"memberno": req.memberno})
    # 대화 히스토리 메모리(옵션)
    memory_collection.delete_many({"session_id": {"$regex": f"^{req.memberno}_"}})
    return {"result": "success"}


# 채팅 감정 분석
@app.post("/chat/weekly-report")
async def weekly_report(req: WeeklyReportRequest):
    # 1주일 데이터 조회
    one_week_ago = datetime.datetime.utcnow() - datetime.timedelta(days=7)
    chats = list(chat_collection.find({
        "memberno": req.memberno,
        "room_id": req.room_id,
        "timestamp": {"$gte": one_week_ago}
    }))
    # 감정별 카운트
    emotion_counter = {"긍정":0,"부정":0,"중립":0,"불안":0,"우울":0}
    for chat in chats:
        emo = chat.get("emotion") or analyze_emotion(chat["message"])  # 없으면 즉시 분석
        emotion_counter[emo] = emotion_counter.get(emo, 0) + 1

    # 예시 리포트
    report_text = f"""이번주 대화 분석 결과
                    - 긍정: {emotion_counter.get('긍정', 0)}회
                    - 부정: {emotion_counter.get('부정', 0)}회
                    - 중립: {emotion_counter.get('중립', 0)}회
                    - 불안: {emotion_counter.get('불안', 0)}회
                    - 우울: {emotion_counter.get('우울', 0)}회
                    """

    # 실제 Count된 값은 raw: emotion_counter -> data 받을 때 res.data.raw
    return {"report": report_text, "raw": emotion_counter}

# app.include_router(emotion_report_router, prefix="/emotion_report")

if __name__ == "__main__":
    uvicorn.run("Chat:app", host="0.0.0.0", port=8000, reload=True)
    