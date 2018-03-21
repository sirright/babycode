package com.hzlh.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.JSONSerializerMap;
import com.hzlh.dao.ILoginDao;
import com.hzlh.entity.User;
import com.hzlh.entity.ResourceI;
import javafx.scene.input.DataFormat;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

@SessionAttributes
@Controller
public class ManageController {
    @Resource
    private ILoginDao loginDao;
    @RequestMapping("/manage")
    public String manage(){
        return "/manage";
    }
    @RequestMapping("/manageSession")
    public String getSession(HttpServletResponse response,HttpSession session){
        String account = (String)session.getAttribute("account");
        String password = (String)session.getAttribute("password");
        try{
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
        return "";
    }
    @RequestMapping("/getData")
    @ResponseBody
    public String getData(@RequestBody String choosedManage, HttpServletResponse response){
        JSONArray jsonArr  = new JSONArray();
        String jsonStr="";
        try{
            response.setContentType("json;charset=utf-8");
            if(choosedManage.equals("资源管理")){
                List<Map<String,Object>> allResource = loginDao.selectAllResource();
                jsonStr = jsonArr.toJSONString(allResource);
            }else if(choosedManage.equals("用户管理")){
                List<Map<String,Object>> allUser = loginDao.selectAllUser();
                jsonStr = jsonArr.toJSONString(allUser);
            }else if(choosedManage.equals("部门管理")){
                List<Map<String,Object>> allDepartment = loginDao.selectAllDepartment();
                jsonStr = jsonArr.toJSONString(allDepartment);
            }
            response.getWriter().write(jsonStr);
            response.getWriter().close();
        }catch(IOException e){
            e.printStackTrace();
        }
        return "";
    }
    @RequestMapping("/addUser")
    @ResponseBody
    public String addUser(@RequestBody User newUser,HttpServletResponse response){
        System.out.println("ff");
        try{
            response.setContentType("application/json;charset=utf-8");
            Map<String,Object> m = loginDao.selectByName(newUser.getName());
            Map<String,Object> m1 = loginDao.selectByAccount(newUser.getAccount());
            if(m==null||m.size()<1){
                if(m1==null||m1.size()<1){
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
        return "";
    }
    @RequestMapping("/deleteUser")
    @ResponseBody
    public String deleteUser(@RequestBody String id,HttpServletResponse response){
        try{
            response.setContentType("text/plain;charset=utf-8");
            int delId = Integer.valueOf(id).intValue();
            loginDao.deleteUser(delId);
            response.getWriter().write("删除成功");
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return "";
    }
    @RequestMapping("/deleteResource")
    @ResponseBody
    public String deleteResource(@RequestBody ResourceI resource,HttpServletResponse response){

        try{
            response.setContentType("text/plain;charset=utf-8");
            File file = new File(resource.getPath()+"/"+resource.getName()+"."+resource.getType());
            //判断路径是否存在
            if(file.exists()){
                //判断路径下是否为文件
                if(file.isFile()){
                    //判断是否成功删除
                    if(file.delete()){
                        response.getWriter().write("删除成功");
                        loginDao.deleteResource(resource.getId());
                    }else{
                        response.getWriter().write("删除失败");
                    }
                }else{
                    response.getWriter().write("不是一个文件");
                }
            }else{
                response.getWriter().write("文件不存在!");
            }
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return "";
    }
    @RequestMapping("/upload")
    @ResponseBody
    public String upload(HttpServletResponse response,HttpServletRequest request,
                         @RequestParam("newResource") MultipartFile file,
                         @RequestParam("newResourceDesc") String desc,
                         @RequestParam("newResourceOwner") String owner,
                         @RequestParam("newResourceGroup") String group,
                         @RequestParam("newResourceDepart") String depart) throws Exception {
        ResourceI newR = new ResourceI();
        try{
            response.setContentType("application/json;charset=utf-8");
            //如果文件不为空，写入上传路径
            if (!file.isEmpty()) {
                //上传文件路径
                String path = request.getServletContext().getRealPath("/WEB-INF/resources/"+depart+"/"+group);
                //上传文件名
                String filename = file.getOriginalFilename();
                File filepath = new File(path, filename);
                int index = filename.lastIndexOf(".");
                //截取名称前缀
                String name = filename.substring(0,index);
                //截取类型后缀
                String type = filename.substring(index+1);
                String size = String.valueOf(file.getSize());
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
                newR.setGroup(group);
                newR.setDepartment(depart);
                newR.setPath(path);
                newR.setSize(size+"B");
                newR.setUploaddate(new Date());
                loginDao.addResource(newR);
                response.getWriter().write("success");
            } else {
                response.getWriter().write("error");
            }
            response.getWriter().close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return "";
    }
}

