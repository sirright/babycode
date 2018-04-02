package com.hzlh.dao;

import com.hzlh.entity.Department;
import com.hzlh.entity.ResourceI;
import com.hzlh.entity.User;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Array;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Repository
public interface ILoginDao {
    //添加资源
    void addResource(ResourceI r);
    //添加用户
    void addUser(User u);
    //添加部门
    void addDepart(Department d);
    //删除用户
    void deleteUserById(int id);
    //删除资源
    void deleteResourceById(int id);
    //删除部门
    void deleteDepartById(int d);
    //修改资源
    void updateResource(ResourceI r);
    //修改用户
    void updateUser(User u);
    //修改部门
    void updateDepartment(Department d);
    //通过部门下级ID查找上级Id
    Integer selectParentIdByDepartId(int id);
    //通过上级ID查找下级ID
    Set<Integer> selectDepartIdByParentId(int parentId);
    //通过用户Id查询用户
    Map<String,Object> selectUserById(int id);
    //通过账户名查询用户
    Map<String,Object> selectUserByAccount(String account);
    //通过名称查询用户
    Map<String,Object> selectUserByName(String name);
    //通过名称查询部门ID
    Integer selectDepartIdByName(String name);
    //通过部门ID查询资源信息
    List<Map<String,Object>> selectResourceByDepartId(int departId);
    //查询所有用户信息及部门名称(后台管理用户展示)
    List<Map<String,Object>> selectUsersAndDepart();
    //查询所有资源信息及资源名称(后台管理资源展示)
    List<Map<String,Object>> selectResourcesAndDepart();
    //查询所有部门及他们的上级部门
    List<Map<String,Object>> selectDepartmentAndHigh();
    //根据部门查询资源并按部门排序
    List<Map<String,Object>> selectResourceAndDepartByDId(int id);
    //查询所有部门
    List<Map<String,Object>> selectAllDepartment();
    //查询所有资源
    List<Map<String,Object>> selectAllResource();
    //查询所有用户
    List<Map<String,Object>> selectAllUser();
}



