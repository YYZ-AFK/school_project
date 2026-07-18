package com.qst.medical.entity;

import com.qst.medical.domain.MedicalPolicy;

public class MedicalPolicyEntity extends MedicalPolicy {
    private Long total;

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}
