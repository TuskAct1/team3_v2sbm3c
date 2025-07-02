# emotion_report/router.py
from fastapi import APIRouter, Query
from datetime import datetime, timedelta
from Chat import db

router = APIRouter()

chat_collection = db["chats"]

@router.get("/summary")
async def get_emotion_summary(
    memberno: str,
    room_id: str,
    period_type: str = Query(..., regex="^(WEEKLY|MONTHLY)$")
):
    """
    /emotion_report/summary
    -> 주간/월간 감정 비율(%) 리포트 반환
    """
    now = datetime.utcnow()

    # 기간 계산
    if period_type == "WEEKLY":
        start_date = now - timedelta(days=7)
    elif period_type == "MONTHLY":
        start_date = now - timedelta(days=30)
    else:
        return {"error": "Invalid period_type"}

    # MongoDB 쿼리
    chats = chat_collection.find({
        "memberno": memberno,
        "room_id": room_id,
        "timestamp": {"$gte": start_date}
    })

    # 감정 카운트 초기화
    emotion_counter = {
        "긍정": 0,
        "부정": 0,
        "중립": 0,
        "불안": 0,
        "우울": 0
    }

    # 카운트 집계
    for chat in chats:
        emo = chat.get("emotion")
        if emo in emotion_counter:
            emotion_counter[emo] += 1

    # 총합
    total = sum(emotion_counter.values())

    # 비율 계산 (퍼센트)
    emotion_percent = {}
    if total > 0:
        for emo, count in emotion_counter.items():
            emotion_percent[emo] = round((count / total) * 100, 1)
    else:
        for emo in emotion_counter:
            emotion_percent[emo] = 0.0

    return {
        "memberno": memberno,
        "room_id": room_id,
        "period_type": period_type,
        "since": start_date.isoformat(),
        "count": emotion_counter,
        "percent": emotion_percent
    }
