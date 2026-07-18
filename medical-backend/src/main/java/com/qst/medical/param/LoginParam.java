package com.qst.medical.param;

public class LoginParam {
    private String username;
    private String password;
    private String uname;
    private String pwd;

    public String getUsername() {
        return username != null ? username : uname;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password != null ? password : pwd;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }
}
