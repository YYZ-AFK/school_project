package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.param.MedicalPolicyParam;
import com.qst.medical.service.MedicalPolicyService;
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

@Api(tags = "医保政策控制器类")
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
    @ApiOperation("分页条件查询医保政策")
    public Msg getMedicalPolicyWithPage(MedicalPolicyParam param) {
        return medicalPolicyService.getMedicalPolicyWithPage(param);
    }

    /**
     * 添加医保政策
     */
    @RolesAllowed({"ROLE_1"})
    @PostMapping
    @ApiOperation("新增医保政策")
    public Msg saveMedicalPolicy(@RequestBody MedicalPolicyParam param) {
        if (!StringUtils.hasText(param.getTitle())) {
            return Msg.fail().mess("标题不能为空");
        }
        if (!StringUtils.hasText(param.getMessage())) {
            return Msg.fail().mess("内容不能为空");
        }
        if (param.getCityId() == null) {
            return Msg.fail().mess("城市不能为空");
        }
        return medicalPolicyService.saveMedicalPolicy(param);
    }

    /**
     * 更新医保政策
     */
    @RolesAllowed({"ROLE_1"})
    @PutMapping("/{id}")
    @ApiOperation("修改医保政策")
    public Msg updateMedicalPolicy(@PathVariable("id") Long id, @RequestBody MedicalPolicyParam param) {
        if (!StringUtils.hasText(param.getTitle())) {
            return Msg.fail().mess("标题不能为空");
        }
        if (!StringUtils.hasText(param.getMessage())) {
            return Msg.fail().mess("内容不能为空");
        }
        if (param.getCityId() == null) {
            return Msg.fail().mess("城市不能为空");
        }
        return medicalPolicyService.updateMedicalPolicy(id, param);
    }

    /**
     * 根据id删除医保政策
     */
    @RolesAllowed({"ROLE_1"})
    @DeleteMapping("/{id}")
    @ApiOperation("删除医保政策")
    public Msg deleteMedicalPolicy(@PathVariable("id") Long id) {
        return medicalPolicyService.deleteMedicalPolicy(id);
    }
}
