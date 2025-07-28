package dev.mvc.item;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Primary
@Service("dev.mvc.item.ItemUsageLogProc")
public class ItemUsageLogProc implements ItemUsageLogProcInter {

    @Autowired
    private ItemUsageLogDAOInter itemUsageLogDAO;

    @Override
    public int insert(ItemUsageLogVO vo) {
        return itemUsageLogDAO.insert(vo);
    }

    @Override
    public int countUsedToday(Map<String, Object> map) {
        return itemUsageLogDAO.countUsedToday(map);
    }

    @Override
    public ItemUsageLogVO getUsageForToday(int memberno) {
        return this.itemUsageLogDAO.getUsageForToday(memberno); // DAO를 통해 조회
    }

    @Override
    public List<ItemUsageLogVO> getTodayUsageByMember(int memberno) {
        return itemUsageLogDAO.getTodayUsageByMember(memberno);
    }
}
