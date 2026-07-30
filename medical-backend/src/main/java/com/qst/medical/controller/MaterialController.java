package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.param.MaterialParam;
import com.qst.medical.service.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;

@Tag(name = "必备材料控制器")
@RestController
@RequestMapping("/api/material")
@CrossOrigin
public class MaterialController {
    private final MaterialService materialService;

    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    /**
     * 分页、关键字查询必备材料信息
     */
    @GetMapping
    @Operation(summary = "分页条件查询必备材料")
    public Msg getPolicyWithPage(MaterialParam param) {
        return materialService.getAllMaterialWithPage(param);
    }

    /**
     * 添加必备材料
     */
    @RolesAllowed({"ROLE_1"})
    @PostMapping
    @Operation(summary = "新增必备材料")
    public Msg saveMaterial(@RequestBody MaterialParam param) {
        if (!StringUtils.hasText(param.getTitle())) {
            return Msg.fail().mess("标题不能为空");
        }
        if (!StringUtils.hasText(param.getMessage())) {
            return Msg.fail().mess("内容不能为空");
        }
        return materialService.saveMaterial(param);
    }

    /**
     * 更新必备材料
     */
    @RolesAllowed({"ROLE_1"})
    @PutMapping("/{id}")
    @Operation(summary = "修改必备材料")
    public Msg updateMaterial(@PathVariable("id") Long id, @RequestBody MaterialParam param) {
        if (!StringUtils.hasText(param.getTitle())) {
            return Msg.fail().mess("标题不能为空");
        }
        if (!StringUtils.hasText(param.getMessage())) {
            return Msg.fail().mess("内容不能为空");
        }
        return materialService.updateMaterial(id, param);
    }

    /**
     * 根据id删除必备材料
     */
    @RolesAllowed({"ROLE_1"})
    @DeleteMapping("/{id}")
    @Operation(summary = "删除必备材料")
    public Msg deleteMaterial(@PathVariable("id") Long id) {
        return materialService.deleteMaterial(id);
    }
}
