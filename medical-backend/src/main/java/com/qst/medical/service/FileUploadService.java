package com.qst.medical.service;

import com.qst.medical.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.UUID;

@Service
public class FileUploadService {
    @Value("${upload.path}")
    private String uploadPath;

    public Result upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return Result.fail().mess("请选择要上传的图片");
        }

        String extension = getExtension(file.getOriginalFilename());
        if (!isAllowedImage(extension, file.getContentType())) {
            return Result.fail().mess("只支持 jpg、jpeg、png、gif、webp 图片");
        }

        String fileName = UUID.randomUUID().toString().replace("-", "") + extension;
        try {
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists() && !uploadDir.mkdirs()) {
                return Result.fail().mess("上传目录创建失败");
            }

            File targetFile = new File(uploadDir, fileName);
            Files.copy(file.getInputStream(), targetFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            String url = "/image/" + fileName;
            return Result.success().mess("上传成功").data("url", url);
        } catch (IOException e) {
            return Result.fail().mess("上传失败：" + e.getMessage());
        }
    }

    private String getExtension(String originalName) {
        if (originalName == null) {
            return "";
        }
        int dot = originalName.lastIndexOf('.');
        if (dot < 0 || dot == originalName.length() - 1) {
            return "";
        }
        return originalName.substring(dot).toLowerCase(Locale.ROOT);
    }

    private boolean isAllowedImage(String extension, String contentType) {
        boolean imageType = contentType != null && contentType.toLowerCase(Locale.ROOT).startsWith("image/");
        return imageType && (".jpg".equals(extension)
                || ".jpeg".equals(extension)
                || ".png".equals(extension)
                || ".gif".equals(extension)
                || ".webp".equals(extension));
    }
}
