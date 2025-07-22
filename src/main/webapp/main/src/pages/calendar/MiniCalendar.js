import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/MiniCalendar.css';

function MiniCalendar({ value, onChange }) {
  const [viewDate, setViewDate] = useState(value); // 현재 보고 있는 달

  const formatYearMonth = (date) =>
    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;

  // 이전/다음 달 이동
  const goPrevMonth = () => {
    const prev = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
    setViewDate(prev);
  };

  const goNextMonth = () => {
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    setViewDate(next);
  };

  return (
    <div className="mini-calendar-container">
      <div className="calendar-header">
        <span className="calendar-title">{formatYearMonth(viewDate)}</span> {/* 왼쪽 정렬 */}
        <div className="calendar-nav-buttons">
          <button onClick={goPrevMonth} className="nav-btn">{'<'}</button>
          <button onClick={goNextMonth} className="nav-btn">{'>'}</button>
        </div>
      </div>

      <Calendar
        value={value}
        onChange={(date) => {
          onChange(date);       // 선택된 날짜 변경
          setViewDate(date);    // 화면도 선택된 달로 이동
        }}
        activeStartDate={viewDate}   // ✅ 현재 보고 있는 달 유지
        locale="ko-KR"
        calendarType="gregory"
        formatDay={(locale, date) => date.getDate().toString()}
        showNavigation={false}
      />
    </div>
  );
}

export default MiniCalendar;
