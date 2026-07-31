package com.qst.medical.domain;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
public class Sale extends SuperDomain {
    private Long saleId;//药店id
    @NotBlank(message="药店名不能为空")
    private String saleName;//药店名
    private String salePhone;//药店电话
    private String address;//地址
    private Double lng;//经度
    private Double lat;//纬度
    private Date createtime;//创建时间
    private Date updatetime;//修改时间


}
