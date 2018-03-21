package com.hzlh.dao;

import com.hzlh.entity.ResourceI;
import com.hzlh.entity.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface ILoginDao {
    Map<String,Object> selectByAccount(String account);
    Map<String,Object> selectByName(String name);
    List<Map<String,Object>> selectAllDepartment();
    List<Map<String,Object>> selectAllResource();
    List<Map<String,Object>> selectAllUser();
    void addResource(ResourceI resource);
    void addUser(User user);
    void deleteUser(int id);
    void deleteResource(int id);
}



