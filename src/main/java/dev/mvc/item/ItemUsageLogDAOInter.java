package dev.mvc.item;

import java.util.Map;

public interface ItemUsageLogDAOInter {
    public int insert(ItemUsageLogVO vo);
    public int countUsedToday(Map<String, Object> map);
    public ItemUsageLogVO getUsageForToday(int memberno);
}
