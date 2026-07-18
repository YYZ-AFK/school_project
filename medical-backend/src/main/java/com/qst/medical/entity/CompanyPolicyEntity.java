package com.qst.medical.entity;

import com.qst.medical.domain.CompanyPolicy;

public class CompanyPolicyEntity extends CompanyPolicy {
    private Long total;

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}
