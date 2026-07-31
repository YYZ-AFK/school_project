package com.qst.medical.controller;

import com.qst.medical.common.Result;
import com.qst.medical.service.FileUploadService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.RolesAllowed;

@Tag(name = "文件上传控制器")
@RestController
@RequestMapping("/api/base/upload")
@CrossOrigin
public class FileUploadController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @RolesAllowed({"ROLE_1", "ROLE_2"})
    @PostMapping(value = "")
    public Result fileUpload(@RequestParam("file") MultipartFile file) {
        return fileUploadService.upload(file);
    }
}
