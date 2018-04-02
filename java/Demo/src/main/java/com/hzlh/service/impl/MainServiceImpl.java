package com.hzlh.service.impl;

import com.hzlh.dao.ILoginDao;
import com.hzlh.service.IMainService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.HashSet;
import java.util.Set;
@Service("mainService")
public class MainServiceImpl implements IMainService{
    @Resource
    private ILoginDao loginDao;
    //递归获取该部门下所有子部门
    public void getSonDepartId(Integer id,Set sonSet){
        Set<Integer> newSet = loginDao.selectDepartIdByParentId(id);
        for(Integer attr : newSet){
            sonSet.add(attr);
            getSonDepartId(attr,sonSet);
        }
    }
}
