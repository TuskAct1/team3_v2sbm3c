import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import moment from 'moment-timezone'; // ✅ 추가
import 'react-calendar/dist/Calendar.css';
import '../../styles/MiniCalendar.css';

function MiniCalendar({ value, onChange, month }) {
  // moment → Date (KST 00:00 고정)
  const toKSTDateOnly = (date) => {
    const m = moment.tz(date, 'Asia/Seoul');
    return new Date(m.year(), m.month(), m.date());
  };
  
  // month prop 이 없으면 value(date 선택) 로 fallback
  const baseDate = month || value;
  const [viewDate, setViewDate] = useState(toKSTDateOnly(baseDate));

  // // month 또는 value가 바뀔 때마다 viewDate 동기화
    useEffect(() => {
      const newBase = toKSTDateOnly(month || value);
      setViewDate(newBase);
    // console.log("오늘밤 주인공은 나야 나: " + month);
    // console.log("나야 나: "+value);
    // console.log("오늘밤 주인공은 나야나 " + newBase);
  
      // 부모가 넘긴 month가 바뀌면, 
      // ‘선택된 날짜(value)’ 도 그 달 1일로 변경
      // (혹은 month를 원하는 날짜로 바로 바꿀 수 있습니다)
      onChange(newBase);
    }, [month, value]);


  const formatYearMonth = (d) =>
    `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;

  const goPrevMonth = () => {
    setViewDate(d =>
      new Date(d.getFullYear(), d.getMonth() - 1, 1)
    );
  };
  const goNextMonth = () => {
    setViewDate(d =>
      new Date(d.getFullYear(), d.getMonth() + 1, 1)
    );
  };

  return (
    <div className="mini-calendar-container">
      <div className="calendar-header">
        <span className="calendar-title">
          {formatYearMonth(viewDate)}
        </span>
        <div className="calendar-nav-buttons">
          <button onClick={goPrevMonth} className="nav-btn">{'<'}</button>
          <button onClick={goNextMonth} className="nav-btn">{'>'}</button>
        </div>
      </div>

      <Calendar
      
        // 2) 선택된 날짜(value)만 바인딩
        value={toKSTDateOnly(value)}
        // defaultValue={toKSTDateOnly(value)}
        onChange={(date) => {
          const fixed = toKSTDateOnly(date);
          console.log("이게 니가 원하는 거야? 기야 아니야?:  " + fixed);
          onChange(fixed); 
          // ↳ viewDate는 month prop 으로만 바뀌도록!
        }}
        // 3) 오로지 viewDate가 month prop / 직접 prev/next 로 제어
        activeStartDate={viewDate}
        locale="ko-KR"
        calendarType="gregory"
        formatDay={(locale, date) => date.getDate().toString()}
        showNavigation={false}
      />
    </div>
  );
}

export default MiniCalendar;
