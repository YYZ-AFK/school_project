package com.qst.medical.mapper;

import com.qst.medical.domain.Account;
import com.qst.medical.model.AccountModel;
import org.apache.ibatis.annotations.Param;

public interface AccountMapper {
    AccountModel securityLogin(@Param("uname") String uname);

    int countPhone(@Param("phoneNumber") String phoneNumber, @Param("accountId") Long accountId);

    int countUname(@Param("uname") String uname);

    int save(Account account);

    int updateBase(Account account);

    int updatePassword(@Param("id") Long id, @Param("pwd") String pwd);

    int delete(@Param("id") Long id);
}
