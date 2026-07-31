package com.qst.medical.controller;

import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Result;
import com.qst.medical.domain.DrugCompany;
import com.qst.medical.service.CompanyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;

@Tag(name = "医药公司信息控制器")
@RestController
@RequestMapping("/api/companys")
@CrossOrigin
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    /**
     * 医药公司信息的分页查询,name不为空则模糊查询
     *
     * @param pn
     * @param size
     * @param name
     * @return
     */
    @GetMapping(value = {"/{pn}/{size}", ""})
    public Result getCompanyWithPage(@PathVariable(value = "pn", required = false) Integer pn,
                                     @PathVariable(value = "size", required = false) Integer size,
                                     @RequestParam(required = false) String name) {
        PageInfo<DrugCompany> info = companyService.getCompanyWithPage(pn, size, name);
        if (info != null) {
            return Result.success().data("pageInfo", info);
        }
        return Result.fail();
    }

    /**
     * 根据id查询一个医药公司信息
     *
     * @param id
     * @return
     */
    @GetMapping("{id}")
    public Result getCompanyById(@PathVariable("id") Integer id) {
        Result result = companyService.getCompanyById(id);
        return result;
    }

    /**
     * 添加一个医药公司
     *
     * @param company
     * @return
     */
    @RolesAllowed({"ROLE_1"})
    @PostMapping(value = "")
    public Result saveCompany(@Validated @RequestBody DrugCompany company) {
        String name = company.getCompanyName();
        String phone = company.getCompanyPhone();

        if (name == null || phone == null || name.isEmpty() || phone.isEmpty()) {
            return Result.fail().mess("填写信息不完整");
        }
        return companyService.saveCompany(company);
    }

    /**
     * 根据id更新医药公司信息
     *
     * @param company
     * @return
     */
    @RolesAllowed({"ROLE_1"})
    @PutMapping(value = "/{id}")
    public Result updateCompanyById(@PathVariable("id") Long id, @RequestBody DrugCompany company) {
        String name = company.getCompanyName();
        String phone = company.getCompanyPhone();
        if (name == null || name.isEmpty()) {
            return Result.fail().mess("公司名称不能为空");
        }
        if (phone == null || phone.isEmpty()) {
            return Result.fail().mess("公司电话不能为空");
        }
        Result result = companyService.updateCompanyById(id, company);
        return result;
    }

    /**
     * 根据id删除医药公司信息
     *
     * @param id
     * @return
     */
    @RolesAllowed({"ROLE_1"})
    @DeleteMapping("{id}")
    public Result deleteCompanyById(@PathVariable("id") Integer id) {
        Result result = companyService.deleteCompanyById(id);
        return result;
    }

}
