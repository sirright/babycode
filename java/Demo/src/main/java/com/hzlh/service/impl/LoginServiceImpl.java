package com.hzlh.service.impl;

import com.hzlh.dao.ILoginDao;
import com.hzlh.entity.User;
import com.hzlh.service.ILoginService;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;

@Service("loginService")
public class LoginServiceImpl implements ILoginService {
    @Resource
    private ILoginDao loginDao;
    public void setSession(User user){

    }
}