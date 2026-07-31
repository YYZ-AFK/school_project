package com.qst.medical.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Result;
import com.qst.medical.domain.DrugCompany;
import com.qst.medical.entity.DrugCompanyEntity;
import com.qst.medical.mapper.CompanyMapper;
import com.qst.medical.mapper.CompanyPolicyMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class CompanyService {

    private final CompanyMapper companyMapper;
    private final CompanyPolicyMapper companyPolicyMapper;

    public CompanyService(CompanyMapper companyMapper, CompanyPolicyMapper companyPolicyMapper) {
        this.companyMapper = companyMapper;
        this.companyPolicyMapper = companyPolicyMapper;
    }

    /**
     * 获取所有医药公司信息并分页，name不为空则模糊查询
     *
     * @param pn
     * @param size
     * @param name
     */
    public PageInfo<DrugCompany> getCompanyWithPage(Integer pn, Integer size, String name) {
        if (pn == null && size == null) {
            pn = 1;
            size = Integer.MAX_VALUE;
        }
        if (pn == null) {
            pn = 1;
        }
        if (size == null) {
            size = Integer.MAX_VALUE;
        }
        if (size == 0) {
            size = 1;
        }
        PageHelper.startPage(pn, size);
        List<DrugCompany> list = companyMapper.getAllCompany(name);
        PageInfo<DrugCompany> info = new PageInfo<>(list, 5);
        return info;
    }

    /**
     * 根据id查找一个医药公司
     *
     * @param id
     * @return
     */
    public Result getCompanyById(Integer id) {
        DrugCompany company = companyMapper.getCompanyById(id);

        if (company == null) {
            return Result.fail().mess("没有找到");
        }
        return Result.success().data("company", company);
    }

    /**
     * 添加一个医药公司
     *
     * @param company
     * @return
     */
    public Result saveCompany(DrugCompany company) {
        Date d = new Date();
        company.setCreatetime(d);
        company.setUpdatetime(d);
        DrugCompanyEntity dce = new DrugCompanyEntity();
        BeanUtils.copyProperties(company, dce);//对象拷贝
        int i = companyMapper.saveCompany(dce);
        if (i > 0) {
            Long total = dce.getTotal() != null ? dce.getTotal() : (long) i;
            Long num = total % 5 == 0 ? (total / 5) : (total / 5) + 1;
            return Result.success().data("pages", num).mess("添加成功");
        }
        return Result.fail().mess("添加失败");
    }

    /**
     * 根据id更新医药公司信息
     *
     * @param company
     * @return
     */
    public Result updateCompanyById(Long id, DrugCompany company) {
        company.setUpdatetime(new Date());
        company.setCompanyId(id);
        int i = companyMapper.updateCompanyById(company);
        if (i > 0) {
            return Result.success().mess("修改成功");
        }
        return Result.fail().mess("修改失败");
    }

    /**
     * 根据id删除医药公司信息，同时删除该公司关联的政策
     */
    @Transactional
    public Result deleteCompanyById(Integer id) {
        companyPolicyMapper.deletePolicyByCompany(id);
        int i = companyMapper.deleteCompanyById(id);
        if (i > 0) {
            return Result.success().mess("删除成功");
        } else {
            return Result.fail().mess("删除失败");
        }
    }

}
