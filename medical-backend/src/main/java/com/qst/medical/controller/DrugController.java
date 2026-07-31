package com.qst.medical.controller;

import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Result;
import com.qst.medical.model.DrugModel;
import com.qst.medical.param.DrugParam;
import com.qst.medical.service.DrugService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import java.util.Date;

@Tag(name = "药品控制器类")
@RestController
@RequestMapping("/api/drugs")
@CrossOrigin
public class DrugController {
    private final DrugService drugService;

    public DrugController(DrugService drugService) {
        this.drugService = drugService;
    }

    /**
     * 药品信息的分页查询,name不为空则模糊查询
     *
     * @param pn
     * @param size
     * @param name
     * @return
     */
    @GetMapping("/{pn}/{size}")
    public Result getDrugWithPage(@PathVariable("pn") int pn, @PathVariable("size") int size, @RequestParam(required = false) String name) {
        PageInfo<DrugModel> info = drugService.getDrugWithPage(pn, size, name);
        if (info != null) {
            return Result.success().data("drugPageInfo", info);
        }
        return Result.fail();
    }

    /**
     * 新增药品信息
     *
     * @param drugParam
     * @return
     */
    @RolesAllowed({"ROLE_1", "ROLE_2"})
    @PostMapping(value = "")
    public Result saveDrug(@Validated @RequestBody DrugParam drugParam) {
        drugParam.setCreatetime(new Date());
        drugParam.setUpdatetime(new Date());
        Result result = drugService.saveDrug(drugParam);
        return result;
    }

    /**
     * 更新药品信息
     *
     * @param drugParam
     * @return
     */
    @RolesAllowed({"ROLE_1"})
    @PutMapping(value = "/{id}")
    public Result updateDrug(@PathVariable("id") Long id, @RequestBody DrugParam drugParam) {
        return drugService.updateDrug(id, drugParam);
    }

    /**
     * 根据id删除药品信息以及药品-药店关联表的信息
     *
     * @param drugId
     * @return
     */
    @RolesAllowed({"ROLE_1"})
    @DeleteMapping(value = "/{drugId}")
    public Result deleteDrug(@PathVariable("drugId") Long drugId) {
        return drugService.deleteDrug(drugId);
    }
}
