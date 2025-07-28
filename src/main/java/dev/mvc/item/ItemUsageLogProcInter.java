package dev.mvc.item;

import java.util.List;
import java.util.Map;

public interface ItemUsageLogProcInter {
    public int insert(ItemUsageLogVO vo);
    public int countUsedToday(Map<String, Object> map);
    public ItemUsageLogVO getUsageForToday(int memberno);

    List<ItemUsageLogVO> getTodayUsageByMember(int memberno);
}