package com.qst.medical.domain;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
public class DrugCompany {
    private Long companyId;//公司id
    @NotBlank(message="公司名不能为空")
    private String companyName;//公司名
    @NotBlank(message="公司电话不能为空")
    private String companyPhone;//公司电话
    private Date updatetime;//更新时间
    private Date createtime;//创建时间

}

