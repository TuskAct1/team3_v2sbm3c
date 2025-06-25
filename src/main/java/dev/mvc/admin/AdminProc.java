package dev.mvc.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("dev.mvc.admin.AdminProc")
@Primary
public class AdminProc implements AdminProcInter {

    @Autowired
    private AdminDAOInter adminDAO;

    @Override
    public int create(AdminVO adminVO) {
        return adminDAO.create(adminVO);
    }

    @Override
    public int login(Map<String, Object> map) {
        return adminDAO.login(map);
    }

    @Override
    public AdminVO read(int adminno) {
        return adminDAO.read(adminno);
    }

    @Override
    public AdminVO readByEmail(String email) {
        return adminDAO.readByEmail(email);
    }

    @Override
    public List<AdminVO> list() {
        return adminDAO.list();
    }

    @Override
    public int update(AdminVO adminVO) {
        return adminDAO.update(adminVO);
    }

    @Override
    public int delete(int adminno) {
        return adminDAO.delete(adminno);
    }

    @Override
    public int checkEmail(String email) {
        return adminDAO.checkEmail(email);
    }
}
