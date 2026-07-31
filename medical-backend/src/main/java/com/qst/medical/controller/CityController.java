package com.qst.medical.controller;

import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Result;
import com.qst.medical.model.CityModel;
import com.qst.medical.service.CityService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;

@Tag(name = "城市信息控制器")
@RestController
@RequestMapping("/api/citys")
@CrossOrigin
public class CityController {
    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping(value = {"/{pn}/{size}", ""})
    public Result getCityWithPage(@PathVariable(value = "pn", required = false) Integer pn,
                                  @PathVariable(value = "size", required = false) Integer size,
                                  @RequestParam(required = false) String name) {
        PageInfo<CityModel> info = cityService.getCityWithPage(pn, size, name);
        if (info != null) {
            return Result.success().data("cityPageInfo", info);
        }
        return Result.fail();
    }

    /**
     * 根据id查询一个城市信息
     *
     * @param id
     * @return
     */
    @GetMapping("{id}")
    public Result getCityById(@PathVariable("id") Integer id) {
        Result result = cityService.getCityById(id);
        return result;
    }

    /**
     * 新增一个城市信息
     *
     * @param cityNumber
     * @return
     */
    @RolesAllowed({"ROLE_1"})
    @PostMapping(value = "")
    public Result saveCity(Integer cityNumber) {
        if (cityService.checkCityByName(cityNumber) > 0) {
            return Result.fail().mess("城市已经存在").code(10004);
        }
        return cityService.saveCity(cityNumber);
    }

    /**
     * 根据id删除城市
     *
     * @param id
     * @return
     */
    @RolesAllowed({"ROLE_1"})
    @DeleteMapping("{id}")
    public Result deleteCityById(@PathVariable("id") Integer id) {
        Result result = cityService.deleteCityById(id);
        return result;
    }
}
