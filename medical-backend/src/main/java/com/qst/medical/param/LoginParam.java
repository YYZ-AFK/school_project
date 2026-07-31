package com.qst.medical.param;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class LoginParam {
    @NotNull
    private String username;
    @NotNull
    private String password;
    private String uname;
    private String pwd;


}
