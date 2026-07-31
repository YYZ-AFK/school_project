package com.qst.medical.entity;

import com.qst.medical.domain.City;
import lombok.Data;

@Data
public class CityEntity extends City {

    private Long total;

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }
}
