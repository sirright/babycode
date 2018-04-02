package com.hzlh.service.impl;

import com.hzlh.dao.ILoginDao;
import com.hzlh.service.IManageService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service("manageService")
public class ManageServiceImpl implements IManageService{
    @Resource
    private ILoginDao loginDao;
    public String getPath(String path,Integer id){
        Integer pId = loginDao.selectParentIdByDepartId(id);
        if(pId==0){
            path = "/"+id.toString();
            return path;
        }else{
            path = "/"+pId.toString()+"/"+id.toString();
            while(pId!=0){
                pId = loginDao.selectParentIdByDepartId(pId);
                if(pId==0){
                    return path;
                }
                path = "/"+pId.toString()+path;
            }
        }
        return path;
    }
}
