package com.qst.medical.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Result;
import com.qst.medical.entity.MaterialEntity;
import com.qst.medical.mapper.MaterialMapper;
import com.qst.medical.model.MaterialModel;
import com.qst.medical.param.MaterialParam;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class MaterialService {
    private final MaterialMapper materialMapper;

    public MaterialService(MaterialMapper materialMapper) {
        this.materialMapper = materialMapper;
    }

    /**
     * 分页、关键字查询必备材料信息
     */
    public Result getAllMaterialWithPage(MaterialParam param) {
        if (param.getSize() == 0) {
            param.setSize(1);
        }
        PageHelper.startPage(param.getPn(), param.getSize());
        List<MaterialModel> list = materialMapper.getAllMaterial(param);
        PageInfo<MaterialModel> info = new PageInfo<>(list, 5);
        return Result.success().data("pageInfo", info);
    }

    /**
     * 添加必备材料
     */
    @Transactional
    public Result saveMaterial(MaterialParam param) {
        param.setCreateTime(new Date());
        param.setUpdateTime(new Date());
        MaterialEntity entity = new MaterialEntity();
        BeanUtils.copyProperties(param, entity);
        int i = materialMapper.saveMaterial(entity);
        if (i > 0) {
            return Result.success().mess("添加成功");
        }
        return Result.fail().mess("添加失败");
    }

    /**
     * 更新必备材料
     */
    @Transactional
    public Result updateMaterial(Long id, MaterialParam param) {
        MaterialEntity entity = new MaterialEntity();
        BeanUtils.copyProperties(param, entity);
        entity.setUpdateTime(new Date());
        entity.setId(id);
        int i = materialMapper.updateMaterial(entity);
        if (i > 0) {
            return Result.success().mess("修改成功").data("updateData", entity);
        }
        return Result.fail().mess("修改失败");
    }

    /**
     * 根据id删除必备材料
     */
    @Transactional
    public Result deleteMaterial(Long id) {
        int i = materialMapper.deleteMaterial(id);
        if (i > 0) {
            return Result.success().mess("删除成功");
        }
        return Result.fail().mess("删除失败");
    }
}
