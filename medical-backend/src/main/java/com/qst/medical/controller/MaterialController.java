package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.param.MaterialParam;
import com.qst.medical.service.MaterialService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.security.RolesAllowed;

@Api(tags = "必备材料控制器")
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
    @ApiOperation("分页条件查询必备材料")
    public Msg getPolicyWithPage(MaterialParam param) {
        return materialService.getAllMaterialWithPage(param);
    }

    /**
     * 添加必备材料
     */
    @RolesAllowed({"ROLE_1"})
    @PostMapping
    @ApiOperation("新增必备材料")
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
    @ApiOperation("修改必备材料")
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
    @ApiOperation("删除必备材料")
    public Msg deleteMaterial(@PathVariable("id") Long id) {
        return materialService.deleteMaterial(id);
    }
}
