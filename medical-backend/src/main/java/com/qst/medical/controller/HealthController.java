package com.qst.medical.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "系统状态接口")
public class HealthController {
    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    @Operation(summary = "检查后端和数据库连接状态")
    public Map<String, Object> health() {
        Integer tableCount = jdbcTemplate.queryForObject(
                "select count(*) from information_schema.tables where table_schema = 'bin_text'",
                Integer.class
        );
        Map<String, Object> result = new HashMap<>();
        result.put("code", 20000);
        result.put("message", "backend started");
        result.put("database", "bin_text");
        result.put("tableCount", tableCount);
        return result;
    }
}
