package com.qst.medical.domain;

import lombok.Data;

@Data
public class Meta {
    private String title;

    public Meta() {
    }

    public Meta(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
