package com.sb.entity;
public class Login implements java.io.Serializable {
    public int id ;
    public String login_name;
    public String login_password;
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getLogin_name() {
        return login_name;
    }
    public void setLogin_name(String login_name) {
        this.login_name = login_name;
    }
    public String getLogin_password() {
        return login_password;
    }
    public void setLogin_password(String login_password) {
        this.login_password = login_password;
    }
}