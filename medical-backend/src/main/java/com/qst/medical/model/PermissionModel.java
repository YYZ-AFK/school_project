package com.qst.medical.model;

import com.qst.medical.domain.Meta;
import com.qst.medical.domain.Permission;

import java.util.ArrayList;
import java.util.List;

public class PermissionModel extends Permission {
    private Meta meta;
    private List<PermissionModel> children = new ArrayList<>();

    public Meta getMeta() {
        return meta;
    }

    public void setMeta(Meta meta) {
        this.meta = meta;
    }

    public List<PermissionModel> getChildren() {
        return children;
    }

    public void setChildren(List<PermissionModel> children) {
        this.children = children;
    }
}
