package com.qst.medical.mapper;

import com.qst.medical.domain.DoctorLevel;
import com.qst.medical.domain.TreatType;
import com.qst.medical.model.DoctorModel;
import com.qst.medical.param.DoctorParam;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface DoctorMapper {
    List<DoctorModel> getAllDoctor(DoctorParam param);

    DoctorModel getById(@Param("id") Long id);

    List<DoctorLevel> getAllLevel();

    List<TreatType> getAllTreatType();

    int save(DoctorParam doctor);

    int update(DoctorParam doctor);

    int delete(@Param("id") Long id);
}
