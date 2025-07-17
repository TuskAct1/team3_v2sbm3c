from fastapi import APIRouter, Query, Body
from datetime import datetime, timedelta
from openai import OpenAI
import httpx
from db import db

client = OpenAI()
router = APIRouter()
chat_collection = db["chats"]

KST_OFFSET = timedelta(hours=9)

kor_to_eng = {
    "긍정": "positive",
    "부정": "negative",
    "중립": "neutral",
    "불안": "anxious",
    "우울": "depressed"
}

emotions = ["positive", "negative", "neutral", "anxious", "depressed"]

def convert_kor_to_eng_counts(kor_counts):
    if not kor_counts:
        return {v: 0 for v in kor_to_eng.values()}
    return {kor_to_eng.get(k, k): v for k, v in kor_counts.items()}


def get_week_range(now=None):
    if not now:
        now = datetime.utcnow()

    kst_now = now + KST_OFFSET
    start_of_week_kst = kst_now - timedelta(days=kst_now.weekday())
    start_of_week_kst = start_of_week_kst.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_week_kst = start_of_week_kst + timedelta(days=7)

    start_of_week_utc = start_of_week_kst - KST_OFFSET
    end_of_week_utc = end_of_week_kst - KST_OFFSET

    return start_of_week_utc, end_of_week_utc

def get_month_range(kst_now=None):
    if not kst_now:
        # 서버 현재 시간을 한국시간으로 변환
        kst_now = datetime.utcnow() + KST_OFFSET

    # 한국시간 월 시작
    start_of_month_kst = datetime(
        year=kst_now.year, month=kst_now.month, day=1,
        hour=0, minute=0, second=0, microsecond=0
    )

    # 다음 달 1일
    if kst_now.month == 12:
        next_month_kst = datetime(
            year=kst_now.year + 1, month=1, day=1,
            hour=0, minute=0, second=0, microsecond=0
        )
    else:
        next_month_kst = datetime(
            year=kst_now.year, month=kst_now.month + 1, day=1,
            hour=0, minute=0, second=0, microsecond=0
        )

    # UTC 변환
    start_of_month_utc = start_of_month_kst - KST_OFFSET
    next_month_utc = next_month_kst - KST_OFFSET

    return start_of_month_utc, next_month_utc


async def fetch_diary_counts(memberno, reportType, reportPeriod):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "http://localhost:9093/emotion_report/diary",
            params={"memberno": memberno, "reportType": reportType, "reportPeriod": reportPeriod}
        )
        if res.status_code == 200:
            return res.json()
        return None
    
# chatbot 서버 호출
async def fetch_chatbot_counts(memberno, period_type, since, until):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            "http://localhost:8000/emotion_report/summary",
            params={
                "memberno": memberno,
                "period_type": period_type,
                "since": since.isoformat(),
                "until": until.isoformat()
            }
        )
        if res.status_code == 200:
            return res.json().get("count")
        return None
    
def merge_and_calculate_percent(diary_counts, chatbot_counts):
    merged = {}
    for emo in emotions:
        d_val = diary_counts.get(emo, 0) if diary_counts else 0
        c_val = chatbot_counts.get(emo, 0) if chatbot_counts else 0
        merged[emo] = d_val + c_val

    # 👑 핵심 추가
    total_diary = sum(diary_counts.values()) if diary_counts else 0
    total_chatbot = sum(chatbot_counts.values()) if chatbot_counts else 0

    if total_diary == 0 and total_chatbot == 0:
        return {emo: 0.0 for emo in emotions}

    total = sum(merged.values())
    if total > 0:
        percent = {emo: round((merged[emo]/total)*100, 1) for emo in emotions}
    else:
        percent = {emo: 0.0 for emo in emotions}
    return percent


@router.get("/summary")
async def get_emotion_summary(
    memberno: str,
    period_type: str = Query(..., regex="^(WEEKLY|MONTHLY)$"),
    since: str = Query(...),
    until: str = Query(...)
):
    """
    /emotion_report/summary
    -> 주간/월간 감정 비율(%) 리포트 반환
    """
    now = datetime.utcnow()
    
    # 기간 계산
    if period_type in ["WEEKLY", "MONTHLY"]:
        # ✅ 클라이언트가 넘긴 since/until 사용
        if not since or not until:
            return {"error": "Missing since/until parameters"}

        # 기존 코드
        # start_date = datetime.fromisoformat(since)
        # end_date = datetime.fromisoformat(until)

        # 수정된 코드
        start_date = datetime.fromisoformat(since.replace("Z", ""))
        end_date = datetime.fromisoformat(until.replace("Z", ""))
        
    else:
        return {"error": "Invalid period_type"}


    # ✅ 동적 쿼리
    query = {
        "memberno": memberno,
        "timestamp": {"$gte": start_date, "$lt": end_date}
    }

    print("[DEBUG] MongoDB Query:", query)
    chats = chat_collection.find(query)

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

    # ✅ 한국어 -> 영어 매핑
    kor_to_eng = {
        "긍정": "positive",
        "부정": "negative",
        "중립": "neutral",
        "불안": "anxious",
        "우울": "depressed"
    }

    # ✅ 변환된 딕셔너리 생성
    english_count = {kor_to_eng[k]: v for k, v in emotion_counter.items()}
    english_percent = {kor_to_eng[k]: v for k, v in emotion_percent.items()}

    # ✅ 변환된 응답 반환
    return {
        "memberno": memberno,
        "period_type": period_type,
        "since": start_date.isoformat(),
        "count": english_count,
        "percent": english_percent
    }
    
