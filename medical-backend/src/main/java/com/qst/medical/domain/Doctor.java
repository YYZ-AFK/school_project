package com.qst.medical.domain;

import lombok.Data;
import java.util.Date;

@Data
public class Doctor extends SuperDomain {
    private Long id;
    private String name;
    private Integer age;
    private Integer sex;
    private Long levelId;
    private String phone;
    private Long typeId;
    private String hospital;
    private Date updatetime;
    private Date createtime;
    private Long accountId;

}
