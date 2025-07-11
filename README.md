<H2>
  은빛연구소 1.0 입니다.
</H2>
<br><br>
<img src = "https://github.com/user-attachments/assets/7d5cadb3-4dee-4c96-bb10-e5e1f530c513">
<img src = "https://github.com/user-attachments/assets/8f1b5437-eddc-4781-88ee-70665d539a8d">

ㅁ ChatBot
1. 터미널 실행 conda activate ai 
2. pip install pymongo
3. https://www.mongodb.com/try/download/community <- MongoDB 다운
4. 다운받은 파일 압축 해제하고 bin 폴더에서 터미널 실행
5. 터미널에서 mkdir ~/mongodb-data 실행
6. 터미널에서 ./mongod --dbpath ~/mongodb-data 실행 (DB 서버 실행)
7. main(react) 폴더에서 - src - pages - chatbot에서 터미널 실행
8. 가상환경 ai 로 되어 있는지 확인하고 uvicorn Chat:app --reload 실행
9. https://www.mongodb.com/try/download/compass <- MongoDB Compass 다운
10. Compass 에서 Connect 해야함. -> mongodb://localhost:27017 여기로 연결 (MongoDB 서버 켜져있는 상태에서 해야함)

ㅁ Chart 라이브러리 설치
npm install chart.js react-chartjs-2

ㅁ Chatbot 실행
(ai) C:\kd\ws_java\gabia\team3_v2sbm3c\src\main\webapp\main\src\pages>uvicorn chatbot.Chat:app --reload --port 8000

ㅁ ChatBot 라이브러리
pip install langchain_community
pip install llama-index-llms-langchain
pip install llama-index

아이콘 때문에 install함 
npm install react-icons 

캘린더 할 때 씀 :)
npm install @fullcalendar/timegrid
