package com.hzlh.controller;

import com.alibaba.fastjson.JSONArray;
import com.hzlh.dao.ILoginDao;
import com.hzlh.entity.ResourceI;
import com.hzlh.service.ILoginService;
import com.hzlh.service.IMainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.hzlh.utils.JSONUtils;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Controller
public class MainController {

    @Resource
    private ILoginDao loginDao;
    @RequestMapping("/")
    public String defaultPage(){
        return "/main";
    }
    @RequestMapping("/login")
    public String goLogin(){
        return "/login";
    }
    @RequestMapping("/getDepart")
    @ResponseBody
    public String getDepart(HttpServletResponse response){
        JSONArray jsonArr = new JSONArray();
        List<Map<String,Object>> allDepart = loginDao.selectAllDepartment();
        for(Map attr : allDepart){
            jsonArr.add(attr.get("department_name").toString());
        }
        try{
            response.setContentType("text/html;charset=utf-8");
            response.getWriter().write(jsonArr.toString());
            response.getWriter().close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "";
    }
    @RequestMapping("/getResources")
    @ResponseBody
    public String getResources(HttpServletResponse response){
        JSONArray jsonArr = new JSONArray();
        List<Map<String,Object>> allResource = loginDao.selectAllResource();
        String jsonStr = jsonArr.toJSONString(allResource);
        try{
            response.setContentType("json;charset=utf-8");
            response.getWriter().write(jsonStr);
            response.getWriter().close();
        }catch(IOException e){
            e.printStackTrace();
        }
        return "";
    }
    @RequestMapping("/getDepartments")
    @ResponseBody
    public String getDepartments(HttpServletResponse response){
        JSONArray jsonArr = new JSONArray();
        List<Map<String,Object>> allDepartment = loginDao.selectAllDepartment();
        String jsonStr = jsonArr.toJSONString(allDepartment);
        try{
            response.setContentType("json,charset=utf-8");
            response.getWriter().write(jsonStr);
            response.getWriter().close();
        }catch(IOException e){
            e.printStackTrace();
        }
        return "";
    }
    @RequestMapping("/view")
    @ResponseBody
    public String view(HttpServletResponse response){
        return "";
    }

}
