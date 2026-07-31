package com.qst.medical.service;

import com.qst.medical.domain.Meta;
import com.qst.medical.mapper.PermissionMapper;
import com.qst.medical.model.PermissionModel;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PermissionService {
    private final PermissionMapper permissionMapper;

    public PermissionService(PermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    public List<PermissionModel> listTree(String roleName) {
        String normalizedRole = normalizeRole(roleName);
        List<PermissionModel> permissions = permissionMapper.listByRole(normalizedRole);
        Map<Integer, PermissionModel> nodeMap = new LinkedHashMap<>();
        for (PermissionModel permission : permissions) {
            permission.setMeta(new Meta(displayTitle(permission.getTitle(), normalizedRole)));
            permission.setChildren(new ArrayList<PermissionModel>());
            nodeMap.put(permission.getId(), permission);
        }

        List<PermissionModel> roots = new ArrayList<>();
        for (PermissionModel permission : nodeMap.values()) {
            PermissionModel parent = nodeMap.get(permission.getPid());
            if (parent == null || permission.getPid() == null || permission.getPid() == 0) {
                roots.add(permission);
            } else {
                parent.getChildren().add(permission);
            }
        }
        return roots;
    }

    private String normalizeRole(String roleName) {
        if (!StringUtils.hasText(roleName)) {
            return "ROLE_1";
        }
        if (roleName.startsWith("ROLE_")) {
            return roleName;
        }
        return "ROLE_" + roleName;
    }

    private String displayTitle(String title, String roleName) {
        if (title == null || "ROLE_1".equals(roleName)) {
            return title;
        }
        return title.replace("管理", "查询");
    }
}
