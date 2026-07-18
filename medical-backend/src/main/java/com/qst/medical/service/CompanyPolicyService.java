package com.qst.medical.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Msg;
import com.qst.medical.entity.CompanyPolicyEntity;
import com.qst.medical.mapper.CompanyPolicyMapper;
import com.qst.medical.model.CompanyPolicyModel;
import com.qst.medical.param.CompanyPolicyParam;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class CompanyPolicyService {
    private final CompanyPolicyMapper companyPolicyMapper;

    public CompanyPolicyService(CompanyPolicyMapper companyPolicyMapper) {
        this.companyPolicyMapper = companyPolicyMapper;
    }

    /**
     * 分页、关键字查询医药公司政策信息
     */
    public Msg getAllPolicyWithPage(CompanyPolicyParam param) {
        if (param.getSize() == 0) {
            param.setSize(1);
        }
        PageHelper.startPage(param.getPn(), param.getSize());
        List<CompanyPolicyModel> list = companyPolicyMapper.getAllPolicy(param);
        PageInfo<CompanyPolicyModel> info = new PageInfo<>(list, 5);
        return Msg.success().data("pageInfo", info);
    }

    /**
     * 添加医药公司政策
     */
    @Transactional
    public Msg savePolicy(CompanyPolicyParam param) {
        param.setCreateTime(new Date());
        param.setUpdateTime(new Date());
        CompanyPolicyEntity entity = new CompanyPolicyEntity();
        BeanUtils.copyProperties(param, entity);
        int i = companyPolicyMapper.savePolicy(entity);
        if (i > 0) {
            return Msg.success().mess("添加成功");
        }
        return Msg.fail().mess("添加失败");
    }

    /**
     * 更新医药公司政策
     */
    @Transactional
    public Msg updatePolicy(Long id, CompanyPolicyParam param) {
        CompanyPolicyEntity entity = new CompanyPolicyEntity();
        BeanUtils.copyProperties(param, entity);
        entity.setUpdateTime(new Date());
        entity.setId(id);
        int i = companyPolicyMapper.updatePolicy(entity);
        if (i > 0) {
            return Msg.success().mess("修改成功").data("updateData", entity);
        }
        return Msg.fail().mess("修改失败");
    }

    /**
     * 根据id删除医药公司政策
     */
    @Transactional
    public Msg deletePolicy(Long id) {
        int i = companyPolicyMapper.deletePolicy(id);
        if (i > 0) {
            return Msg.success().mess("删除成功");
        }
        return Msg.fail().mess("删除失败");
    }
}
