package com.hobbycommunity.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponse {

    private Integer id;

    private String title;

    private String content;

    private String category;

    // Existing single image
    private String imageUrl;

    // Multiple images
    private List<String> imageUrls;

    private Integer userId;

    private String userName;

    private Integer communityId;

    private LocalDateTime createdAt;


    public PostResponse() {
    }


    // ========================================
    // ID
    // ========================================

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    // ========================================
    // TITLE
    // ========================================

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    // ========================================
    // CONTENT
    // ========================================

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }


    // ========================================
    // CATEGORY
    // ========================================

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    // ========================================
    // SINGLE IMAGE
    // ========================================

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    // ========================================
    // MULTIPLE IMAGES
    // ========================================

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(
            List<String> imageUrls
    ) {
        this.imageUrls = imageUrls;
    }


    // ========================================
    // USER ID
    // ========================================

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }


    // ========================================
    // USER NAME
    // ========================================

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }


    // ========================================
    // COMMUNITY ID
    // ========================================

    public Integer getCommunityId() {
        return communityId;
    }

    public void setCommunityId(Integer communityId) {
        this.communityId = communityId;
    }


    // ========================================
    // CREATED AT
    // ========================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}