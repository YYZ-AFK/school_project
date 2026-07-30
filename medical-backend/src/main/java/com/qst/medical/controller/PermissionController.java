package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.model.AccountModel;
import com.qst.medical.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "权限菜单接口", description = "用于获取用户菜单树及权限标识")
public class PermissionController {
    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping("/permissions")
    @Operation(summary = "查询当前角色的权限菜单树")
    public Msg permissions(@RequestParam(required = false) String roleName, Authentication authentication) {
        if ((roleName == null || roleName.trim().isEmpty())
                && authentication != null
                && authentication.getPrincipal() instanceof AccountModel) {
            roleName = ((AccountModel) authentication.getPrincipal()).getUtype();
        }
        return Msg.success().data("permissions", permissionService.listTree(roleName));
    }
}
