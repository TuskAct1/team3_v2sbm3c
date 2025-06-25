package dev.mvc.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface AdminDAOInter {
    public int create(AdminVO adminVO);

    public int login(Map<String, Object> map);
    

    public AdminVO read(int adminno);

    public AdminVO readByEmail(String email);

    public List<AdminVO> list();

    public int update(AdminVO adminVO);

    public int delete(int adminno);

    public int checkEmail(String email);
}
