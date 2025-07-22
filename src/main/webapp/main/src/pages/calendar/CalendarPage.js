import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import axios from 'axios';
import '../../styles/calendar.css';
import SearchToggleBar from './SearchToggleBar';
// 미니 캘린더 import 
import MiniCalendar from './MiniCalendar'; // 위에서 만든 컴포넌트
// import './CalendarPage.css'; // 스타일 따로 구성 가능

import moment from 'moment-timezone';

axios.defaults.withCredentials = true;

function CalendarPage() {
  const FIXED_CATEGORIES = ['급여', '복지', '취미', '생일'];

  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  const [formData, setFormData] = useState({
    title: '',  category: '', description: '',
    alarm_yn: 'N', start_time: '', end_time: '', start_date: '', end_date: '', imageFile: null
  });

    // ✅ 여기 넣기
  const formatKoreanDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  };

  const [activeFixedCategories, setActiveFixedCategories] = useState([...FIXED_CATEGORIES]);
  const [allMemberCategories, setAllMemberCategories] = useState([]);
  const [activeMemberCategories, setActiveMemberCategories] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUserInfo(JSON.parse(userData));
      } catch (err) {
        console.error('사용자 정보 파싱 실패', err);
      }
    }
  }, []);

  // useEffect(() => {
  //   const year = new Date().getFullYear();
  //   fetchHolidays(year);
  //   fetchUserEvents();
  // }, []);

  useEffect(() => {
    const year = new Date().getFullYear();
    fetchAllEvents(year);
  }, []);

  useEffect(() => {
    const categories = Array.from(new Set(
      events.filter(e => e.color === '#3788d8' && typeof e.category === 'string' && e.category.trim())
            .map(e => e.category.trim())
    ));
    setAllMemberCategories(categories);
    setActiveMemberCategories(prev => {
      const updated = [...prev];
      categories.forEach(cat => {
        if (!updated.includes(cat)) updated.push(cat);
      });
      return updated;
    });
  }, [events]);



const fetchAllEvents = async (year) => {
  try {
    // 병렬 요청
    const [holidayRes, userRes] = await Promise.all([
      axios.get('/calendar/holidays', { params: { year } }),
      axios.get('/calendar/list_all')
    ]);

    const holidays = holidayRes.data?.response?.body?.items?.item || [];
    const holidayEvents = holidays.map(item => {
      const locdate = item.locdate.toString();
      const dateStr = `${locdate.substring(0, 4)}-${locdate.substring(4, 6)}-${locdate.substring(6, 8)}`;
      return {
        title: item.dateName,
        start: dateStr,
        color: '#ff3333',
        textColor: '#fff',
        category: '공휴일',
      };
    });

    const userEvents = userRes.data.map(item => {
      const isAdmin = item.adminno !== null;
      const isAllDay = (!item.start_time || item.start_time === '00:00') &&
                       (!item.end_time || item.end_time === '00:00');
      return {
        ...item,
        id: item.calendarno?.toString(),
        title: item.title,
        start: moment.tz(`${item.start_date} ${item.start_time || '00:00'}`, 'YYYY-MM-DD HH:mm', 'Asia/Seoul').toDate(),
        end: moment.tz(`${item.end_date} ${item.end_time || '00:00'}`, 'YYYY-MM-DD HH:mm', 'Asia/Seoul').toDate(),
        image: item.image ? `${item.image}` : null,
        thumbnail: item.thumbnail ? `${item.thumbnail}` : null,
        color: isAdmin ? '#28a745' : '#3788d8',
        allDay: isAllDay,
      };
    });

    // 우선순위대로 정렬
    const allEvents = [...holidayEvents, ...userEvents].sort((a, b) => {
      const priority = color => {
        if (color === '#ff3333') return 0;
        if (color === '#28a745') return 1;
        return 2;
      };
      return priority(a.color) - priority(b.color);
    });

    setEvents(allEvents);

  } catch (err) {
    console.error('일정 불러오기 실패:', err);
  }
};



