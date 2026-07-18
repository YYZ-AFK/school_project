package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.model.AccountModel;
import com.qst.medical.service.PermissionService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Api(tags = "\u6743\u9650\u83dc\u5355\u63a5\u53e3")
public class PermissionController {
    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping("/permissions")
    @ApiOperation("\u67e5\u8be2\u5f53\u524d\u89d2\u8272\u7684\u6743\u9650\u83dc\u5355\u6811")
    public Msg permissions(@RequestParam(required = false) String roleName, Authentication authentication) {
        if ((roleName == null || roleName.trim().isEmpty())
                && authentication != null
                && authentication.getPrincipal() instanceof AccountModel) {
            roleName = ((AccountModel) authentication.getPrincipal()).getUtype();
        }
        return Msg.success().data("permissions", permissionService.listTree(roleName));
    }
}
