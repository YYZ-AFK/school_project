package com.qst.medical.entity;

import com.qst.medical.domain.MedicalPolicy;
import lombok.Data;

@Data
public class MedicalPolicyEntity extends MedicalPolicy {
    private Long total;

}
