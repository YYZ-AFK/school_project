package com.qst.medical.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Msg;
import com.qst.medical.domain.Sale;
import com.qst.medical.entity.SaleEntity;
import com.qst.medical.mapper.SaleMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class SaleService {
    private final SaleMapper saleMapper;

    public SaleService(SaleMapper saleMapper) {
        this.saleMapper = saleMapper;
    }

    /**
     * 获取所有药店信息并分页，name不为空则模糊查询
     */
    public PageInfo<Sale> getSaleWithPage(Integer pn, Integer size, String name) {
        if (pn == null) {
            pn = 1;
        }
        if (size == null || size == 0) {
            size = Integer.MAX_VALUE;
        }
        PageHelper.startPage(pn, size);
        List<Sale> list = saleMapper.getAllSale(name);
        PageInfo<Sale> info = new PageInfo<>(list, 5);
        return info;
    }

    /**
     * 根据id查找一个药店
     */
    public Msg getSaleById(Integer id) {
        Sale sale = saleMapper.getSaleById(id);
        if (sale == null) {
            return Msg.fail().mess("没有找到");
        }
        return Msg.success().data("sale", sale);
    }

    /**
     * 添加一个药店
     */
    public Msg saveSale(Sale sale) {
        Date d = new Date();
        sale.setCreatetime(d);
        sale.setUpdatetime(d);
        SaleEntity se = new SaleEntity();
        BeanUtils.copyProperties(sale, se);
        int i = saleMapper.saveSale(se);
        if (i > 0) {
            return Msg.success().mess("添加成功");
        }
        return Msg.fail().mess("添加失败");
    }

    /**
     * 根据id更新药店信息
     */
    public Msg updateSaleById(Long id, Sale sale) {
        sale.setUpdatetime(new Date());
        sale.setSaleId(id);
        int i = saleMapper.updateSaleById(sale);
        if (i > 0) {
            return Msg.success().mess("修改成功");
        }
        return Msg.fail().mess("修改失败");
    }

    /**
     * 根据id删除药店信息
     */
    public Msg deleteSaleById(Integer id) {
        int i = saleMapper.deleteSaleById(id);
        if (i > 0) {
            return Msg.success().mess("删除成功");
        }
        return Msg.fail().mess("删除失败");
    }
}
