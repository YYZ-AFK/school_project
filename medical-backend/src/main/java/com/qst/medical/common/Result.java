package com.qst.medical.common;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
public class Result {
    private Integer code;
    private String mess;
    private Map<String, Object> data = new HashMap<>();

    public static Result success() {
        return new Result().code(20000).mess("操作成功");
    }

    public static Result fail() {
        return new Result().code(10001).mess("操作失败");
    }

    public Result code(Integer code) {
        this.code = code;
        return this;
    }

    public Result mess(String mess) {
        this.mess = mess;
        return this;
    }

    public Result data(String key, Object value) {
        this.data.put(key, value);
        return this;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMess() {
        return mess;
    }

    public void setMess(String mess) {
        this.mess = mess;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }
}
