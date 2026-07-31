package com.qst.medical.controller;

import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Result;
import com.qst.medical.domain.Sale;
import com.qst.medical.service.SaleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Tag(name = "药店信息控制器")
@RestController
@RequestMapping("/api/sales")
public class SaleController {
    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    /**
     * 药店信息的分页查询，name不为空则模糊查询
     */
    @GetMapping
    public Result getSaleWithPage(@RequestParam(required = false) Integer pn,
                                  @RequestParam(required = false) Integer size,
                                  @RequestParam(required = false) String keyword) {
        PageInfo<Sale> info = saleService.getSaleWithPage(pn, size, keyword);
        if (info != null) {
            return Result.success().data("pageInfo", info);
        }
        return Result.fail();
    }

    /**
     * 根据id查询一个药店
     */
    @GetMapping("{id}")
    public Result getSaleById(@PathVariable("id") Integer id) {
        return saleService.getSaleById(id);
    }

    /**
     * 添加一个药店
     */
    @PostMapping
    public Result saveSale(@Validated @RequestBody Sale sale) {
        if (sale.getSaleName() == null || sale.getSaleName().trim().isEmpty()) {
            return Result.fail().mess("药店名称不能为空");
        }
        return saleService.saveSale(sale);
    }

    /**
     * 根据id更新药店信息
     */
    @PutMapping("{id}")
    public Result updateSaleById(@PathVariable("id") Long id, @RequestBody Sale sale) {
        if (sale.getSaleName() == null || sale.getSaleName().trim().isEmpty()) {
            return Result.fail().mess("药店名称不能为空");
        }
        return saleService.updateSaleById(id, sale);
    }

    /**
     * 根据id删除药店信息
     */
    @DeleteMapping("{id}")
    public Result deleteSaleById(@PathVariable("id") Integer id) {
        return saleService.deleteSaleById(id);
    }
}
