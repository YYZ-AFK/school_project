package com.qst.medical.service;

import com.qst.medical.domain.Account;
import com.qst.medical.mapper.AccountMapper;
import com.qst.medical.model.AccountModel;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AccountService implements UserDetailsService {
    private final AccountMapper accountMapper;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AccountMapper accountMapper, PasswordEncoder passwordEncoder) {
        this.accountMapper = accountMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AccountModel account = securityLogin(username);
        if (account == null) {
            throw new UsernameNotFoundException("账户未找到");
        }
        return account;
    }

    public AccountModel securityLogin(String username) {
        if (!StringUtils.hasText(username)) {
            return null;
        }
        return accountMapper.securityLogin(username);
    }

    public Account createDoctorAccount(String realname, String phoneNumber, String rawPassword) {
        validatePhone(phoneNumber);
        if (accountMapper.countPhone(phoneNumber, null) > 0) {
            throw new IllegalArgumentException("手机号已存在");
        }
        Account account = new Account();
        account.setRealname(realname);
        account.setPhonenumber(phoneNumber);
        account.setUtype("ROLE_2");
        account.setUname(buildUniqueUsername(realname, phoneNumber));
        account.setPwd(passwordEncoder.encode(StringUtils.hasText(rawPassword) ? rawPassword : "666666"));
        accountMapper.save(account);
        return account;
    }

    public void updateDoctorAccount(Long accountId, String realname, String phoneNumber) {
        if (accountId == null) {
            return;
        }
        if (StringUtils.hasText(phoneNumber)) {
            validatePhone(phoneNumber);
            if (accountMapper.countPhone(phoneNumber, accountId) > 0) {
                throw new IllegalArgumentException("手机号已存在");
            }
        }
        Account account = new Account();
        account.setId(accountId);
        account.setRealname(realname);
        account.setPhonenumber(phoneNumber);
        accountMapper.updateBase(account);
    }

    public void resetPassword(Long accountId, String rawPassword) {
        if (accountId != null) {
            accountMapper.updatePassword(accountId, passwordEncoder.encode(StringUtils.hasText(rawPassword) ? rawPassword : "666666"));
        }
    }

    public void delete(Long accountId) {
        if (accountId != null) {
            accountMapper.delete(accountId);
        }
    }

    private String buildUniqueUsername(String realname, String phoneNumber) {
        String suffix = phoneNumber.length() > 4 ? phoneNumber.substring(phoneNumber.length() - 4) : phoneNumber;
        String base = (StringUtils.hasText(realname) ? realname : "doctor") + suffix;
        String username = base;
        int index = 1;
        while (accountMapper.countUname(username) > 0) {
            username = base + index;
            index++;
        }
        return username;
    }

    private void validatePhone(String phoneNumber) {
        if (!StringUtils.hasText(phoneNumber)) {
            throw new IllegalArgumentException("\u624b\u673a\u53f7\u4e0d\u80fd\u4e3a\u7a7a");
        }
        if (!phoneNumber.matches("^1\\d{10}$")) {
            throw new IllegalArgumentException("\u624b\u673a\u53f7\u5fc5\u987b\u662f11\u4f4d\u6570\u5b57");
        }
    }
}
