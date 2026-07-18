package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.param.DoctorParam;
import com.qst.medical.service.DoctorService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctors")
@Api(tags = "\u533b\u751f\u4fe1\u606f\u7ba1\u7406\u63a5\u53e3")
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    @ApiOperation("\u5206\u9875\u67e5\u8be2\u533b\u751f\u4fe1\u606f")
    public Msg list(DoctorParam param) {
        return Msg.success().data("pageInfo", doctorService.list(param));
    }

    @GetMapping("/{id}")
    @ApiOperation("\u6839\u636eID\u67e5\u8be2\u533b\u751f\u8be6\u60c5")
    public Msg get(@PathVariable Long id) {
        return Msg.success().data("doctor", doctorService.getById(id));
    }

    @GetMapping("/info")
    @ApiOperation("\u67e5\u8be2\u533b\u751f\u7ea7\u522b\u548c\u8bca\u7597\u7c7b\u578b")
    public Msg info() {
        return Msg.success()
                .data("level", doctorService.levels())
                .data("type", doctorService.treatTypes());
    }

    @PostMapping
    @ApiOperation("\u65b0\u589e\u533b\u751f\u5e76\u521b\u5efa\u533b\u751f\u8d26\u53f7")
    public Msg save(@RequestBody DoctorParam param) {
        try {
            return Msg.success().data("doctor", doctorService.save(param));
        } catch (Exception ex) {
            return Msg.fail().mess(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    @ApiOperation("\u4fee\u6539\u533b\u751f\u4fe1\u606f")
    public Msg update(@PathVariable Long id, @RequestBody DoctorParam param) {
        try {
            return Msg.success().data("doctor", doctorService.update(id, param));
        } catch (Exception ex) {
            return Msg.fail().mess(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @ApiOperation("\u5220\u9664\u533b\u751f\u53ca\u5176\u5bf9\u5e94\u8d26\u53f7")
    public Msg delete(@PathVariable Long id) {
        doctorService.delete(id);
        return Msg.success();
    }

    @PutMapping("/{id}/password")
    @ApiOperation("\u91cd\u7f6e\u533b\u751f\u8d26\u53f7\u5bc6\u7801")
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
    @ApiOperation("\u91cd\u7f6e\u533b\u751f\u8d26\u53f7\u5bc6\u7801\u517c\u5bb9\u63a5\u53e3")
    public Msg resetPasswordAlias(@PathVariable Long id,
                                  @RequestParam(required = false) String password) {
        return resetPassword(id, password);
    }
}
