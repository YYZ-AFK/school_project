package com.qst.medical.model;

import com.qst.medical.domain.Doctor;
import com.qst.medical.domain.DoctorLevel;
import com.qst.medical.domain.TreatType;

public class DoctorModel extends Doctor {
    private DoctorLevel doctorLevel;
    private TreatType treatType;

    public DoctorLevel getDoctorLevel() {
        return doctorLevel;
    }

    public void setDoctorLevel(DoctorLevel doctorLevel) {
        this.doctorLevel = doctorLevel;
    }

    public TreatType getTreatType() {
        return treatType;
    }

    public void setTreatType(TreatType treatType) {
        this.treatType = treatType;
    }
}
