package com.hzlh.service;
import com.hzlh.entity.User;
public interface ILoginService {
    void setSession(User user);
}