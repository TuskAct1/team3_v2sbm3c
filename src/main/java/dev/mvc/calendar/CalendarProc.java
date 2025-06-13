package dev.mvc.calendar;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.calendar.CalendarProc")
public class CalendarProc implements CalendarProcInter {

    @Autowired
    private CalendarDAOInter calendarDAO;

    @Override
    public int create(CalendarVO calendarVO) {
        return calendarDAO.create(calendarVO);
    }

    @Override
    public List<CalendarVO> list_all() {
        return calendarDAO.list_all();
    }

    @Override
    public CalendarVO read(int calendarno) {
        return calendarDAO.read(calendarno);
    }

    @Override
    public int update(CalendarVO calendarVO) {
        return calendarDAO.update(calendarVO);
    }

    @Override
    public int delete(int calendarno) {
        return calendarDAO.delete(calendarno);
    }
}
