package com.qst.medical.domain;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.Date;

/**
 * @author yyz
 */
@Data
public class Drug extends SuperDomain {
    private Long drugId;//药品id

    @NotBlank(message="药品名称不能为空")
    private String drugName;//药品名称

    private String drugInfo;//药品成分信息

    private String drugEffect;//药品功能作用

    private String drugImg;//药品图片url
    private Date createtime;//药品创建时间
    private Date updatetime;//药品更新时间

    private String drugPublisher;//药品发布者

    @Override
    public String toString() {
        return "Drug{" +
                "drugId=" + drugId +
                ", drugName='" + drugName + '\'' +
                ", drugInfo='" + drugInfo + '\'' +
                ", drugEffect='" + drugEffect + '\'' +
                ", drugImg='" + drugImg + '\'' +
                ", createtime=" + createtime +
                ", updatetime=" + updatetime +
                ", drugPublisher='" + drugPublisher + '\'' +
                '}';
    }


}
