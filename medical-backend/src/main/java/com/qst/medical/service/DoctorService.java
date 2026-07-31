package com.qst.medical.service;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.qst.medical.domain.Account;
import com.qst.medical.mapper.DoctorMapper;
import com.qst.medical.model.DoctorModel;
import com.qst.medical.param.DoctorParam;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class DoctorService {
    private final DoctorMapper doctorMapper;
    private final AccountService accountService;

    public DoctorService(DoctorMapper doctorMapper, AccountService accountService) {
        this.doctorMapper = doctorMapper;
        this.accountService = accountService;
    }

    public PageInfo<DoctorModel> list(DoctorParam param) {
        int pn = param.getPn() == null ? 1 : param.getPn();
        int size = param.getSize() == null ? 5 : param.getSize();
        PageHelper.startPage(pn, size);
        return new PageInfo<DoctorModel>(doctorMapper.getAllDoctor(param), 5);
    }

    public DoctorModel getById(Long id) {
        return doctorMapper.getById(id);
    }

    public Object levels() {
        return doctorMapper.getAllLevel();
    }

    public Object treatTypes() {
        return doctorMapper.getAllTreatType();
    }

    @Transactional
    public DoctorModel save(DoctorParam param) {
        fillDefault(param);
        Account account = accountService.createDoctorAccount(param.getName(), param.getPhoneNumber(), param.getPwd());
        param.setAccountId(account.getId());
        doctorMapper.save(param);
        return doctorMapper.getById(param.getId());
    }

    @Transactional
    public DoctorModel update(Long id, DoctorParam param) {
        DoctorModel old = doctorMapper.getById(id);
        if (old == null) {
            throw new IllegalArgumentException("医生不存在");
        }
        param.setId(id);
        if (!StringUtils.hasText(param.getPhone())) {
            param.setPhone(old.getPhone());
        }
        accountService.updateDoctorAccount(old.getAccountId(), param.getName(), param.getPhoneNumber());
        doctorMapper.update(param);
        return doctorMapper.getById(id);
    }

    @Transactional
    public void delete(Long id) {
        DoctorModel old = doctorMapper.getById(id);
        if (old == null) {
            return;
        }
        doctorMapper.delete(id);
        accountService.delete(old.getAccountId());
    }

    @Transactional
    public void resetPassword(Long id, String password) {
        DoctorModel old = doctorMapper.getById(id);
        if (old == null) {
            throw new IllegalArgumentException("\u533b\u751f\u4e0d\u5b58\u5728");
        }
        accountService.resetPassword(old.getAccountId(), password);
    }

    private void fillDefault(DoctorParam param) {
        if (!StringUtils.hasText(param.getHospital())) {
            param.setHospital("\u9752\u5c9b\u7b2c\u4e00\u4eba\u6c11\u533b\u9662");
        }
        if (!StringUtils.hasText(param.getPhone()) && StringUtils.hasText(param.getPhoneNumber())) {
            param.setPhone(param.getPhoneNumber());
        }
    }
}
