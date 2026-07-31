package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.model.AccountModel;
import com.qst.medical.param.LoginParam;
import com.qst.medical.service.AccountService;
import com.qst.medical.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@Tag(name = "登录认证接口")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final AccountService accountService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager,
                          AccountService accountService,
                          JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.accountService = accountService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    @Operation(summary = "管理员登录")
    public Msg login(@Validated @RequestBody LoginParam param) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(param.getUsername(), param.getPassword())
            );
            AccountModel account = accountService.securityLogin(param.getUsername());
            String token = jwtUtil.generateToken(account);
            return Msg.success()
                    .data("token", token)
                    .data("userInfo", account);
        } catch (BadCredentialsException ex) {
            return Msg.fail().code(10002).mess("账号或密码错误");
        } catch (Exception ex) {
            return Msg.fail().code(10003).mess(ex.getMessage());
        }
    }
}
