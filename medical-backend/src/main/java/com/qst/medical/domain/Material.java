package com.qst.medical.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
public class Material extends SuperDomain {
    private Long id;
    @NotBlank(message="标题不能为空")
    private String title;
    @NotBlank(message="内容不能为空")
    private String message;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date createTime;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date updateTime;

}