const fetchHolidays = async (year) => {
  try {
    const res = await axios.get('/calendar/holidays', { params: { year } });
    const items = res.data?.response?.body?.items?.item;
    if (!items) return;

    const formatted = items.map(item => {
      const locdate = item.locdate.toString(); // e.g., "20250101"
      const dateStr = `${locdate.substring(0, 4)}-${locdate.substring(4, 6)}-${locdate.substring(6, 8)}`; // "2025-01-01"
      
      return {
        title: item.dateName,
        start: dateStr,
        color: '#ff3333',
        textColor: '#fff',
        category: '공휴일'
      };
    });

    setEvents(prev => [
      ...prev.filter(e => e.color !== '#ff3333'),
      ...formatted,
    ]);
  } catch (error) {
    console.error('공휴일 API 호출 실패:', error);
  }
};


  const fetchUserEvents = async () => {
    try {
      const res = await axios.get('/calendar/list_all');
      const formatted = res.data.map(item => {
        const isAdmin = item.adminno !== null;
        const isHoliday = item.color === '#ff3333';  // ✅ 공휴일 기준은 color

        // ✅ 시간 정보가 없으면 allDay로 처리
        const isAllDay =
          (!item.start_time || item.start_time === '00:00') &&
          (!item.end_time || item.end_time === '00:00');

        return {
          ...item,
          id: item.calendarno?.toString(),
          title: item.title,
          // start: `${item.start_date}T${item.start_time || '00:00'}`,
          // end: `${item.end_date}T${item.end_time || '00:00'}`,


          start: moment.tz(`${item.start_date} ${item.start_time || '00:00'}`, 'YYYY-MM-DD HH:mm', 'Asia/Seoul').toDate(),
          end: moment.tz(`${item.end_date} ${item.end_time || '00:00'}`, 'YYYY-MM-DD HH:mm', 'Asia/Seoul').toDate(),


          image: item.image ? `${item.image}` : null,
          thumbnail: item.thumbnail ? `${item.thumbnail}` : null,
          color: isAdmin ? '#28a745' : '#3788d8',
           allDay: isAllDay, // ✅ 핵심!
        };
      });

    // ✅ 공휴일 → 관리자 → 회원 순으로 정렬
    const sorted = [...formatted].sort((a, b) => {
      const priority = color => {
        if (color === '#ff3333') return 0;     // 공휴일
        if (color === '#28a745') return 1;     // 관리자
        return 2;                              // 회원
      };
      return priority(a.color) - priority(b.color);
    });
    setEvents(prev =>  [...prev.filter(e => !['#3788d8', '#28a745', '#ff3333'].includes(e.color)), ...sorted]);
    } catch (err) {
      console.error('일정 불러오기 실패:', err);
    }
  };

  const handleDateClick = (info) => {
    if (showForm) return;
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);
    setEditingEventId(null);
    setFormData({
      title: '', category: '', description: '',
      alarm_yn: 'N', start_time: '08:00', end_time: '09:00', start_date: clickedDate, end_date: clickedDate, imageFile: null
    });
    setShowForm(true);
  };

  const handleEventClick = (info) => {
    const e = info.event;
    setSelectedDate(e.startStr);
    setEditingEventId(e.id);
    setFormData({
      title: e.title || '',
      category: e.extendedProps.category || '',
      description: e.extendedProps.description || '',
      alarm_yn: e.extendedProps.alarm_yn || 'N',
      start_date: e.extendedProps.start_date || '',
      end_date: e.extendedProps.end_date || '',
      image: e.extendedProps.image || '',         // ✅ 추가s
      imageFile: null,
      start_time: e.extendedProps.start_time || '',
      end_time: e.extendedProps.end_time || '',
    });
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (editingEventId || !userInfo) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('alarm_yn', formData.alarm_yn);
    data.append('start_date', formData.start_date);
    data.append('end_date', formData.end_date);
    data.append('start_time', formData.start_time);
    data.append('end_time', formData.end_time);

    console.log(userInfo.role)
    
    if (userInfo.role === 'member') data.append('memberno', userInfo.memberno);
    if (userInfo.role === 'admin') data.append('adminno', userInfo.adminno);
    if (formData.imageFile) data.append('file', formData.imageFile);

    console.log("userInfo.role: " + userInfo.role)
    console.log("userInfo.memberno: " + userInfo.memberno)
    console.log("userInfo.adminno: " + userInfo.adminno)


    try {
      await axios.post('/calendar/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchUserEvents();
      setShowForm(false);
    } catch (err) {
      console.error('등록 실패:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();

      data.append('title', formData.title ?? '');
      data.append('category', formData.category ?? '');
      data.append('description', formData.description ?? '');
      data.append('alarm_yn', formData.alarm_yn ?? 'N');
      data.append('start_date', formData.start_date ?? '');
      data.append('end_date', formData.end_date ?? '');
      data.append('start_time', formData.start_time ?? '');
      data.append('end_time', formData.end_time ?? '');

      if (userInfo?.role === 'member') data.append('memberno', userInfo.memberno);
      if (userInfo?.role === 'admin') data.append('adminno', userInfo.adminno);

      if (formData.imageFile) {
        data.append('image', formData.imageFile);  // ✅ 여기만 바꿔주면 됨
      }

      await axios.post(`/calendar/update/${editingEventId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      await fetchUserEvents();
      setShowForm(false);
      setEditingEventId(null);
    } catch (err) {
      console.error('수정 실패:', err.response?.data || err);
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

  const getFilteredEvents = () =>
    events.filter(event => {
      if (searchKeyword) {
        return event.title?.toLowerCase().includes(searchKeyword.toLowerCase());
      }
      if (event.color === '#ff3333') return true;
      if (!event.category) return false;
      if (event.color === '#28a745') {
        return activeFixedCategories.includes(event.category);
      } else if (event.color === '#3788d8') {
        return activeMemberCategories.includes(event.category);
      }
      return false;
    });

   return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      <div style={{ width: '240px', padding: '1rem', overflowY: 'auto' }}>
        {/* ✅ 미니 캘린더 추가 */}
        <div style={{ marginBottom: '1rem' }}>
          <MiniCalendar
            value={new Date(selectedDate || new Date())}
            onChange={(date) => {
              const dateStr = date.toISOString().split('T')[0];
              setSelectedDate(dateStr);
            }}
          />
        </div>

        {userInfo ? (
          <div>로그인: {userInfo.role === 'admin' ? '관리자' : '회원'} ({userInfo.username || userInfo.name})</div>
        ) : (
          <div>로그인 정보 없음</div>
        )}

        <h2>관리자 필터</h2>
        {FIXED_CATEGORIES.map(cat => (
          <label key={cat}>
            <input
              type="checkbox"
              checked={activeFixedCategories.includes(cat)}
              onChange={() => setActiveFixedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
            /> {cat}
          </label>
        ))}

        <h2>회원 필터</h2>
        {allMemberCategories.map(cat => (
          <label key={cat}>
            <input
              type="checkbox"
              checked={activeMemberCategories.includes(cat)}
              onChange={() => setActiveMemberCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
            /> {cat}
          </label>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <SearchToggleBar
          showSearch={showSearchBar}
          onToggle={() => {
            setShowSearchBar(prev => !prev);
            if (showSearchBar) setSearchKeyword('');
          }}
          keyword={searchKeyword}
          onChange={setSearchKeyword}
        />

        {searchKeyword ? (
          <div style={{ padding: '1rem', backgroundColor: '#fff' }}>
            <h3 style={{ marginBottom: '1rem' }}>검색 결과</h3>
            {getFilteredEvents().length === 0 ? (
                            <p>일치하는 일정이 없습니다.</p>
                          ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                              {getFilteredEvents().map((event, idx) => {
                const date = new Date(event.start);
                const day = date.getDate(); // 일자
                const weekday = date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }); // 전체 날짜

                // 색상 분류
                const dotColor =
                  event.color === '#ff3333' ? '#ff3333' : // 공휴일
                  event.color === '#28a745' ? '#28a745' : // 관리자
                  '#3788d8';                              // 회원

                return (
                  <li key={idx} style={{
                    display: 'flex', alignItems: 'center', padding: '0.8rem 1rem',
                    borderBottom: '1px solid #eee', fontSize: '14px'
                  }}>
                    <div style={{ width: '40px', fontWeight: 'bold', textAlign: 'center' }}>{day}</div>
                    <div style={{ width: '200px', color: '#555' }}>{weekday}</div>
                    <div style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      backgroundColor: dotColor, margin: '0 12px'
                    }}></div>
                    <div style={{ fontWeight: 'bold', flex: 1 }}>{event.title}</div>
                  </li>
                );
              })}
              </ul>
            )}
          </div>
        ) : (
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale="ko"
              height="100%"
              headerToolbar={{
                start: 'prev,next today',
                center: 'title',
                end: 'timeGridWeek,dayGridMonth',
              }}
              buttonText={{
                today: '오늘',
                month: '월간',
                week: '주간',
                day: '일간',
                list: '리스트',
              }}
              allDaySlot={true}
              slotMinTime="00:00:00"
              slotMaxTime="25:00:00"
              nowIndicator={true}
              events={getFilteredEvents()}
              eventDisplay="block" // ✅ 이 줄 추가!
              dayMaxEventRows={3} // ✅ 이 줄을 추가하면 "더보기" 기능 활성화됨
              eventContent={(arg) => (
                <div style={{ whiteSpace: 'normal', fontSize: '12px', padding: '2px' }}>
                  <b>{arg.event.title}</b>
                </div>
              )}
              dateClick={handleDateClick}
              eventClick={handleEventClick}

              dayCellContent={(args) => {
              const dateStr = args.date.toISOString().split('T')[0]; // yyyy-mm-dd

              return (
                <div style={{ position: 'relative' }}>
                  {/* 날짜 숫자 */}
                  <div>{args.dayNumberText}</div>

                  {/* + 버튼 */}
                  <button
                    onClick={() => handleDateClick({ dateStr })}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '4px',
                      border: '1px solid #aaa',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '14px',
                      lineHeight: '16px',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    +
                  </button>
                </div>
              );
            }}

            />
        )}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{editingEventId ? '일정 수정' : '일정 등록'} - {selectedDate ? formatKoreanDate(selectedDate) : ''}</h3>
              <form onSubmit={handleFormSubmit} className="modal-form">
                <input name="title" placeholder="제목" value={formData.title} onChange={handleInputChange} required />
                <label>시작일: <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required /></label>
                <label>시작 시간:
                  <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} required />
                </label>
                <label>종료일: <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required /></label>
                <label>종료 시간:
                  <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} required />
                </label>
                <input name="category" placeholder="카테고리" value={formData.category} onChange={handleInputChange} />
                <textarea name="description" placeholder="설명" value={formData.description} onChange={handleInputChange} />
                <label>이미지 업로드:
                <input type="file" accept="image/*" onChange={(e) => setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }))} /></label>
                {formData.imageFile && ( <img src={URL.createObjectURL(formData.imageFile)} alt="미리보기" style={{ width: '100px', marginTop: '10px' }} />)}
                {editingEventId && formData.image && (
                  <div style={{ marginTop: '10px' }}>
                    <p>등록된 이미지:</p>
                    <img src={`/calendar/storage/${formData.image}`} alt="일정 이미지" style={{ width: '150px' }} />
                  </div>
                )}
                <label>알람: <select name="alarm_yn" value={formData.alarm_yn} onChange={handleInputChange}><option value="N">없음</option><option value="Y">있음</option></select></label>
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
