package com.qst.medical.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

@Data
public class CompanyPolicy extends SuperDomain {
    private Long id;
    private String title;
    private String message;
    private Long companyId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createTime;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updateTime;


}
