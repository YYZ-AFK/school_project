package com.qst.medical.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Result;
import com.qst.medical.entity.MedicalPolicyEntity;
import com.qst.medical.mapper.CityMapper;
import com.qst.medical.mapper.MedicalPolicyMapper;
import com.qst.medical.model.MedicalPolicyModel;
import com.qst.medical.param.MedicalPolicyParam;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class MedicalPolicyService {
    private final MedicalPolicyMapper medicalPolicyMapper;
    private final CityMapper cityMapper;

    public MedicalPolicyService(MedicalPolicyMapper medicalPolicyMapper, CityMapper cityMapper) {
        this.medicalPolicyMapper = medicalPolicyMapper;
        this.cityMapper = cityMapper;
    }

    /**
     * 分页、条件查询医保政策信息
     */
    public Result getMedicalPolicyWithPage(MedicalPolicyParam param) {
        PageHelper.startPage(param.getPn(), param.getSize());
        List<MedicalPolicyModel> list = medicalPolicyMapper.getAllPolicy(param);
        PageInfo<MedicalPolicyModel> info = new PageInfo<>(list, 5);
        return Result.success().data("pageInfo", info);
    }

    /**
     * 新增医保政策信息
     */
    @Transactional
    public Result saveMedicalPolicy(MedicalPolicyParam param) {
        param.setCreateTime(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        param.setUpdateTime(param.getCreateTime());
        MedicalPolicyEntity mpEntity = new MedicalPolicyEntity();
        BeanUtils.copyProperties(param, mpEntity);
        int i = medicalPolicyMapper.saveMedicalPolicy(mpEntity);
        if (i > 0) {
            return Result.success().mess("添加成功");
        }
        return Result.fail().mess("添加失败");
    }

    /**
     * 更新医保政策
     */
    @Transactional
    public Result updateMedicalPolicy(Long id, MedicalPolicyParam param) {
        MedicalPolicyEntity mpEntity = new MedicalPolicyEntity();
        BeanUtils.copyProperties(param, mpEntity);
        mpEntity.setId(id);
        int i = medicalPolicyMapper.updateMedicalPolicy(mpEntity);
        if (i > 0) {
            return Result.success().mess("修改成功").data("updateData", mpEntity);
        }
        return Result.fail().mess("修改失败");
    }

    /**
     * 根据id删除医保政策
     */
    @Transactional
    public Result deleteMedicalPolicy(Long id) {
        int i = medicalPolicyMapper.deleteMedicalPolicy(id);
        if (i > 0) {
            return Result.success().mess("删除成功");
        }
        return Result.fail().mess("删除失败：政策不存在");
    }

    /**
     * 删除城市时同时删除该城市的医保政策
     */
    @Transactional
    public Result deleteCityById(Integer id) {
        medicalPolicyMapper.deleteByCity(id);
        int i = cityMapper.deleteCityById(id);
        if (i > 0) {
            return Result.success().mess("删除成功");
        }
        return Result.fail().mess("删除失败");
    }
}
