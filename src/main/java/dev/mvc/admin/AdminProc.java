package dev.mvc.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("dev.mvc.admin.AdminProc")
public class AdminProc implements AdminProcInter {
  
  @Autowired
  private AdminDAOInter adminDAO;

  @Override
  public int create(AdminVO adminVO) {
    return adminDAO.create(adminVO);
  }

  @Override
  public AdminVO read(int adminno) {
    return adminDAO.read(adminno);
  }

  @Override
  public int update(AdminVO adminVO) {
    return adminDAO.update(adminVO);
  }
  
  @Override
  public int delete(int adminno) { 
    return adminDAO.delete(adminno);
  }
  
}