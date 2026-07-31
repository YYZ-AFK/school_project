package com.qst.medical.domain;

import lombok.Data;

@Data
public class MedicalPolicy extends SuperDomain {
    private Long id;
    private String title;
    private String message;
    private Long cityId;
    private String createTime;
    private String updateTime;

}
