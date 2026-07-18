package com.qst.medical.controller;

import springfox.documentation.annotations.ApiIgnore;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/smoke")
@ApiIgnore
public class DoctorSmokeController {
    private final JdbcTemplate jdbcTemplate;

    public DoctorSmokeController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/doctors")
    public Map<String, Object> doctors() {
        List<Map<String, Object>> doctors = jdbcTemplate.queryForList(
                "select id, name, phone, hospital from doctor limit 5"
        );
        Map<String, Object> result = new HashMap<>();
        result.put("code", 20000);
        result.put("data", doctors);
        return result;
    }
}
