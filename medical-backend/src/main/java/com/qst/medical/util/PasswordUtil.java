package com.qst.medical.util;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;

/**
 * @author yyz
 * @date 2026/7/31 14:20
 */
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {
    public static void main(String[] args) {
        // 1. 直接 new 一个 BCrypt 加密器
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        // 2. 直接对 "123456" 字符串进行加密
        String rawPassword = "123456";
        String encodedPassword = encoder.encode(rawPassword);

        System.out.println("原始密码: " + rawPassword);
        System.out.println("加密后的密码: " + encodedPassword);
    }
}