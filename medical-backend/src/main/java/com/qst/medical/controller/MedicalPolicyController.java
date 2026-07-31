package com.qst.medical.controller;

import com.qst.medical.common.Result;
import com.qst.medical.param.MedicalPolicyParam;
import com.qst.medical.service.MedicalPolicyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;

@Tag(name = "医保政策控制器类")
@RestController
@RequestMapping("/api/medical/policy")
@CrossOrigin
public class MedicalPolicyController {
    private final MedicalPolicyService medicalPolicyService;

    public MedicalPolicyController(MedicalPolicyService medicalPolicyService) {
        this.medicalPolicyService = medicalPolicyService;
    }

    /**
     * 条件查询医保政策信息
     */
    @GetMapping
    @Operation(summary = "分页条件查询医保政策")
    public Result getMedicalPolicyWithPage(MedicalPolicyParam param) {
        return medicalPolicyService.getMedicalPolicyWithPage(param);
    }

    /**
     * 添加医保政策
     */
    @RolesAllowed({"ROLE_1"})
    @PostMapping
    @Operation(summary = "新增医保政策")
    public Result saveMedicalPolicy(@Validated @RequestBody MedicalPolicyParam param) {
        if (!StringUtils.hasText(param.getTitle())) {
            return Result.fail().mess("标题不能为空");
        }
        if (!StringUtils.hasText(param.getMessage())) {
            return Result.fail().mess("内容不能为空");
        }
        if (param.getCityId() == null) {
            return Result.fail().mess("城市不能为空");
        }
        return medicalPolicyService.saveMedicalPolicy(param);
    }

    /**
     * 更新医保政策
     */
    @RolesAllowed({"ROLE_1"})
    @PutMapping("/{id}")
    @Operation(summary = "修改医保政策")
    public Result updateMedicalPolicy(@PathVariable("id") Long id, @Validated @RequestBody MedicalPolicyParam param) {
        if (!StringUtils.hasText(param.getTitle())) {
            return Result.fail().mess("标题不能为空");
        }
        if (!StringUtils.hasText(param.getMessage())) {
            return Result.fail().mess("内容不能为空");
        }
        if (param.getCityId() == null) {
            return Result.fail().mess("城市不能为空");
        }
        return medicalPolicyService.updateMedicalPolicy(id, param);
    }

    /**
     * 根据id删除医保政策
     */
    @RolesAllowed({"ROLE_1"})
    @DeleteMapping("/{id}")
    @Operation(summary = "删除医保政策")
    public Result deleteMedicalPolicy(@PathVariable("id") Long id) {
        return medicalPolicyService.deleteMedicalPolicy(id);
    }
}
