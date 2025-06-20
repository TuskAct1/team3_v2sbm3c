// src/pages/CalendarPage.js (혹은 위치에 맞게)

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import '../styles/calendar.css'; // CSS 경로는 실제 위치에 맞게 수정

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    schedule_time: '',
    category: '',
    description: '',
    alarm_yn: 'N',
    favorite_yn: 'N',
  });
  const [editingEventId, setEditingEventId] = useState(null);

  const fetchHolidays = async (year) => {
    try {
      const res = await axios.get('/calendar/holidays', {
        params: { year },
      });
      const items = res.data?.response?.body?.items?.item;
      if (!items) return;
      const formatted = items.map(item => ({
        title: item.dateName,
        date: item.locdate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'),
        color: '#ff3333',
      }));
      setEvents(prev => [...prev.filter(e => e.color !== '#ff3333'), ...formatted]);
    } catch (error) {
      console.error('공휴일 API 호출 실패:', error);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const res = await axios.get('/calendar/list_all');
      const data = res.data;
      const formattedEvents = data.map(item => ({
        id: item.calendarno?.toString(),
        title: item.title,
        date: item.schedule_date,
        color: '#3788d8',
        schedule_time: item.schedule_time,
        category: item.category,
        description: item.description,
        alarm_yn: item.alarm_yn,
        favorite_yn: item.favorite_yn,
      }));
      setEvents(prev => [...prev.filter(e => e.color !== '#3788d8'), ...formattedEvents]);
    } catch (err) {
      console.error('사용자 일정 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    fetchHolidays(currentYear);
    fetchUserEvents();
  }, []);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setEditingEventId(null);
    setFormData({
      title: '',
      schedule_time: '',
      category: '',
      description: '',
      alarm_yn: 'N',
      favorite_yn: 'N',
    });
    setShowForm(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    setSelectedDate(event.startStr);
    const { schedule_time = '', category = '', description = '', alarm_yn = 'N', favorite_yn = 'N' } = event.extendedProps;
    setFormData({
      title: event.title || '',
      schedule_time,
      category,
      description,
      alarm_yn,
      favorite_yn,
    });
    setEditingEventId(event.id);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingEventId) return;
    try {
      await axios.post('/calendar/create', {
        memberno: 1,
        adminno: 1,
        title: formData.title,
        schedule_date: selectedDate,
        schedule_time: formData.schedule_time,
        category: formData.category,
        description: formData.description,
        alarm_yn: formData.alarm_yn,
        favorite_yn: formData.favorite_yn,
      });
      setEvents(prev => [...prev, { title: formData.title, date: selectedDate, color: '#3788d8' }]);
      setShowForm(false);
      setFormData({
        title: '',
        schedule_time: '',
        category: '',
        description: '',
        alarm_yn: 'N',
        favorite_yn: 'N',
      });
    } catch (error) {
      console.error('일정 등록 실패:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/calendar/update/${editingEventId}`, {
        title: formData.title,
        schedule_date: selectedDate,
        schedule_time: formData.schedule_time,
        category: formData.category,
        description: formData.description,
        alarm_yn: formData.alarm_yn,
        favorite_yn: formData.favorite_yn,
        memberno: 1,
        adminno: 1,
      });
      await fetchUserEvents();
      setShowForm(false);
      setEditingEventId(null);
    } catch (err) {
      console.error('수정 실패:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/calendar/delete/${editingEventId}`);
      await fetchUserEvents();
      setShowForm(false);
      setEditingEventId(null);
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  return (
    <div id="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        locale="ko"
        headerToolbar={{
          start: 'prev,next today',
          center: 'title',
          end: 'dayGridMonth,dayGridWeek',
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        datesSet={(arg) => {
          const currentYear = arg.view.currentStart.getFullYear();
          fetchHolidays(currentYear);
        }}
      />

      {showForm && (
        <div className="modal">
          <h3>📅 {editingEventId ? '일정 수정' : '일정 등록'} - {selectedDate}</h3>
          <form onSubmit={handleFormSubmit} className="modal-form">
            <input
              name="title"
              placeholder="제목"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="time"
              name="schedule_time"
              value={formData.schedule_time}
              onChange={handleInputChange}
              required
            />
            <input
              name="category"
              placeholder="카테고리"
              value={formData.category}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="설명"
              value={formData.description}
              onChange={handleInputChange}
            />
            <label>
              알람:
              <select name="alarm_yn" value={formData.alarm_yn} onChange={handleInputChange}>
                <option value="N">없음</option>
                <option value="Y">있음</option>
              </select>
            </label>
            <label>
              즐겨찾기:
              <select name="favorite_yn" value={formData.favorite_yn} onChange={handleInputChange}>
                <option value="N">아니오</option>
                <option value="Y">예</option>
              </select>
            </label>
            <div className="button-group">
              {editingEventId ? (
                <>
                  <button type="button" onClick={handleUpdate}>수정</button>
                  <button type="button" onClick={handleDelete}>삭제</button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingEventId(null); }}>취소</button>
                </>
              ) : (
                <>
                  <button type="submit">등록</button>
                  <button type="button" onClick={() => setShowForm(false)}>취소</button>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
