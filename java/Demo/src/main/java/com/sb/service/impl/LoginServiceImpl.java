package com.sb.service.impl;
import com.sb.dao.ILoginDao;
import com.sb.service.ILoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
@Service("loginService")
public class LoginServiceImpl implements ILoginService {
    @Resource
    private ILoginDao loginDao;

    public List<Map<String, Object>> getList(Map<String, Object> m) {
        System.out.println("loginService");
        return loginDao.getList(m);
    }
}