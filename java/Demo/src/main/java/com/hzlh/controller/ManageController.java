package com.hzlh.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.hzlh.dao.ILoginDao;
import com.hzlh.entity.Department;
import com.hzlh.entity.User;
import com.hzlh.entity.ResourceI;
import com.hzlh.service.IManageService;
import com.hzlh.utils.DeleteFileUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.util.*;

@SessionAttributes
@Controller
public class ManageController {
    @Resource
    private IManageService manageService;
    @Resource
    private ILoginDao loginDao;
    @RequestMapping("/manage")
    public String manage(){
        return "/manage";
    }
    @RequestMapping("/manageSession")
    public void getSession(HttpServletResponse response,HttpSession session){
        try{
            String account = (String)session.getAttribute("account");
            String password = (String)session.getAttribute("password");
            response.setContentType("text/json;charset=utf-8");
            JSONObject jsonObj = new JSONObject();
            jsonObj.put("account",account);
            jsonObj.put("password",password);
            System.out.println(jsonObj);
            response.getWriter().write(jsonObj.toString());
            response.getWriter().close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    @RequestMapping("/getData")
    @ResponseBody
    public void getData(HttpServletResponse response){
        JSONArray jsonArr  = new JSONArray();
        String dataJson = "";
        try{
            response.setContentType("json;charset=utf-8");
            jsonArr.add(loginDao.selectResourcesAndDepart());
            jsonArr.add(loginDao.selectUsersAndDepart());
            jsonArr.add(loginDao.selectDepartmentAndHigh());
            dataJson = jsonArr.toJSONString();
            response.getWriter().write(dataJson);
            response.getWriter().close();
        }catch(IOException e){
            e.printStackTrace();
        }
    }
    @RequestMapping("/addDepart")
    @ResponseBody
    public void addDepart(@RequestBody Department d,HttpServletResponse response){
        try{
            response.setContentType("text/plain;charset=utf-8");
            Integer parentId = loginDao.selectDepartIdByName(d.getHighDepart());
            Integer id = loginDao.selectDepartIdByName(d.getName());
            if(id==null){
                if(parentId==null){
                    parentId = 0;
                }else{
                    d.setParentId(parentId);
                }
                loginDao.addDepart(d);
                response.getWriter().write("添加成功");
            }else{
                response.getWriter().write("该部门已存在,请重新输入");
            }


            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    @RequestMapping("/addUser")
    @ResponseBody
    public void addUser(@RequestBody User newUser,HttpServletResponse response){
        try{
            response.setContentType("application/json;charset=utf-8");
            Map<String,Object> name = loginDao.selectUserByName(newUser.getName());
            Map<String,Object> account = loginDao.selectUserByAccount(newUser.getAccount());
            if(name==null||name.size()<1){
                if(account==null||account.size()<1){
                    newUser.setDepartmentId(loginDao.selectDepartIdByName(newUser.getDepartment()));
                    loginDao.addUser(newUser);
                    response.getWriter().write("添加成功");
                }else{
                    response.getWriter().write("用户账号已存在,请重新输入");
                }
            }else{
                response.getWriter().write("用户名称已存在,请重新输入");
            }
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    @RequestMapping("/upload")
    @ResponseBody
    public void upload(HttpServletResponse response,HttpServletRequest request,
                         @RequestParam("newResource") MultipartFile file,
                         @RequestParam("newResourceName") String name,
                         @RequestParam("newResourceDesc") String desc,
                         @RequestParam("newResourceOwner") String owner,
                         @RequestParam("newResourceDepart") String depart) throws Exception {
        ResourceI newR = new ResourceI();
        try{
            response.setContentType("application/json;charset=utf-8");
            //如果文件不为空，写入上传路径
            if (!file.isEmpty()) {
                String path="";
                String afterPath = manageService.getPath(path,loginDao.selectDepartIdByName(depart));
                //上传文件路径
                path = request.getServletContext().getRealPath("/WEB-INF/resources"+afterPath);
                //上传文件名
                String filename = file.getOriginalFilename();
                File filepath = new File(path, filename);
                int index = filename.lastIndexOf(".");
                //截取类型后缀
                String type = filename.substring(index+1);
                String size = String.valueOf(file.getSize());
                String savePath = "/resources"+afterPath+"/"+filename;
                //判断路径是否存在，如果不存在就创建一个
                if (!filepath.getParentFile().exists()) {
                    filepath.getParentFile().mkdirs();
                }
                //将上传文件保存到一个目标文件当中
                file.transferTo(new File(path + File.separator + filename));
                newR.setName(name);
                newR.setType(type);
                newR.setDesc(desc);
                newR.setOwner(owner);
                newR.setDepartment(loginDao.selectDepartIdByName(depart));
                newR.setPath(savePath);
                newR.setSize(size+"B");
                newR.setUploaddate(new Date());
                loginDao.addResource(newR);
                response.getWriter().write("上传成功");
            } else {
                response.getWriter().write("找不到文件!");
            }
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    @RequestMapping("/deleteUser")
    @ResponseBody
    public void deleteUser(@RequestBody String id,HttpServletResponse response){
        try{
            response.setContentType("text/plain;charset=utf-8");
            int delId = Integer.valueOf(id).intValue();
            loginDao.deleteUserById(delId);
            response.getWriter().write("删除成功");
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    @RequestMapping("/deleteResource")
    @ResponseBody
    public void deleteResource(@RequestBody ResourceI resource,HttpServletResponse response,HttpServletRequest request){
        try{
            response.setContentType("text/plain;charset=utf-8");
            String path = request.getServletContext().getRealPath("/WEB-INF"+resource.getPath());
            File file = new File(path);
            //判断路径是否存在
            if(file.exists()){
                //判断路径下是否为文件
                if(file.isFile()){
                    //判断是否成功删除
                    if(file.delete()){
                        response.getWriter().write("删除成功");
                        loginDao.deleteResourceById(resource.getId());
                    }else{
                        response.getWriter().write("删除失败");
                    }
                }else{
                    response.getWriter().write("不是一个文件");
                }
            }else{
                response.getWriter().write("文件不存在!");
                loginDao.deleteResourceById(resource.getId());
            }
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    @RequestMapping("/deleteDepartConfirm")
    @ResponseBody
    public void deleteDepartConfirm(@RequestBody Department d,HttpServletResponse response,HttpServletRequest request){
            try{
                response.setContentType("text/plain;charset=utf-8");
                String path = "";
                String afterPath = manageService.getPath(path,loginDao.selectDepartIdByName(d.getName()));
                path = request.getServletContext().getRealPath("/WEB-INF/resources"+afterPath);
                File file = new File(path);
                if(file.exists()){
                    if(file.list().length>0){
                        response.getWriter().write("该部门下还有资源,确定要删除吗");
                    }else{
                        response.getWriter().write("部门下资源为空,是否删除");
                    }
                }else{
                    response.getWriter().write("部门下还未存放过资源,是否删除");
                }
                response.getWriter().close();
            }catch(Exception e){
                e.printStackTrace();
            }
    }
    @RequestMapping("/deleteDepart")
    @ResponseBody
    public void deleteDepart(@RequestBody Department d,HttpServletResponse response,HttpServletRequest request){
        try{
            response.setContentType("text/plain;charset=utf-8");
            String path = "";
            String afterPath = manageService.getPath(path,loginDao.selectDepartIdByName(d.getName()));
            path = request.getServletContext().getRealPath("/WEB-INF/resources"+afterPath);
            File file = new File(path);
            String filePath = file.toString();
            if(file.exists()){
                if(DeleteFileUtil.delete(filePath)){
                    loginDao.deleteDepartById(d.getId());
                    response.getWriter().write("删除成功");
                }else{
                    response.getWriter().write("删除失败");
                }
            }else{
                loginDao.deleteDepartById(d.getId());
                response.getWriter().write("删除成功");
            }
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    @RequestMapping("/updateResource")
    @ResponseBody
    public void updateResource(@RequestBody ResourceI r,HttpServletResponse response){
        try {
            response.setContentType("text/plain;charset=utf-8");
            loginDao.updateResource(r);
            response.getWriter().write("修改成功");
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    @RequestMapping("/updateUser")
    @ResponseBody
    public void updateUser(@RequestBody User u,HttpServletResponse response){
        try{
            boolean flag = true;
            response.setContentType("text/plain;charset=utf-8");
            Map<String,Object> thisUser = loginDao.selectUserById(u.getId());
            if(!thisUser.get("user_name").equals(u.getName())){
                Map<String,Object> nameIf = loginDao.selectUserByName(u.getName());
                if(!(nameIf==null||nameIf.size()<1)){
                    response.getWriter().write("该名称已存在,请重新输入");
                    flag = false;
                }
            }
            if(!thisUser.get("user_account").equals(u.getAccount())){
                Map<String,Object> accountIf = loginDao.selectUserByAccount(u.getAccount());
                if(!(accountIf==null||accountIf.size()<1)){
                    response.getWriter().write("该账号已存在,请重新输入");
                    flag = false;
                }
            }
            if(flag){
                u.setDepartmentId(loginDao.selectDepartIdByName(u.getDepartment()));
                loginDao.updateUser(u);
                response.getWriter().write("修改成功");
            }
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
    @RequestMapping("/updateDepartment")
    @ResponseBody
    public void updateDepartment(@RequestBody Department d,HttpServletResponse response){
        try{
            response.setContentType("text/plain");
            if(d.getHighDepart().equals("无")){
                d.setParentId(0);
            }else{
                d.setParentId(loginDao.selectDepartIdByName(d.getHighDepart()));
            }
            loginDao.updateDepartment(d);
            response.getWriter().write("修改成功!");
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}

