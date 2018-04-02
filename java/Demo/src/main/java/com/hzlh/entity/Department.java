package com.hzlh.entity;

public class Department {
    int id;
    int parentId;
    String name;
    String highDepart;
    public int getParentId() {
        return parentId;
    }
    public void setParentId(int parentId) {
        this.parentId = parentId;
    }



    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHighDepart() {
        return highDepart;
    }

    public void setHighDepart(String highDepart) {
        this.highDepart = highDepart;
    }
}
