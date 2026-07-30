package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.param.DoctorParam;
import com.qst.medical.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
@Tag(name = "医生信息管理接口", description = "包含医生增删改查及账号管理")
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    @Operation(summary = "分页查询医生信息")
    public Msg list(DoctorParam param) {
        return Msg.success().data("pageInfo", doctorService.list(param));
    }

    @GetMapping("/{id}")
    @Operation(summary = "根据ID查询医生详情")
    public Msg get(@PathVariable Long id) {
        return Msg.success().data("doctor", doctorService.getById(id));
    }

    @GetMapping("/info")
    @Operation(summary = "查询医生级别和诊疗类型字典")
    public Msg info() {
        return Msg.success()
                .data("level", doctorService.levels())
                .data("type", doctorService.treatTypes());
    }

    @PostMapping
    @Operation(summary = "新增医生并创建账号")
    public Msg save(@RequestBody DoctorParam param) {
        try {
            return Msg.success().data("doctor", doctorService.save(param));
        } catch (Exception ex) {
            return Msg.fail().mess(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "修改医生信息")
    public Msg update(@PathVariable Long id, @RequestBody DoctorParam param) {
        try {
            return Msg.success().data("doctor", doctorService.update(id, param));
        } catch (Exception ex) {
            return Msg.fail().mess(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除医生及其对应账号")
    public Msg delete(@PathVariable Long id) {
        doctorService.delete(id);
        return Msg.success();
    }

    @PutMapping("/{id}/password")
    @Operation(summary = "重置医生账号密码")
    public Msg resetPassword(@PathVariable Long id,
                             @RequestParam(required = false) String password) {
        try {
            doctorService.resetPassword(id, password);
            return Msg.success();
        } catch (Exception ex) {
            return Msg.fail().mess(ex.getMessage());
        }
    }

    @PutMapping("/reset/{id}")
    @Operation(summary = "重置密码兼容接口（旧版）", deprecated = true)
    public Msg resetPasswordAlias(@PathVariable Long id,
                                  @RequestParam(required = false) String password) {
        return resetPassword(id, password);
    }
}
