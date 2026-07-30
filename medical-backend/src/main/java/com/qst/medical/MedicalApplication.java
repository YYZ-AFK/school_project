package com.qst.medical;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@MapperScan("com.qst.medical.mapper")
@SpringBootApplication
public class MedicalApplication {
    public static void main(String[] args) {
        try {
            SpringApplication.run(MedicalApplication.class, args);
        } catch (Exception ex) {
            if (isPortAlreadyInUse(ex)) {
                printOccupiedPortTip();
            }
            throw ex;
        }
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.trim().isEmpty()) {
                return value;
            }
        }
        return "";
    }

    private static boolean isPortAlreadyInUse(Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            String className = current.getClass().getName();
            String message = current.getMessage();
            if (className.contains("PortInUseException")
                    || (message != null && (message.contains("Port 8080 was already in use")
                    || message.contains("Address already in use")))) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }

    private static void printOccupiedPortTip() {
        String port = firstNonBlank(System.getProperty("server.port"), System.getenv("SERVER_PORT"), "8080");

        System.out.println();
        System.out.println("Backend port " + port + " is already in use.");
        System.out.println("If this is an old medical backend window, you can use:");
        System.out.println("Backend health: http://localhost:" + port + "/api/health");
        System.out.println("Swagger URL: http://localhost:" + port + "/swagger-ui.html");
        System.out.println("Frontend URL: http://localhost:5173");
        System.out.println("If you need to restart, close the old backend window or stop the java process using this port.");
        System.out.println();
    }

    @Bean
    public ApplicationRunner applicationRunner() {
        return args -> {
            String backendPort = firstNonBlank(System.getProperty("server.port"), System.getenv("SERVER_PORT"), "8080");
            String frontendPort = firstNonBlank(System.getenv("PORT"), "5173");

            System.out.println();
            System.out.println("Medical backend started.");
            System.out.println("Backend health: http://localhost:" + backendPort + "/api/health");
            System.out.println("Swagger URL: http://localhost:" + backendPort + "/swagger-ui.html");
            System.out.println("Frontend URL: http://localhost:" + frontendPort);
            System.out.println();
        };
    }
}
