package com.qst.medical.domain;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class MedicalPolicy extends SuperDomain {
    @NotNull
    private Long id;
    @NotBlank(message="标题不能为空")
    private String title;
    @NotBlank(message="内容不能为空")
    private String message;
    private Long cityId;
    private String createTime;
    private String updateTime;

}
