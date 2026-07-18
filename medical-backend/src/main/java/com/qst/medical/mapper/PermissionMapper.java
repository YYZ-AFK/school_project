package com.qst.medical.mapper;

import com.qst.medical.model.PermissionModel;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PermissionMapper {
    List<PermissionModel> listByRole(@Param("roleName") String roleName);
}
