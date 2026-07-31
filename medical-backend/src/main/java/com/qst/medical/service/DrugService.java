package com.qst.medical.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Result;
import com.qst.medical.entity.DrugEntity;
import com.qst.medical.mapper.DrugMapper;
import com.qst.medical.model.DrugModel;
import com.qst.medical.param.DrugParam;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class DrugService {
    private final DrugMapper drugMapper;

    public DrugService(DrugMapper drugMapper) {
        this.drugMapper = drugMapper;
    }

    /**
     * 获取所有药品信息并分页，name不为空则模糊查询
     */
    public PageInfo<DrugModel> getDrugWithPage(int pn, int size, String name) {
        PageHelper.startPage(pn, size);
        List<DrugModel> list = drugMapper.getAllDrug(name);
        PageInfo<DrugModel> info = new PageInfo<>(list, 5);
        return info;
    }

    /**
     * 添加药品信息
     */
    @Transactional
    public Result saveDrug(DrugParam drugParam) {
        drugParam.setCreatetime(new Date());
        drugParam.setUpdatetime(new Date());
        int i = drugMapper.saveDrug(drugParam);
        if (i > 0 && drugParam.getSaleIds() != null && drugParam.getSaleIds().length > 0) {
            drugMapper.insertSalePlace(drugParam.getDrugId(), drugParam.getSaleIds());
        }
        if (i > 0) {
            return Result.success().mess("添加成功");
        }
        return Result.fail().mess("添加失败");
    }

    /**
     * 更新药品信息：先更新药品本身，再重建销售地点关联
     */
    @Transactional
    public Result updateDrug(Long id, DrugParam drugParam) {
        drugParam.setUpdatetime(new Date());
        drugParam.setDrugId(id);

        // 1. 先更新药品本身
        DrugEntity drugEntity = new DrugEntity();
        BeanUtils.copyProperties(drugParam, drugEntity);
        int i = drugMapper.updateDrugById(drugEntity);
        if (i <= 0) {
            return Result.fail().mess("修改失败：药品不存在");
        }

        // 2. 再重建销售地点关联（先删后插）
        drugMapper.deleteSaleByDrugId(id);
        if (drugParam.getSaleIds() != null && drugParam.getSaleIds().length > 0) {
            drugMapper.insertSalePlace(id, drugParam.getSaleIds());
        }

        return Result.success().mess("修改成功");
    }

    /**
     * 根据id删除药品信息及关联的销售地点
     */
    @Transactional
    public Result deleteDrug(Long drugId) {
        // 先删关联，再删药品
        drugMapper.deleteSaleByDrugId(drugId);
        int i = drugMapper.deleteDrugById(drugId);
        if (i > 0) {
            return Result.success().mess("删除成功");
        }
        return Result.fail().mess("删除失败：药品不存在");
    }

}
