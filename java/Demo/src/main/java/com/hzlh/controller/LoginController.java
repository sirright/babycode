package com.hzlh.controller;

import com.hzlh.dao.ILoginDao;
import com.hzlh.entity.User;
import com.hzlh.service.ILoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Map;

@Controller
@SessionAttributes
public class LoginController {
    @Autowired
    ILoginService loginService;
    @Resource
    private ILoginDao loginDao;
    @RequestMapping("/loginAccount")
    @ResponseBody
    public String login(@RequestBody User loginUser, HttpServletResponse response,HttpSession session){
        Map<String,Object> user = loginDao.selectUserByAccount(loginUser.getAccount());
        try {
            response.setContentType("text/html;charset=utf-8");
            if (user!=null) {
                if(user.get("user_password").equals(loginUser.getPassword())){
                    session.setAttribute("id",user.get("user_id"));
                    session.setAttribute("account",user.get("user_account"));
                    session.setAttribute("password",user.get("user_password"));
                    session.setAttribute("name",user.get("user_name"));
                    session.setAttribute("department",user.get("user_department"));
                    session.setAttribute("group",user.get("user_group"));
                    response.getWriter().write("登录成功");
                }else{
                    response.getWriter().write("密码不正确");;
                }
            }else{
                response.getWriter().write("账号不存在");
            }
            response.getWriter().close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }
}