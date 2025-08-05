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
  import { FaTrash } from 'react-icons/fa';

  axios.defaults.withCredentials = true;


  function linkify(text) {
    return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
      /^https?:\/\//.test(part)
        ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#007bff',        // 파란색
              textDecoration: 'underline' // 밑줄
            }}
          >
            {part}
          </a>
        )
        : part
    );
  }


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
      alarm_yn: 'N', start_time: '', end_time: '', start_date: '', end_date: '', imageFile: null, removeImage: false
    });

    const [previewModalData, setPreviewModalData] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

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

    // 이미지 확대
    const [showImageModal, setShowImageModal] = useState(false);

    // 미니 캘린더에 달정보 전송
    const [mainViewMonth, setMainViewMonth] = useState(new Date());

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
        axios.get('http://121.78.128.139:9093/calendar/holidays', { params: { year } }),
        axios.get('http://121.78.128.139:9093/calendar/list_all')
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
        // const isAdmin = item.adminno !== null;
        // const isAllDay = (!item.start_time || item.start_time === '00:00') &&
        //                 (!item.end_time || item.end_time === '00:00');
        const isAdmin = item.adminno !== null;
        // “복지 일정” 고정 카테고리인지 체크
        const category = item.category?.trim();
        const isFixedCategory = FIXED_CATEGORIES.includes(category);
        // 원래 all‑day 판단 (시간 정보가 없으면)
        const isTimeMissing = (!item.start_time || item.start_time === '00:00') &&
                              (!item.end_time   || item.end_time   === '00:00');
        // 고정 카테고리면 무조건 allDay
        const isAllDay = isFixedCategory || isTimeMissing;
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
      const res = await axios.get('http://121.78.128.139:9093/calendar/holidays', { params: { year } });
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
        const res = await axios.get('http://121.78.128.139:9093/calendar/list_all');
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

    // const handleEventClick = (info) => {
    //   const e = info.event;
    //   setSelectedDate(e.startStr);
    //   setEditingEventId(e.id);
    //   setFormData({
    //     title: e.title || '',
    //     category: e.extendedProps.category || '',
    //     description: e.extendedProps.description || '',
    //     alarm_yn: e.extendedProps.alarm_yn || 'N',
    //     start_date: e.extendedProps.start_date || '',
    //     end_date: e.extendedProps.end_date || '',
    //     image: e.extendedProps.image || '',         // ✅ 추가s
    //     imageFile: null,
    //     start_time: e.extendedProps.start_time || '',
    //     end_time: e.extendedProps.end_time || '',
    //   });
    //   setShowForm(true);
    // };

    const handleEventClick = (info) => {
      const e = info.event;

      setPreviewModalData({
        id: e.id,
        title: e.title,
        start: e.startStr,
        end: e.endStr,
        alarm_yn: e.extendedProps.alarm_yn,
        category: e.extendedProps.category || '없음',
        description: e.extendedProps.description || '',
        image: e.extendedProps.image || '',
        start_date: e.extendedProps.start_date || '',
        end_date: e.extendedProps.end_date || '',
        start_time: e.extendedProps.start_time || '',
        end_time: e.extendedProps.end_time || '',
        color: e.backgroundColor,
      });
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
        await axios.post('http://121.78.128.139:9093/calendar/create', data, {
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
        if (formData.removeImage) {
          data.append('removeImage', 'Y');
        }

        if (formData.imageFile) {
          data.append('image', formData.imageFile);  // ✅ 여기만 바꿔주면 됨
        }

        await axios.post(`http://121.78.128.139:9093/calendar/update/${editingEventId}`, data, {
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
        await axios.delete(`http://121.78.128.139:9093/calendar/delete/${editingEventId}`);
        await fetchUserEvents();
        setShowForm(false);
        setEditingEventId(null);
      } catch (err) {
        console.error('삭제 실패:', err);
      }
    };

    const onCloseClick = () => {
      setPreviewModalData(null);
      setConfirmDeleteOpen(false);
    };

    const onEditClick = () => {
      // if (!previewModalData) return;

      setEditingEventId(previewModalData.id);

      setFormData({
        title: previewModalData.title || '',
        category: previewModalData.category || '',
        description: previewModalData.description || '',
        alarm_yn: previewModalData.alarm_yn || 'N',
        start_date: previewModalData.start?.slice(0, 10) || '',
        end_date: previewModalData.end?.slice(0, 10) || '',
        start_time: previewModalData.start?.slice(11, 16) || '',
        end_time: previewModalData.end?.slice(11, 16) || '',
        image: previewModalData.image || '',
        imageFile: null,
        removeImage: false,
      });

      setSelectedDate(previewModalData.start?.slice(0, 10) || '');
      setShowForm(true);
      setPreviewModalData(null);
    };

    const onDeleteClick = () => {
      setConfirmDeleteOpen(true);
    };


    // 검색 결과 클릭 시 호출할 함수
    const handleSearchResultClick = (event) => {
      // (선택) 바로 확인창을 띄우고 싶으면 아래처럼 window.confirm 사용
      // if (!window.confirm(`${event.title} 일정을 보시겠습니까?`)) return;

      // 기존에 쓰던 previewModalData 셋업 로직 재사용
      // start_date, start_time, end_date, end_time 은 문자열로 보관 중
      const startStr = `${event.start_date}T${event.start_time || '00:00'}`;
      const endStr   = `${event.end_date}T${event.end_time   || '00:00'}`;

      setPreviewModalData({
        id:          event.id,
        title:       event.title,
        start:       startStr,     // 문자열이므로 .slice() 가능
        end:         endStr,
        alarm_yn:    event.alarm_yn,
        category:    event.category,
        description: event.description,
        image:       event.image,
        start_date:  event.start_date,
        end_date:    event.end_date,
        start_time:  event.start_time,
        end_time:    event.end_time,
        color:       event.color,
      });
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
        <div style={{ width: '280px', padding: '1rem', overflowY: 'auto' }}>
          {/* ✅ 미니 캘린더 추가 */}
          <div style={{ marginBottom: '1rem' }}>
            <MiniCalendar
              value={new Date(selectedDate || new Date())}
              onChange={(date) => {
                const dateStr = date.toISOString().split('T')[0];
                setSelectedDate(dateStr);
              }}
              month={mainViewMonth}    
            />
          </div>

          {/* {userInfo ? (
            <div>로그인: {userInfo.role === 'admin' ? '관리자' : '회원'} ({userInfo.username || userInfo.name})</div>
          ) : (
            <div>로그인 정보 없음</div>
          )} */}
        <div className="filterContainer">
            <h2 className="filter-header filter-header--welfare">
              복지 일정
            </h2>
            {FIXED_CATEGORIES.map(cat => (
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={activeFixedCategories.includes(cat)}
                  onChange={() => setActiveFixedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                /> {cat}
              </label>
            ))}

            {/* “내 할 일” 헤더 */}
            <h2 className="filter-header filter-header--task">
              내 할 일
            </h2>
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
                  {getFilteredEvents().map((event, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSearchResultClick(event)}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.8rem 1rem',
                        borderBottom: '1px solid #eee',
                        fontSize: '14px'
                      }}
                    >
                      {/* 일자 */}
                      <div style={{ width: '40px', fontWeight: 'bold', textAlign: 'center' }}>
                        {new Date(event.start).getDate()}
                      </div>
                      {/* 전체 날짜 + 요일 */}
                      <div style={{ width: '200px', color: '#555' }}>
                        {new Date(event.start).toLocaleDateString('ko-KR', {
                          year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'
                        })}
                      </div>
                      {/* 색상 점 */}
                      <div style={{
                        width: '12px', height: '12px', borderRadius: '50%',
                        backgroundColor:
                          event.color === '#ff3333' ? '#ff3333' :
                          event.color === '#28a745' ? '#28a745' :
                          '#3788d8',
                        margin: '0 12px'
                      }} />
                      {/* 제목 */}
                      <div style={{ fontWeight: 'bold', flex: 1 }}>
                        {event.title}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="ko"
                height="80vh"
                // height="auto"            // 또는 고정값: 650px, 700px 등
                contentHeight={900}      // 또는 'auto'
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

                dayHeaderContent={(arg) => {
                  const date = arg.date;
                  const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' }); // ex: 화
                  const day = date.getDate(); // ex: 8
                  return `${weekday} ${day}`;
                }}

                fixedWeekCount={false}
                

                /* ───────────────────────────────────── */
                /* 뷰별 포맷 세부 설정                 */
                /* ───────────────────────────────────── */
                  views={{
                    timeGridWeek: {
                      // 1) 타이틀: "2025.07"
                      titleFormat: function (arg) {
                        const date = arg.start?.marker || arg.date?.marker || new Date();

                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        return `${year}.${month}`;
                      },
                        dayHeaderContent: (args) => {
                        const date = new Date(args.date.marker);
                        const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' }); // 예: 화
                        const day = date.getDate(); // 예: 22

                        return {
                          html: `
                            <div style="
                              display: flex;
                              flex-direction: column;
                              align-items: center;
                              font-weight: bold;
                              font-size: 15px;
                            ">
                              <span style="font-size: 16px; color: #333;">${weekday}</span>
                              <span style="font-size: 18px; color: #000;">${day}</span>
                            </div>
                          `,
                        };
                      },
                    }
                  }}

                  datesSet={({ view }) => {
                  // 1) 격자 시작/끝
                  const start = view.activeStart;   // 격자가 시작하는 날짜(보통 해당 달 앞의 일요일)
                  const end   = view.activeEnd;     // 격자가 끝나는 날짜(보통 다음 달 첫 주)

                  // 2) 중간 타임스탬프 계산
                  const midTime = (start.getTime() + end.getTime()) / 2;
                  const midDate = new Date(midTime);

                  // 3) 중간 날짜의 연·월 → 해당 월의 1일로
                  const monthDate = new Date(midDate.getFullYear(), midDate.getMonth(), 10);

                  // 4) 이 값을 미니캘린더에 넘깁니다
                  setMainViewMonth(monthDate);
                }}


                allDaySlot={true}
                slotMinTime="00:00:00"
                slotMaxTime="25:00:00"
                nowIndicator={true}
                events={getFilteredEvents()}
                eventDisplay="block" // ✅ 이 줄 추가!
                dayMaxEventRows={3} // ✅ 이 줄을 추가하면 "더보기" 기능 활성화됨
                eventContent={(arg) => (
                  <div className="fc-event-title" style={{whiteSpace:'normal',fontSize:12,padding:2}}>
                    <b>{arg.event.title}</b>
                  </div>
                )}
                dateClick={handleDateClick}
                eventClick={handleEventClick}


              dayCellDidMount={(info) => {
                // if (info.view.type === 'dayGridMonth') return; // ❌ 월간에서는 무시하고 주간에서만 실행

                const d = info.date;
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const dd = String(d.getDate()).padStart(2, '0');
                const dateStr = `${yyyy}-${mm}-${dd}`;

                // ✅ 등록 버튼 만들기
                const btn = document.createElement('button');
                btn.className = 'custom-add-button';
                btn.onclick = () => handleDateClick({ dateStr });

                const icon = document.createElement('img');
                icon.src = '/images/PlusCircle.png';
                icon.alt = '추가';
                icon.style.width = '24px';
                icon.style.height = '24px';
                btn.appendChild(icon);

                // ✅ 요일 + 날짜 텍스트 만들기 (예: 화 23)
                const weekday = d.toLocaleDateString('ko-KR', { weekday: 'short' }); // 화
                const day = d.getDate();

                const label = document.createElement('div');
                
                if (info.view.type !== 'dayGridMonth') {

                  label.textContent = `${weekday} ${day}`;
                  label.style.position = 'absolute';
                  label.style.top = '4px';
                  label.style.left = '6px';
                  label.style.fontSize = '12px';
                  label.style.color = '#333';
                  label.style.fontWeight = 'bold';
                }

                // ✅ 버튼 스타일도 우상단으로
                btn.style.position = 'absolute';
                btn.style.top = '2px';
                btn.style.right = '4px';
                btn.style.background = 'transparent';
                btn.style.border = 'none';
                btn.style.cursor = 'pointer';

                // ✅ 프레임에 추가
                const frame = info.el.querySelector('.fc-daygrid-day-frame');
                if (frame) {
                  frame.style.position = 'relative'; // 꼭 있어야 위의 absolute들이 정상 위치됨
                  frame.appendChild(label);
                  frame.appendChild(btn);
                }
              }}
              />

              
          )}

          {showForm && (
            <div className="modal calendar-modal">
            <div className="modal-overlay">
              <div className="modal">
                <h3>{editingEventId ? '일정 수정' : '일정 등록'} - {formatKoreanDate(formData.start_date)}</h3>
                <form onSubmit={handleFormSubmit} className="calendar-form">
                <div className="form-group">
                  <label>제목</label>
                  <input name="title" value={formData.title} onChange={handleInputChange} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>시작일</label>
                    <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>시작 시간</label>
                    <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>종료일</label>
                    <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>종료 시간</label>
                    <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label>카테고리</label>
                  <input name="category" value={formData.category} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                  <label>설명</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} />
                </div>

                <div className="form-group">
                  <label>이미지 업로드</label>
                  <input type="file" accept="image/*" onChange={(e) => setFormData(prev => ({ ...prev, imageFile: e.target.files[0] }))} />
                </div>

                {formData.imageFile && (
                  <img src={URL.createObjectURL(formData.imageFile)} alt="미리보기" style={{ width: '100px', marginTop: '10px' }} />
                )}

                {editingEventId && formData.image && (
                  <div>
                    <p>등록된 이미지:</p>
                    {/* ① 여기에 relative 컨테이너 추가 */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={`/calendar/storage/${formData.image}`}
                        alt="일정 이미지"
                        style={{ width: '150px', display: 'block' }}
                      />
                      {/* ② 삭제 버튼은 이 컨테이너 안에서 absolute */}
                      <button
                        type="button"
                        aria-label="이미지 삭제"
                        style={{
                          position: 'absolute',
                          bottom: '4px',
                          right: '4px',
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#fff'
                        }}
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            image: null,
                            removeImage: true
                          }))
                        }
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>알람</label>
                  <select name="alarm_yn" value={formData.alarm_yn} onChange={handleInputChange}>
                    <option value="N">없음</option>
                    <option value="Y">있음</option>
                  </select>
                </div>

                <div className="form-button-group">
                  {editingEventId ? (
                    <>
                      <button type="button" className="primary" onClick={handleUpdate}>수정</button>
                      <button type="button" className="danger" onClick={handleDelete}>삭제</button>
                      <button type="button" onClick={() => { setShowForm(false); setEditingEventId(null); }}>취소</button>
                    </>
                  ) : (
                    <>
                      <button type="submit" className="primary">등록</button>
                      <button type="button" onClick={() => setShowForm(false)}>취소</button>
                    </>
                  )}
                </div>
              </form>

              </div>
            </div>
            </div>
          )}

          {previewModalData && (
            <div className="modal-overlay">
              <div className="preview-modal">
                <div className="modal-header">
                  <div className="modal-title">{previewModalData.title}</div>
                  {/* 🔽 조건부 렌더링 시작 */}
                  <div className="modal-icons">
                    {(userInfo?.role === 'admin' || previewModalData.color === '#3788d8') && (
                      <>
                        <button onClick={onEditClick}>
                          <img src="/images/cal_edit.png" alt="수정" className="icon-button" />
                        </button>
                        <button onClick={onDeleteClick}>
                          <img src="/images/cal_delete.png" alt="삭제" className="icon-button" />
                        </button>
                      </>
                    )}
                    <button onClick={onCloseClick}>
                      <img src="/images/cal_close.png" alt="닫기" className="icon-button" />
                    </button>
                  </div>
                </div>

                <div className="modal-body">

                  {/* <p>{formatKoreanDate(previewModalData.start)}<br />
                    {previewModalData.start.slice(11, 16)} ~ {previewModalData.end.slice(11, 16)}</p> */}
                  <p>
                    {/* 날짜 범위: 시작일과 종료일이 같으면 한 번만, 다르면 “~”로 연결 */}
                    {previewModalData.start_date === previewModalData.end_date
                      ? formatKoreanDate(previewModalData.start_date)
                      : `${formatKoreanDate(previewModalData.start_date)} ~ ${formatKoreanDate(previewModalData.end_date)}`
                    }
                    <br/>
                    {/* 시간 표시: 시작 시간이 있으면, 종료 시간이 있을 때만 “~” 포함 */}
                    {previewModalData.start_time && (
                      <>
                        {previewModalData.start_time}
                        {previewModalData.end_time ? ` ~ ${previewModalData.end_time}` : ''}
                      </>
                    )}
                  </p>  

                  {/* ✅ 등록된 이미지가 있을 때만 표시 */}
                  {previewModalData.image && (
                    <div className="modal-preview-image-wrapper">
                      <img
                        src={`/calendar/storage/${previewModalData.image}`}
                        alt="등록된 이미지"
                        className="modal-preview-image"
                        onClick={() => setShowImageModal(true)} // ✅ 클릭 시 모달 열기
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  )}

                  {/* 설명(일정 내용) */}
                  {previewModalData.description && (
                  <p
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    📝 {linkify(previewModalData.description)}
                  </p>
                  )}
                  <p>🔔 {previewModalData.alarm_yn === 'Y' ? '알람 있음' : '알람 없음'}</p>
                  <p>📅 {previewModalData.category}</p>
                                      {/* <p>
                      <img src="/images/cal_alarm.png" alt="알람" className="icon-inline" />
                      {previewModalData.alarm_yn === 'Y' ? '알람 있음' : '알람 없음'}
                    </p>

                    <p>
                      <img src="/images/cal_.png" alt="카테고리" className="icon-inline" />
                      {previewModalData.category}
                    </p> */}
                </div>
              </div>
            </div>
          )}

          {confirmDeleteOpen && (
            <div className="modal-overlay">
              <div className="confirm-modal">
                <p>정말로 삭제하시겠습니까?</p>
                <div className="form-button-group">
                <button
                  className="danger"
                  onClick={async () => {
                    try {
                      // previewModalData.id 로 삭제 요청
                      await axios.delete(`http://121.78.128.139:9093/calendar/delete/${previewModalData.id}`);
                      // 삭제 후 이벤트 다시 불러오기
                      await fetchUserEvents();
                    } catch (err) {
                      console.error('삭제 실패:', err);
                    }
                    // 모달 닫기
                    setConfirmDeleteOpen(false);
                    setPreviewModalData(null);
                  }}
                >
                  삭제
                </button>

                  <button onClick={() => setConfirmDeleteOpen(false)}>취소</button>
                </div>
              </div>
            </div>
          )}

          {showImageModal && (
            <div className="image-modal-backdrop" onClick={() => setShowImageModal(false)}>
              <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <img
                  src={`/calendar/storage/${previewModalData.image}`}
                  alt="확대 이미지"
                  className="image-modal-large"
                />
                <button className="close-button" onClick={() => setShowImageModal(false)}>닫기</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );

  }

  export default CalendarPage;
