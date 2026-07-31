package com.qst.medical.common;

import lombok.Data;
import java.util.HashMap;
import java.util.Map;

@Data
public class Msg {
    private Integer code;
    private String mess;
    private Map<String, Object> data = new HashMap<>();

    public static Msg success() {
        return new Msg().code(20000).mess("操作成功");
    }

    public static Msg fail() {
        return new Msg().code(10001).mess("操作失败");
    }

    public Msg code(Integer code) {
        this.code = code;
        return this;
    }

    public Msg mess(String mess) {
        this.mess = mess;
        return this;
    }

    public Msg data(String key, Object value) {
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
