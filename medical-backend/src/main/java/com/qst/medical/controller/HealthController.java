package com.qst.medical.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Api(tags = "\u7cfb\u7edf\u72b6\u6001\u63a5\u53e3")
public class HealthController {
    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    @ApiOperation("\u68c0\u67e5\u540e\u7aef\u548c\u6570\u636e\u5e93\u8fde\u63a5\u72b6\u6001")
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
