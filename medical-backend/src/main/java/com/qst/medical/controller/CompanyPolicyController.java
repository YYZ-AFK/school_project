package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.param.CompanyPolicyParam;
import com.qst.medical.service.CompanyPolicyService;
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

@Api(tags = "医药公司政策控制器类")
@RestController
@RequestMapping("/api/company/policy")
@CrossOrigin
public class CompanyPolicyController {
    private final CompanyPolicyService companyPolicyService;

    public CompanyPolicyController(CompanyPolicyService companyPolicyService) {
        this.companyPolicyService = companyPolicyService;
    }

    /**
     * 分页、关键字查询医药公司政策信息
     */
    @GetMapping
    @ApiOperation("分页条件查询医药公司政策")
    public Msg getPolicyWithPage(CompanyPolicyParam param) {
        return companyPolicyService.getAllPolicyWithPage(param);
    }

    /**
     * 添加医药公司政策
     */
    @RolesAllowed({"ROLE_1"})
    @PostMapping
    @ApiOperation("新增医药公司政策")
    public Msg savePolicy(@RequestBody CompanyPolicyParam param) {
        if (!StringUtils.hasText(param.getTitle())) {
            return Msg.fail().mess("标题不能为空");
        }
        if (!StringUtils.hasText(param.getMessage())) {
            return Msg.fail().mess("内容不能为空");
        }
        if (param.getCompanyId() == null) {
            return Msg.fail().mess("公司ID不能为空");
        }
        return companyPolicyService.savePolicy(param);
    }

    /**
     * 更新医药公司政策信息
     */
    @RolesAllowed({"ROLE_1"})
    @PutMapping("/{id}")
    @ApiOperation("修改医药公司政策")
    public Msg updatePolicy(@PathVariable("id") Long id, @RequestBody CompanyPolicyParam param) {
        if (!StringUtils.hasText(param.getTitle())) {
            return Msg.fail().mess("标题不能为空");
        }
        if (!StringUtils.hasText(param.getMessage())) {
            return Msg.fail().mess("内容不能为空");
        }
        if (param.getCompanyId() == null) {
            return Msg.fail().mess("公司ID不能为空");
        }
        return companyPolicyService.updatePolicy(id, param);
    }

    /**
     * 根据id删除医药公司政策
     */
    @RolesAllowed({"ROLE_1"})
    @DeleteMapping("/{id}")
    @ApiOperation("删除医药公司政策")
    public Msg deletePolicy(@PathVariable("id") Long id) {
        return companyPolicyService.deletePolicy(id);
    }
}