@router.post("/generate-summary")
async def generate_summary(
    current: dict = Body(...),
    previous: dict = Body(None)
):
    if previous:
        prompt = f"""
        이번 주 감정 결과
        긍정: {current.get('positive')}%, 부정: {current.get('negative')}%, 중립: {current.get('neutral')}%, 불안: {current.get('anxious')}%, 우울: {current.get('depressed')}%
        
        저번 주 감정 결과
        긍정: {previous.get('positive')}%, 부정: {previous.get('negative')}%, 중립: {previous.get('neutral')}%, 불안: {previous.get('anxious')}%, 우울: {previous.get('depressed')}%
        
        이 둘을 비교해 한 문장으로 총평을 작성해 주세요.
        """
    else:
        prompt = f"""
        감정 결과
        긍정: {current.get('positive')}%, 부정: {current.get('negative')}%, 중립: {current.get('neutral')}%, 불안: {current.get('anxious')}%, 우울: {current.get('depressed')}%
        
        위 결과를 설명하는 총평을 한 문장으로 작성해 주세요.
        """

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "당신은 감정 리포트를 요약하는 전문가입니다."},
            {"role": "user", "content": prompt}
        ]
    )

    return {"summary": completion.choices[0].message.content}

@router.get("/trend")
async def get_emotion_trend(
    memberno: str,
    period_type: str = Query(..., regex="^(WEEKLY|MONTHLY)$")
):
    now = datetime.utcnow()
    results = []

    if period_type == "WEEKLY":
        for i in range(4):
            # 계산 주간
            period_date = now - timedelta(weeks=i)
            reportPeriod = f"{period_date.year}-W{period_date.isocalendar().week:02d}"
            
            start_date, end_date = get_week_range(period_date)
            diary_counts = await fetch_diary_counts(memberno, "WEEKLY", reportPeriod)
            chatbot_counts_raw = await fetch_chatbot_counts(memberno, "WEEKLY", start_date, end_date)
            chatbot_counts = convert_kor_to_eng_counts(chatbot_counts_raw)

            # 로그
            print(f"[DEBUG] diary_counts for {reportPeriod}:", diary_counts)
            print(f"[DEBUG] chatbot_counts for {reportPeriod}:", chatbot_counts)

            if (not diary_counts or sum(diary_counts.values()) == 0) and \
            (not chatbot_counts or sum(chatbot_counts.values()) == 0):
                percent = {emo: 0.0 for emo in emotions}
            else:
                percent = merge_and_calculate_percent(diary_counts, chatbot_counts)
            results.append({"reportPeriod": reportPeriod, **percent})

        results.reverse()

    elif period_type == "MONTHLY":
        for i in range(4):
            month = now.month - i
            year = now.year
            while month <= 0:
                month += 12
                year -= 1

            period_date_kst = datetime(year, month, 15, 0, 0, 0) + KST_OFFSET

            start_date, end_date = get_month_range(period_date_kst)

            # ✅ 포맷 변환
            diary_reportPeriod = f"{year}-M{month:02d}"
            chatbot_reportPeriod = f"{year}-{month:02d}"

            # ✅ diary / chatbot
            diary_counts = await fetch_diary_counts(memberno, "MONTHLY", diary_reportPeriod)
            chatbot_counts_raw = await fetch_chatbot_counts(memberno, "MONTHLY", start_date, end_date)
            chatbot_counts = convert_kor_to_eng_counts(chatbot_counts_raw)

            # ✅ 합산
            if (not diary_counts or sum(diary_counts.values()) == 0) and \
            (not chatbot_counts or sum(chatbot_counts.values()) == 0):
                percent = {emo: 0.0 for emo in emotions}
            else:
                percent = merge_and_calculate_percent(diary_counts, chatbot_counts)

            results.append({"reportPeriod": chatbot_reportPeriod, **percent})

        results.reverse()

    return results