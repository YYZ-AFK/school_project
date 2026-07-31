package com.qst.medical.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.util.Date;

@Data
public class Account extends SuperDomain {
    private Long id;
    private String realname;
    private String uname;
    @JsonIgnore
    private String pwd;
    private String phonenumber;
    private String utype;
    private Date updatetime;
    private Date createtime;

}
