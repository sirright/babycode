package com.hzlh.controller;

import com.alibaba.fastjson.JSONArray;
import com.hzlh.dao.ILoginDao;
import com.hzlh.service.IMainService;
import com.hzlh.utils.Converter;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.*;
import java.util.*;

@Controller
public class MainController {
    @Resource
    private IMainService mainService;
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
    @RequestMapping("ifLogin")
    public String ifLogin(HttpSession session,HttpServletResponse response){
        try {
            response.setContentType("text/plain;charset=utf-8");
            String account = (String) session.getAttribute("account");
            if(account==null){
                response.getWriter().write("未登录");
            }else{
                response.getWriter().write("已登录");
            }
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return "";
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
        try{
            response.setContentType("application/json;charset=utf-8");
            JSONArray jsonArr = new JSONArray();
            List<Map<String,Object>> resource = loginDao.selectResourcesAndDepart();
            String jsonStr = jsonArr.toJSONString(resource);
            System.out.println(jsonStr);
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
    //资源预览
    @RequestMapping("/view")
    @ResponseBody
    public String view(@RequestBody String path, HttpServletResponse response, HttpServletRequest request){
        try{
            String changePath = path.substring(0,path.lastIndexOf("."))+".pdf";
            String oldPath = request.getServletContext().getRealPath("/WEB-INF"+path);
            String newPath = request.getServletContext().getRealPath("/WEB-INF"+"/temp"+changePath);
            Converter.office2PDF(oldPath,newPath);
            response.setContentType("text/plain;charset=utf-8");
            response.getWriter().write("/temp"+changePath);
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return "";
    }
    //根据点击部门显示资源
    @RequestMapping("/chooseDepart")
    @ResponseBody
    public void chooseDepart(@RequestBody String chosed,HttpServletResponse response){
        try{
            response.setContentType("application/json;charset=utf-8");
            Set<Integer> sonSet = new HashSet<Integer>();
            List<Map<String,Object>> rlist = new ArrayList<Map<String, Object>>();
            JSONArray jsonArr = new JSONArray();
            String jsonStr;
            //通过名称获取部门Id
            Integer chosedId = loginDao.selectDepartIdByName(chosed);
            //获取部门下所有子部门，返回到sonSet
            mainService.getSonDepartId(chosedId,sonSet);
            rlist = loginDao.selectResourceAndDepartByDId(chosedId);
            if(!sonSet.isEmpty()){
                for(Integer s: sonSet){
                    rlist.addAll(loginDao.selectResourceAndDepartByDId(s));
                }
            }
            jsonStr = jsonArr.toJSONString(rlist);
            response.getWriter().write(jsonStr);
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }

}
