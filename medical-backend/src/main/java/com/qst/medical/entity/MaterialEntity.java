package com.qst.medical.entity;

import com.qst.medical.domain.Material;

public class MaterialEntity extends Material {
    private Long total;

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}
