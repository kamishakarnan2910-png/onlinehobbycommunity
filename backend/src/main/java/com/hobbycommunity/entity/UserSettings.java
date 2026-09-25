package com.hobbycommunity.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Integer userId;

    @Column(name = "community_notifications")
    private Boolean communityNotifications = true;

    @Column(name = "post_notifications")
    private Boolean postNotifications = true;

    @Column(name = "theme")
    private String theme = "light";


    public UserSettings() {
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }


    public Boolean getCommunityNotifications() {
        return communityNotifications;
    }

    public void setCommunityNotifications(
            Boolean communityNotifications) {

        this.communityNotifications =
                communityNotifications;
    }


    public Boolean getPostNotifications() {
        return postNotifications;
    }

    public void setPostNotifications(
            Boolean postNotifications) {

        this.postNotifications =
                postNotifications;
    }


    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }
}