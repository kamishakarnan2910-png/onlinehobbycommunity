package com.hobbycommunity.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:uploads}")
    private String uploadDirectory;


    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {

        String uploadPath =
                Paths.get(uploadDirectory)
                        .toAbsolutePath()
                        .normalize()
                        .toUri()
                        .toString();


        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath);
    }


    @Override
    public void addCorsMappings(
            CorsRegistry registry
    ) {

        registry
                .addMapping("/**")
                .allowedOrigins(
                        "https://onlinehobbycommunity-frontend.onrender.com"
                )
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
                .allowedHeaders("*");
    }
}

