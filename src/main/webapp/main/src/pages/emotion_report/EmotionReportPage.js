import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PieChart from '../emotion_report/PieChart';
import LineChart from '../emotion_report/LineChart';
import './EmotionReportPage.css';

// const korToEng = {
//   긍정: 'positive',
//   부정: 'negative',
//   중립: 'neutral',
//   불안: 'anxious',
//   우울: 'depressed'
// };

// function convertTrendDataToEnglish(data) {
//   return data.map(item => {
//     const converted = { reportPeriod: item.reportPeriod };
//     Object.keys(korToEng).forEach(kor => {
//       converted[korToEng[kor]] = item[kor] ?? 0;
//     });
//     return converted;
//   });
// }

const EmotionReportPage = () => {
  // 탭
  const [mainTab, setMainTab] = useState("WEEKLY");

  // 주간/월간 PieChart + 표
  const [weeklyAverage, setWeeklyAverage] = useState(null);
  const [monthlyAverage, setMonthlyAverage] = useState(null);
  const [testResults, setTestResults] = useState([]);

  // 감정 변화 탭
  const [weeklyTrendData, setWeeklyTrendData] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);

  const [weeklySummary, setWeeklySummary] = useState("");
  const [monthlySummary, setMonthlySummary] = useState("");

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

  // 👉 감정 변화 트렌드 불러오기
  useEffect(() => {
    if (memberno) {
      loadAllTrendData();
    }
  }, [memberno]);

  useEffect(() => {
    if (weeklyAverage) {
      generateSummary(weeklyAverage, setWeeklySummary);
    }
  }, [weeklyAverage]);

  useEffect(() => {
    if (monthlyAverage) {
      generateSummary(monthlyAverage, setMonthlySummary);
    }
  }, [monthlyAverage]);

  async function saveReportToSpring(reportType, reportPeriod, data) {
    try {
      await axios.post("http://localhost:9093/emotion_report/save", {
        memberno,
        reportType,
        reportPeriod,
        ...data
      });
      console.log(`✅ ${reportType} 저장 성공`);
    } catch (err) {
      console.error(`❌ ${reportType} 저장 실패`, err);
    }
  }

  function getPeriodRange(reportType, reportPeriod) {
    let startDate, endDate;

    if (reportType === "WEEKLY") {
      const [yearPart, weekPart] = reportPeriod.split("-W");
      const year = parseInt(yearPart);
      const week = parseInt(weekPart);

      // ✅ 한국시간 offset
      const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

      // 1. 한국시간 기준 첫 날
      const jan1 = new Date(Date.UTC(year, 0, 1));
      const jan1KST = new Date(jan1.getTime() + KST_OFFSET_MS);

      // 2. 첫 주 월요일로 맞추기
      const jan1Day = jan1KST.getDay();
      const offsetToMonday = (jan1Day === 0 ? -6 : 1 - jan1Day);

      const firstMondayKST = new Date(jan1KST);
      firstMondayKST.setDate(jan1KST.getDate() + offsetToMonday);
      firstMondayKST.setHours(0, 0, 0, 0);

      // 3. 이번 주 시작(한국시간)
      const startOfWeekKST = new Date(firstMondayKST);
      startOfWeekKST.setDate(firstMondayKST.getDate() + (week - 1) * 7);

      // 4. 다음주 시작(한국시간)
      const endOfWeekKST = new Date(startOfWeekKST);
      endOfWeekKST.setDate(startOfWeekKST.getDate() + 7);

      // 5. UTC로 변환
      startDate = new Date(startOfWeekKST.getTime() - KST_OFFSET_MS);
      endDate = new Date(endOfWeekKST.getTime() - KST_OFFSET_MS);
    } else if (reportType === "MONTHLY") {
      let [yearStr, monthStr] = reportPeriod.split("-");

      if (monthStr.startsWith("M")) {
        monthStr = monthStr.substring(1);
      }

      const year = parseInt(yearStr);
      const month = parseInt(monthStr);

      if (isNaN(year) || isNaN(month)) {
        throw new Error("Invalid reportPeriod for MONTHLY: " + reportPeriod);
      }

      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 1);
    }

    return { startDate, endDate };
  }

  async function fetchData(reportType, reportPeriod, setAverage) {
    try {
      const { startDate, endDate } = getPeriodRange(reportType, reportPeriod);
      const diaryRes = await axios.get("http://localhost:9093/emotion_report/diary", {
        params: { memberno, reportType, reportPeriod }
      });
      const chatbotRes = await axios.get("http://localhost:8000/emotion_report/summary", {
        params: { memberno, period_type: reportType, since: startDate.toISOString(), until: endDate.toISOString() }
      });
      const diaryCounts = diaryRes.data;
      const chatbotCounts = chatbotRes.data.count;

      const mergedCounts = {};
      const keys = ['positive', 'negative', 'neutral', 'anxious', 'depressed'];
      keys.forEach((key) => {
        mergedCounts[key] = (diaryCounts[key] || 0) + (chatbotCounts[key] || 0);
      });

      const mergedPercent = convertCountsToPercent(mergedCounts);
      setAverage(mergedPercent);

      await saveReportToSpring(reportType, reportPeriod, mergedPercent);
    } catch (err) {
      console.error(`❌ ${reportType} API Error:`, err);
    }
  }

  async function fetchTestResults() {
    try {
      const res = await axios.get("http://localhost:9093/emotion_report/test/result", {
        params: { memberno }
      });
      setTestResults(res.data);
    } catch (err) {
      console.error("❌ 심리테스트 결과 조회 실패:", err);
    }
  }

  async function generateSummary(current, setter, previous = null) {
    try {
      if (!current) return;

      const res = await axios.post("http://localhost:8000/emotion_report/generate-summary", {
        current,
        previous
      });
      setter(res.data.summary);
    } catch (err) {
      console.error("❌ Summary 생성 실패:", err);
    }
  }

  async function loadAllTrendData() {
  try {
    const [weeklyRes, monthlyRes] = await Promise.all([
      axios.get("http://localhost:8000/emotion_report/trend", {
        params: { memberno, period_type: "WEEKLY" }
      }),
      axios.get("http://localhost:8000/emotion_report/trend", {
        params: { memberno, period_type: "MONTHLY" }
      })
    ]);
    setWeeklyTrendData(weeklyRes.data);
    setMonthlyTrendData(monthlyRes.data);
  } catch (err) {
    console.error("❌ Trend API Error:", err);
  }
}

  function convertCountsToPercent(counts) {
    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
    if (total === 0 || isNaN(total)) {
      return { positive: 0, negative: 0, neutral: 0, anxious: 0, depressed: 0 };
    }
    const percent = {};
    for (let key in counts) {
      percent[key] = Math.round((counts[key] / total) * 1000) / 10;
    }
    return percent;
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

  function renderComparisonTable(data) {
    if (!data) return null;
    return (
      <table cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", fontSize: "18px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
            <th>구분</th>
            <th>긍정</th>
            <th>부정</th>
            <th>중립</th>
            <th>불안</th>
            <th>우울</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{mainTab === "WEEKLY" ? "주간 평균" : "월간 평균"}</td>
            <td>{data.positive}%</td>
            <td>{data.negative}%</td>
            <td>{data.neutral}%</td>
            <td>{data.anxious}%</td>
            <td>{data.depressed}%</td>
          </tr>
        </tbody>
      </table>
    );
  }

  function renderTestResultsTable(data) {
    if (!data || data.length === 0) return <p>데이터가 없습니다.</p>;
    return (
      <table cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", fontSize: "18px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5" }}>
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

  if (!memberno) {
    return <div>로그인 후 이용해주세요!</div>;
  }

  return (
    <div className="page-container">
      <div className="report-header">
        <h2>감정분석 리포트</h2>
        <p className="subtitle">“괜찮아요, 어떤 감정이든 다 괜찮습니다.”</p>
        <p className="description">토닥이가 조심스럽게 당신의 마음을 들여다보았어요.</p>
      </div>

      {/* 상단 메인 탭 */}
      <div className="toggle-wrapper">
        <button className={mainTab === "WEEKLY" ? "active" : ""} onClick={() => setMainTab("WEEKLY")}>주간</button>
        <button className={mainTab === "MONTHLY" ? "active" : ""} onClick={() => setMainTab("MONTHLY")}>월간</button>
      </div>

      <hr className="divider" />

      {mainTab === "WEEKLY" && weeklyAverage && (
        <div className="emotion-wrapper">
          <p style={{ paddingTop: "5px", fontSize: "20px"}}>{weeklySummary || "총평을 생성 중입니다..."}</p>
          <div className="emotion-top">

            {/* ✅ 카드: 주간 평균 원그래프 */}
            <div className="section card">
              <PieChart data={weeklyAverage} />
            </div>

            {/* ✅ 주간 표 + 심리테스트 결과 묶음 */}
            <div className="side-area">
              <div className="section card weekly-table-card">
                <h3 style={{ marginBottom: '50px' }}>주간 표</h3>
                {renderComparisonTable(weeklyAverage)}
              </div>

              <div className="section card test-result-card">
                <h3 style={{ marginBottom: '50px' }}>심리테스트 결과</h3>
                {renderTestResultsTable(testResults)}
              </div>
            </div>
          </div>

          <div className="emotion-bottom">
            <h3 className="chart-title">주간 감정 변화 보기</h3>
            <div className="chart-card">
              <div className="chart-container">
                <LineChart data={weeklyTrendData} mode="WEEKLY" />
              </div>
            </div>
          </div>
        </div>
      )}

      {mainTab === "MONTHLY" && monthlyAverage && (
        <div className="emotion-wrapper">
          <p style={{ paddingTop: "5px", fontSize: "20px"}}>{monthlySummary || "총평을 생성 중입니다..."}</p>
          <div className="emotion-top">

            {/* ✅ 카드: 주간 평균 원그래프 */}
            <div className="section card">
              <PieChart data={monthlyAverage} />
            </div>

            {/* ✅ 주간 표 + 심리테스트 결과 묶음 */}
            <div className="side-area">
              <div className="section card weekly-table-card">
                <h3 style={{ marginBottom: '50px' }}>주간 표</h3>
                {renderComparisonTable(monthlyAverage)}
              </div>

              <div className="section card test-result-card">
                <h3 style={{ marginBottom: '50px' }}>심리테스트 결과</h3>
                {renderTestResultsTable(testResults)}
              </div>
            </div>
          </div>

          <div className="emotion-bottom">
            <h3 className="chart-title">주간 감정 변화 보기</h3>
            <div className="chart-card">
              <div className="chart-container">
                <LineChart data={monthlyTrendData} mode="MONTHLY" />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const buttonStyle = {
  padding: "8px 16px",
  marginRight: "10px",
  backgroundColor: "#e0e0e0",
  color: "black",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const activeStyle = {
  ...buttonStyle,
  backgroundColor: "#4CAF50",
  color: "white"
};

const flexContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "40px",
  alignItems: "flex-start",
  justifyContent: "center"
};

const chartArea = { flex: "1 1 300px", maxWidth: "500px" };
const sideArea = { flex: "1 1 300px", minWidth: "300px" };

export default EmotionReportPage;
