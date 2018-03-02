package com.sb.dao;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface ILoginDao {
    List<Map<String,Object>> getList(Map<String, Object> m);
}