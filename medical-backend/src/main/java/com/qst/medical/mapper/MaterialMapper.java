package com.qst.medical.mapper;

import com.qst.medical.entity.MaterialEntity;
import com.qst.medical.model.MaterialModel;
import com.qst.medical.param.MaterialParam;

import java.util.List;

public interface MaterialMapper {

    /* 查询所有的必备材料 */
    List<MaterialModel> getAllMaterial(MaterialParam param);

    /* 新增必备材料 */
    int saveMaterial(MaterialEntity entity);

    /* 更新必备材料 */
    int updateMaterial(MaterialEntity entity);

    /* 根据id删除必备材料 */
    int deleteMaterial(Long id);
}
