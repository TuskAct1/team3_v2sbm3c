from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import datetime
from pymongo import MongoClient
from openai import OpenAI

app = FastAPI()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
mongo_client = MongoClient("mongodb://localhost:27017/")
db = mongo_client["mentalcare"]   # DB 이름
chat_collection = db["chats"]     # 저장되는 폴더 이름
chat_rooms_collection = db["chat_rooms"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

class WeeklyReportRequest(BaseModel):
    memberno: str
    room_id: str


@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    # 1. 대화 이력 불러오기
    history = list(chat_collection.find({"memberno": req.memberno, "room_id": req.room_id}).sort("timestamp", 1))

    messages = [{"role": "system", "content": "당신은 친절한 시니어 멘탈케어 챗봇입니다."}]

    for h in history:
        messages.append({"role": "user", "content": h['message']})
        messages.append({"role": "assistant", "content": h['response']})
    messages.append({"role": "user", "content": req.message})

    # 2. GPT 호출 
    chat_response = client.chat.completions.create(
        model="gpt-4.1-nano",
        messages=messages[-10:]  # 최근 10개만 사용
    )
    reply = chat_response.choices[0].message.content

    # 3. 저장
    chat_collection.insert_one({
        "memberno": req.memberno,
        "room_id": req.room_id,
        "message": req.message,
        "response": reply,
        "timestamp": datetime.datetime.utcnow()
    })

    return {"response": reply}

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
    emotion_counter = {}
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

    # 필요시 OpenAI로 summary 생성도 가능!
    return {"report": report_text, "raw": emotion_counter}


if __name__ == "__main__":
    # uvicorn.run("resort_auth:app", host="121.78.128.17", port=8000, reload=True) # Gabia 할당 불가
    uvicorn.run("Chat:app", host="0.0.0.0", port=8000, reload=True)
    