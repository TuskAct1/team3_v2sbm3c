import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from './PieChart';

const EmotionReportPage = () => {
  // 평균 퍼센트 결과
  const [weeklyAverage, setWeeklyAverage] = useState(null);
  const [monthlyAverage, setMonthlyAverage] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const memberno = user?.memberno;

  

  const weeklyPeriod = getCurrentWeek();
  const monthlyPeriod = getCurrentMonth();

  useEffect(() => {
    if (!memberno) return;
    fetchData("WEEKLY", weeklyPeriod, setWeeklyAverage);
    fetchData("MONTHLY", monthlyPeriod, setMonthlyAverage);
    fetchTestResults();
  }, [memberno]);

  if (!memberno) {
    return <div>로그인 후 이용해주세요!</div>;
  }

  async function fetchData(reportType, reportPeriod, setAverage) {
    try {
      // ① OURS (OracleDB)
      const oursRes = await axios.get("http://localhost:9093/emotion_report/get", {
        params: { memberno, reportType, reportPeriod }
      });
      console.log(`[✔️ ${reportType} OURS]`, oursRes.data);

      // ② DIARY (MongoDB)
      const diaryRes = await axios.get("http://localhost:9093/emotion_report/diary", {
        params: { memberno, reportType, reportPeriod }
      });
      console.log(`[✔️ ${reportType} DIARY COUNTS]`, diaryRes.data);
      const diaryPercent = convertCountsToPercent(diaryRes.data);
      console.log(`[✔️ ${reportType} DIARY PERCENT]`, diaryPercent);

      // ③ 평균 계산
      const avgPercent = calculateAveragePercent(oursRes.data, diaryPercent);
      console.log(`[✔️ ${reportType} AVERAGE]`, avgPercent);
      setAverage(avgPercent);

      // ④ 저장
      await saveToOracle(reportType, reportPeriod, avgPercent);

    } catch (err) {
      console.error(`❌ ${reportType} API Error:`, err);
    }
  }

  async function fetchTestResults() {
    try {
      const res = await axios.get("http://localhost:9093/emotion_report/test/result", {
        params: { memberno }
      });
      console.log("✅ 심리테스트 결과:", res.data);
      setTestResults(res.data);
    } catch (err) {
      console.error("❌ 심리테스트 결과 조회 실패:", err);
    }
  }

  function convertCountsToPercent(counts) {
    const smoothedCounts = {};
    const SMOOTH = 1;  // 최소 보정치

    // 각 감정에 +1 추가
    for (let key of ['positive', 'negative', 'neutral', 'anxious', 'depressed']) {
      smoothedCounts[key] = (counts[key] || 0) + SMOOTH;
    }

    const total = Object.values(smoothedCounts).reduce((sum, val) => sum + val, 0);
    const percent = {};
    for (let key in smoothedCounts) {
      percent[key] = Math.round((smoothedCounts[key] / total) * 1000) / 10;
    }
    return percent;
  }


  function calculateAveragePercent(ours, diary) {
    const keys = ['positive', 'negative', 'neutral', 'anxious', 'depressed'];
    const result = {};
    keys.forEach((key) => {
      result[key] = Math.round(((ours[key] + diary[key]) / 2) * 10) / 10;
    });
    return result;
  }

  async function saveToOracle(reportType, reportPeriod, avgPercent) {
    try {
      await axios.post("http://localhost:9093/emotion_report/save", {
        memberno,
        reportType,
        reportPeriod,
        ...avgPercent
      });
      console.log(`✅ ${reportType} 저장 성공!`);
    } catch (err) {
      console.error(`❌ ${reportType} 저장 실패:`, err);
    }
  }

  function getCurrentWeek() {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`;
  }

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-M${(now.getMonth() + 1).toString().padStart(2, "0")}`;
  }

  function renderComparisonTable(weeklyData, monthlyData) {
    return (
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "90%" }}>
        <thead>
          <tr>
            <th>구분</th>
            <th>긍정</th>
            <th>부정</th>
            <th>중립</th>
            <th>불안</th>
            <th>우울</th>
          </tr>
        </thead>
        <tbody>
          {weeklyData && (
            <tr>
              <td>주간 평균</td>
              <td>{weeklyData.positive}%</td>
              <td>{weeklyData.negative}%</td>
              <td>{weeklyData.neutral}%</td>
              <td>{weeklyData.anxious}%</td>
              <td>{weeklyData.depressed}%</td>
            </tr>
          )}
          {monthlyData && (
            <tr>
              <td>월간 평균</td>
              <td>{monthlyData.positive}%</td>
              <td>{monthlyData.negative}%</td>
              <td>{monthlyData.neutral}%</td>
              <td>{monthlyData.anxious}%</td>
              <td>{monthlyData.depressed}%</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  function renderTestResultsTable(data) {
    if (!data || data.length === 0) return <p>데이터가 없습니다.</p>;

    return (
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "90%" }}>
        <thead>
          <tr>
            <th>실행일</th>
            <th>결과 내용</th>
            <th>점수</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td>{item.rdate}</td>
              <td>{item.result}</td>
              <td>{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Emotion Report Page</h2>

      {weeklyAverage && (
        <>
          <div style={{ display: "flex", gap: "40px", marginTop: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", maxWidth: "600px" }}>
              <h3>✅ 주간 평균</h3>
              <PieChart data={weeklyAverage} />
            </div>

            <div style={{ flex: "1", minWidth: "300px" }}>
              <h3>✅ 감정 분석 평균 기록</h3>
              {weeklyAverage && monthlyAverage && renderComparisonTable(weeklyAverage, monthlyAverage)}

              <div style={{ marginTop: "40px" }}>
                <h3>✅ 심리테스트 결과</h3>
                {renderTestResultsTable(testResults)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmotionReportPage;
