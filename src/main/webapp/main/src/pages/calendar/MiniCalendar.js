import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/MiniCalendar.css';

function MiniCalendar({ value, onChange }) {
  return (
    <Calendar
      value={value}
      onChange={onChange}
      locale="ko-KR"
      calendarType="gregory"
      formatDay={(locale, date) => date.getDate().toString()}  // ✅ 핵심 부분
    />
  );
}

export default MiniCalendar;