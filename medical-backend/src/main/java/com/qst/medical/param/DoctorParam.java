package com.qst.medical.param;

import com.qst.medical.domain.Doctor;
import lombok.Data;

@Data
public class DoctorParam extends Doctor {
    private String pwd;
    private String phoneNumber;

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getPhoneNumber() {
        return phoneNumber != null ? phoneNumber : getPhone();
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        setPhone(phoneNumber);
    }
}
