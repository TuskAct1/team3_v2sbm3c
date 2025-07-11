import pytz                   # timezone
from datetime import datetime # 시간

from langchain_core.tools import tool

@tool
def get_current_time(timezone: str, location: str) -> str:
  """
    현재 시간을 반환하는 함수

    Args:
        timezone (str): 타임존 (예: 'Asia/Seoul') 실제 존재하는 타임존이어야 함
        location (str): 지역명. 타임존이 모든 지명에 대응되지 않기 때문에 이후 llm 답변 생성에 사용됨
  """
  tz = pytz.timezone(timezone)
  now = datetime.now(tz).strftime('%Y-%m-%d %H:%M:%S')

  result = f'{timezone} ({location}) 현재시각 {now}'
  print('-> result: ', result)
  
  return result


