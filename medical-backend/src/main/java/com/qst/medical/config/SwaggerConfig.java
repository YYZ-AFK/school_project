package com.qst.medical.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI createRestApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("慧医数字医疗应用系统-API文档")
                        .version("1.0"));
    }
}
