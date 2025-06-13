package dev.mvc.announcement;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.announcement.AnnounceProc")
public class AnnounceProc implements AnnounceProcInter {

    @Autowired
    private AnnounceDAOInter announceDAO;

    @Override
    public int create(AnnounceVO announceVO) {
        return announceDAO.create(announceVO);
    }

    @Override
    public List<AnnounceVO> list_all() {
        return announceDAO.list_all();
    }

    @Override
    public AnnounceVO read(int announcementno) {
        return announceDAO.read(announcementno);
    }

    @Override
    public int update(AnnounceVO announceVO) {
        return announceDAO.update(announceVO);
    }

    @Override
    public int delete(int announcementno) {
        return announceDAO.delete(announcementno);
    }
}
