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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    memberno: str
    message: str

class ChatHistoryRequest(BaseModel):
    memberno: str

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    # 1. 대화 이력 불러오기
    history = list(chat_collection.find({"memberno": req.memberno}).sort("timestamp", 1))
    
    messages = [{"role": "system", "content": "당신은 친절한 시니어 멘탈케어 챗봇입니다."}]

    for h in history:
        messages.append({"role": "user", "content": h['message']})
        messages.append({"role": "assistant", "content": h['response']})
    messages.append({"role": "user", "content": req.message})

    # 2. GPT 호출 
    chat_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages[-10:]  # 최근 10개만 사용
    )
    reply = chat_response.choices[0].message.content

    # 3. 저장
    chat_collection.insert_one({
        "memberno": req.memberno,
        "message": req.message,
        "response": reply,
        "timestamp": datetime.datetime.utcnow()
    })

    return {"response": reply}

@app.post("/chat/history")
async def chat_history(req: ChatHistoryRequest):
    history = list(chat_collection.find({"memberno": req.memberno}).sort("timestamp", 1))
    messages = []
    for h in history:
        messages.append({"from": "user", "text": h['message']})
        messages.append({"from": "bot", "text": h['response']})
    return {"history": messages}


if __name__ == "__main__":
    # uvicorn.run("resort_auth:app", host="121.78.128.17", port=8000, reload=True) # Gabia 할당 불가
    uvicorn.run("Chat:app", host="0.0.0.0", port=8000, reload=True)
    