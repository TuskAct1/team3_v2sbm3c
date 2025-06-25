import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import '../../styles/calendar.css';

function CalendarPage() {
  // 고정된 카테고리 필터
  const FIXED_CATEGORIES = ['급여', '복지', '취미'];

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

  // 필터 상태
  const [activeFixedCategories, setActiveFixedCategories] = useState([...FIXED_CATEGORIES]);
  const [allMemberCategories, setAllMemberCategories] = useState([]);
  const [activeMemberCategories, setActiveMemberCategories] = useState([]);

  // 공휴일 API 호출
  const fetchHolidays = async (year) => {
    try {
      const res = await axios.get('/calendar/holidays', { params: { year } });
      const items = res.data?.response?.body?.items?.item;
      if (!items) return;
      const formatted = items.map(item => ({
        title: item.dateName,
        date: item.locdate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'),
        color: '#ff3333',
      }));
      setEvents(prev => {
        // 공휴일만 갱신, 기존 일정 유지
        const filteredPrev = prev.filter(e => e.color !== '#ff3333');
        return [...filteredPrev, ...formatted];
      });
    } catch (error) {
      console.error('공휴일 API 호출 실패:', error);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const res = await axios.get('/calendar/list_all');
      const data = res.data;
      const formattedEvents = data.map(item => {
        const isFixed = FIXED_CATEGORIES.includes(item.category);
        return {
          id: item.calendarno?.toString(),
          title: item.title,
          date: item.schedule_date,
          color: isFixed ? '#28a745' : '#3788d8',
          schedule_time: item.schedule_time,
          category: item.category,
          description: item.description,
          alarm_yn: item.alarm_yn,
          favorite_yn: item.favorite_yn,
        };
      });
      setEvents(prev => {
        const filteredPrev = prev.filter(e => e.color !== '#3788d8' && e.color !== '#28a745');
        return [...filteredPrev, ...formattedEvents];
      });
    } catch (err) {
      console.error('사용자 일정 불러오기 실패:', err);
    }
  };

  // 초기 로드 시 공휴일, 사용자 일정 가져오기
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    fetchHolidays(currentYear);
    fetchUserEvents();
  }, []);

  // 이벤트 목록 바뀔 때 회원 필터 카테고리 목록 갱신
  useEffect(() => {
    const categories = Array.from(
      new Set(
        events
          .filter(e => e.color !== '#ff3333' && e.category && e.category.trim() !== '')
          .map(e => e.category.trim())
      )
    );
    setAllMemberCategories(categories);
    // 새 카테고리가 생기면 기본적으로 필터에 포함시킴
    setActiveMemberCategories(prev => {
      const updated = [...prev];
      categories.forEach(cat => {
        if (!updated.includes(cat)) updated.push(cat);
      });
      return updated;
    });
  }, [events]);

  // 날짜 클릭 이벤트 핸들러
  const handleDateClick = (info) => {
    if (showForm) return;
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

  // 일정 클릭 이벤트 핸들러
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

  // 폼 데이터 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 새 일정 등록 처리
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingEventId) return; // 편집중일때는 새 등록 막음
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
      setEvents(prev => [
        ...prev,
        {
          title: formData.title,
          date: selectedDate,
          color: '#3788d8',
          schedule_time: formData.schedule_time,
          category: formData.category,
        }
      ]);
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

  // 일정 수정 처리
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

  // 일정 삭제 처리
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

  const getFilteredEvents = () => {
    return events.filter(event => {
      // 공휴일은 무조건 보여줌 (color가 빨강일 때)
      if (event.color === '#ff3333') return true;

      if (!event.category) return false;

      const isFixed = FIXED_CATEGORIES.includes(event.category);
      const isMember = allMemberCategories.includes(event.category);

      if (isFixed) {
        return activeFixedCategories.includes(event.category);
      } else if (isMember) {
        return activeMemberCategories.includes(event.category);
      }
      return false;
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', padding: '1rem' }}>
        {/* 고정 카테고리 필터 */}
        <h2>관리자 필터</h2>
        {FIXED_CATEGORIES.map(cat => (
          <div key={cat} style={{ marginBottom: '0.5rem', fontSize: '16px' }}>
            <label style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={activeFixedCategories.includes(cat)}
                onChange={() => {
                  setActiveFixedCategories(prev =>
                    prev.includes(cat)
                      ? prev.filter(c => c !== cat)
                      : [...prev, cat]
                  );
                }}
                style={{ transform: 'scale(1.7)' }}
              />
              {cat}
            </label>
          </div>
        ))}

        {/* 회원 필터 (기존 카테고리 필터) */}
        <h2>회원 필터</h2>
        {allMemberCategories.map(cat => (
          <div key={cat} style={{ marginBottom: '0.5rem', fontSize: '16px' }}>
            <label style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={activeMemberCategories.includes(cat)}
                onChange={() => {
                  setActiveMemberCategories(prev =>
                    prev.includes(cat)
                      ? prev.filter(c => c !== cat)
                      : [...prev, cat]
                  );
                }}
                style={{ transform: 'scale(1.7)' }}
              />
              {cat}
            </label>
          </div>
        ))}
      </div>

      <div style={{ flex: 2 }} id="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="80vh"
          locale="ko"
          headerToolbar={{
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,dayGridWeek',
          }}
          events={getFilteredEvents()}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          dayMaxEvents={3}
          datesSet={(arg) => {
            const currentYear = arg.view.currentStart.getFullYear();
            fetchHolidays(currentYear);
          }}
          dayCellContent={(arg) => {
          const dateStr = arg.date.toISOString().slice(0, 10);
          return (
            <div style={{ position: 'relative', height: '100%' }}>
              {/* 날짜 숫자: 좌상단 고정 */}
              <div
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  whiteSpace: 'nowrap', // ✅ 줄바꿈 방지!
                }}
              >
                {arg.dayNumberText}
              </div>

              {/* + 버튼: 우상단 고정 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDateClick({ dateStr });
                }}
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-208px',
                  width: '30px',            // ✅ 너비 증가
                  height: '30px',           // ✅ 높이 증가
                  borderRadius: '50%',      
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  fontSize: '20px',         // ✅ 폰트 크기 증가
                  lineHeight: '30px',       // ✅ 텍스트 수직 정렬
                  textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
                }}
                title="일정 추가"
              >
                +
              </button>
            </div>
          );
        }}
        />

        {showForm && (
          <div className="modal-overlay">
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
                  <select
                    name="alarm_yn"
                    value={formData.alarm_yn}
                    onChange={handleInputChange}
                  >
                    <option value="N">없음</option>
                    <option value="Y">있음</option>
                  </select>
                </label>
                <label>
                  즐겨찾기:
                  <select
                    name="favorite_yn"
                    value={formData.favorite_yn}
                    onChange={handleInputChange}
                  >
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
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
