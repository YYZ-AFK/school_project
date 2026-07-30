package com.qst.medical.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.qst.medical.common.Msg;
import com.qst.medical.domain.City;
import com.qst.medical.entity.CityEntity;
import com.qst.medical.mapper.CityMapper;
import com.qst.medical.mapper.MedicalPolicyMapper;
import com.qst.medical.model.CityModel;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class CityService {
    private final CityMapper cityMapper;
    private final MedicalPolicyMapper medicalPolicyMapper;

    public CityService(CityMapper cityMapper, MedicalPolicyMapper medicalPolicyMapper) {
        this.cityMapper = cityMapper;
        this.medicalPolicyMapper = medicalPolicyMapper;
    }

    /**
     * 获取所有城市信息并分页，name不为空则模糊查询,当pn和size为null,则整页查询
     *
     * @param pn
     * @param size
     * @param name
     */
    public PageInfo<CityModel> getCityWithPage(Integer pn, Integer size, String name) {
        if (pn == null && size == null) {
            pn = 1;
            size = 0;
        }
        if (pn == null) {
            pn = 1;
        }
        if (size == null) {
            size = 0;
        }
        PageHelper.startPage(pn, size);
        List<CityModel> list = cityMapper.getAllCity(name);
        PageInfo<CityModel> info = new PageInfo<>(list, 5);
        return info;
    }

    /**
     * 根据id查找一个城市
     *
     * @param id
     * @return
     */
    public Msg getCityById(Integer id) {
        City city = cityMapper.getCityById(id);

        if (city == null) {
            return Msg.fail().mess("没有找到");
        }
        return Msg.success().data("city", city);
    }

    /**
     * 添加一个城市
     *
     * @param cityNumber
     * @return
     */
    public Msg saveCity(Integer cityNumber) {
        City city = new City();
        Date d = new Date();
        city.setCityNumber(cityNumber);
        city.setCreatetime(d);
        city.setUpdatetime(d);
        CityEntity ce = new CityEntity();
        BeanUtils.copyProperties(city, ce);//对象拷贝
        int i = cityMapper.saveCity(ce);
        if (i > 0) {
            Long total = ce.getTotal() != null ? ce.getTotal() : (long) i;
            Long num = total % 5 == 0 ? (total / 5) : (total / 5) + 1;
            return Msg.success().data("pages", num).mess("添加成功");
        }
        return Msg.fail().mess("添加失败");
    }

    /**
     * 根据id删除城市，同时删除该城市的医保政策
     */
    @Transactional
    public Msg deleteCityById(Integer id) {
        medicalPolicyMapper.deleteByCity(id);
        int i = cityMapper.deleteCityById(id);
        if (i > 0) {
            return Msg.success().mess("删除成功");
        } else {
            return Msg.fail().mess("删除失败");
        }
    }

    /**
     * 检查城市名是否存在
     *
     * @param number
     * @return
     */
    public int checkCityByName(Integer number) {
        return cityMapper.checkCityByName(number);
    }

}
