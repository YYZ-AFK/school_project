package com.qst.medical.common;

import java.util.HashMap;
import java.util.Map;

public class Msg {
    private Integer code;
    private String mess;
    private Map<String, Object> data = new HashMap<>();

    public static Msg success() {
        return new Msg().code(20000).mess("\u64cd\u4f5c\u6210\u529f");
    }

    public static Msg fail() {
        return new Msg().code(10001).mess("\u64cd\u4f5c\u5931\u8d25");
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
