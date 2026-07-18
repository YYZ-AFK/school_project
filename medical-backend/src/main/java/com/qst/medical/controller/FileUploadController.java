package com.qst.medical.controller;

import com.qst.medical.common.Msg;
import com.qst.medical.service.FileUploadService;
import io.swagger.annotations.Api;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.RolesAllowed;

@Api(tags = "文件上传控制器")
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
    public Msg fileUpload(@RequestParam("file") MultipartFile file) {
        return fileUploadService.upload(file);
    }
}
