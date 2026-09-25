const API_BASE_URL =
    "http://localhost:8080";

const urlParams =
    new URLSearchParams(window.location.search);

const communityId =
    urlParams.get("id");

const currentUserId =
    localStorage.getItem("userId");

const currentUserRole =
    localStorage.getItem("userRole");


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        if (!communityId) {

            alert("Community not found.");

            window.location.href =
                "../community/community.html";

            return;
        }

        loadCommunity();

        loadMemberCount();

        checkMembership();

        loadRecentPosts();

        setupDeleteButton();

        setupCreatePostButton();
    }
);


// ===============================
// CREATE POST BUTTON
// ===============================

function setupCreatePostButton() {

    const createPostButton =
        document.getElementById(
            "createPostButton"
        );

    if (!createPostButton) {
        return;
    }

    createPostButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                `../create-post/create-post.html?communityId=${encodeURIComponent(communityId)}`;
        }
    );
}


// ===============================
// LOAD COMMUNITY
// ===============================

async function loadCommunity() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/communities/${communityId}`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load community"
            );
        }

        const community =
            await response.json();

        const nameElement =
            document.getElementById(
                "communityName"
            );

        const descriptionElement =
            document.getElementById(
                "communityDescription"
            );

        const categoryElement =
            document.getElementById(
                "communityCategory"
            );

        const aboutElement =
            document.getElementById(
                "aboutCommunity"
            );

        const iconElement =
            document.getElementById(
                "communityIcon"
            );


        if (nameElement) {

            nameElement.textContent =
                community.name ||
                "Community";
        }


        if (descriptionElement) {

            descriptionElement.textContent =
                community.description ||
                "No description available.";
        }


        if (categoryElement) {

            categoryElement.textContent =
                `🎨 ${community.category || "General"}`;
        }


        if (aboutElement) {

            aboutElement.textContent =
                community.description ||
                "No information available.";
        }


        if (
            iconElement &&
            community.imageUrl
        ) {

            iconElement.innerHTML =
                `
                <img
                    src="${API_BASE_URL}${community.imageUrl}"
                    alt="Community Image">
                `;
        }


        if (currentUserId) {

            const creatorId =
                community.createdBy;

            const isCreator =
                Number(creatorId) ===
                Number(currentUserId);

            const isAdmin =
                currentUserRole &&
                currentUserRole.toUpperCase() ===
                "ADMIN";

            if (
                isCreator ||
                isAdmin
            ) {

                const deleteButton =
                    document.getElementById(
                        "deleteCommunityButton"
                    );

                if (deleteButton) {

                    deleteButton.style.display =
                        "inline-block";
                }
            }
        }

    } catch (error) {

        console.error(
            "Community loading error:",
            error
        );

        const nameElement =
            document.getElementById(
                "communityName"
            );

        if (nameElement) {

            nameElement.textContent =
                "Unable to load community";
        }
    }
}


// ===============================
// MEMBER COUNT
// ===============================

async function loadMemberCount() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/communities/${communityId}/members/count`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load member count"
            );
        }

        const count =
            await response.json();

        const memberElement =
            document.getElementById(
                "memberCount"
            );

        if (memberElement) {

            memberElement.textContent =
                `👥 ${count} Members`;
        }

    } catch (error) {

        console.error(
            "Member count error:",
            error
        );
    }
}


// ===============================
// CHECK MEMBERSHIP
// ===============================

async function checkMembership() {

    if (!currentUserId) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/community-members/check?communityId=${communityId}&userId=${currentUserId}`
            );

        if (!response.ok) {
            return;
        }

        const isMember =
            await response.json();

        const joinButton =
            document.getElementById(
                "joinButton"
            );

        if (!joinButton) {
            return;
        }

        if (isMember === true) {

            joinButton.textContent =
                "Joined ✓";

            joinButton.disabled =
                true;

        } else {

            joinButton.textContent =
                "Join Community";

            joinButton.disabled =
                false;
        }

    } catch (error) {

        console.error(
            "Membership check error:",
            error
        );
    }
}


// ===============================
// JOIN COMMUNITY
// ===============================

const joinButton =
    document.getElementById(
        "joinButton"
    );

if (joinButton) {

    joinButton.addEventListener(
        "click",
        joinCommunity
    );
}


async function joinCommunity() {

    if (!currentUserId) {

        alert(
            "Please login first."
        );

        return;
    }

    try {

        const joinData = {

            communityId:
                Number(communityId),

            userId:
                Number(currentUserId)
        };


        const response =
            await fetch(
                `${API_BASE_URL}/api/community-members`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            joinData
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Join error:",
                errorText
            );

            throw new Error(
                "Unable to join community"
            );
        }


        alert(
            "Joined community successfully! 🎉"
        );


        await loadMemberCount();

        await checkMembership();

    } catch (error) {

        console.error(
            "Join community error:",
            error
        );

        alert(
            "Unable to join community."
        );
    }
}


// ===============================
// DELETE COMMUNITY
// ===============================

function setupDeleteButton() {

    const deleteButton =
        document.getElementById(
            "deleteCommunityButton"
        );

    if (!deleteButton) {
        return;
    }

    deleteButton.addEventListener(
        "click",
        deleteCommunity
    );
}


async function deleteCommunity() {

    if (!currentUserId) {

        alert(
            "Please login first."
        );

        return;
    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this community?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const deleteUrl =
            `${API_BASE_URL}/api/communities/${communityId}?userId=${encodeURIComponent(currentUserId)}&role=${encodeURIComponent(currentUserRole || "")}`;


        const response =
            await fetch(
                deleteUrl,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Delete backend error:",
                errorText
            );

            throw new Error(
                "Delete failed"
            );
        }


        alert(
            "Community deleted successfully! 🗑️"
        );


        window.location.href =
            "../community/community.html";

    } catch (error) {

        console.error(
            "Delete community error:",
            error
        );

        alert(
            "Unable to delete community."
        );
    }
}


// ===============================
// LOAD RECENT POSTS
// ===============================

async function loadRecentPosts() {

    const container =
        document.getElementById(
            "recentPostsContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        `
        <p class="empty-post-message">
            Loading posts...
        </p>
        `;


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/posts/community/${communityId}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load posts"
            );
        }


        const posts =
            await response.json();


        container.innerHTML =
            "";


        if (
            !posts ||
            posts.length === 0
        ) {

            container.innerHTML =
                `
                <p class="empty-post-message">
                    No posts available yet.
                </p>
                `;

            return;
        }


        posts.forEach(
            function (post) {

                const card =
                    createPostCard(post);

                container.appendChild(
                    card
                );
            }
        );

    } catch (error) {

        console.error(
            "Post loading error:",
            error
        );


        container.innerHTML =
            `
            <p class="empty-post-message">
                Unable to load posts.
            </p>
            `;
    }
}


// ===============================
// CREATE POST CARD
// ===============================

function createPostCard(post) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "post-card";


    const title =
        post.title ||
        "Untitled Post";


    const content =
        post.content ||
        "";


    card.innerHTML =
        `
        <div class="post-header">

            <h3>
                ${escapeHtml(title)}
            </h3>

        </div>


        <p class="post-content">
            ${escapeHtml(content)}
        </p>


        <div class="post-actions">

            <button
                type="button"
                class="like-btn"
                data-post-id="${post.id}">

                ❤️ Like

            </button>


            <button
                type="button"
                class="comment-btn"
                data-post-id="${post.id}">

                💬 Comment

            </button>


            <button
                type="button"
                class="share-btn"
                data-post-id="${post.id}">

                🔗 Share

            </button>

        </div>


        <div
            class="post-counts"
            style="margin-top: 10px;">

            <span
                class="like-count"
                data-post-id="${post.id}">

                ❤️ 0

            </span>


            <span
                class="comment-count"
                data-post-id="${post.id}"
                style="margin-left: 15px;">

                💬 0

            </span>

        </div>


        <div
            class="comments-container"
            data-post-id="${post.id}"
            style="margin-top: 10px;">

        </div>
        `;


    const likeButton =
        card.querySelector(
            ".like-btn"
        );


    const commentButton =
        card.querySelector(
            ".comment-btn"
        );


    const shareButton =
        card.querySelector(
            ".share-btn"
        );


    if (likeButton) {

        likeButton.addEventListener(
            "click",
            function () {

                likePost(
                    post.id
                );
            }
        );
    }


    if (commentButton) {

        commentButton.addEventListener(
            "click",
            function () {

                commentPost(
                    post.id
                );
            }
        );
    }


    if (shareButton) {

        shareButton.addEventListener(
            "click",
            function () {

                sharePost(
                    post
                );
            }
        );
    }


    loadLikeCount(
        post.id
    );


    loadCommentCount(
        post.id
    );


    return card;
}


// ===============================
// LIKE POST
// ===============================

async function likePost(postId) {

    if (!currentUserId) {

        alert(
            "Please login first."
        );

        return;
    }


    try {

        const likeData = {

            postId:
                Number(postId),

            userId:
                Number(currentUserId)
        };


        const response =
            await fetch(
                `${API_BASE_URL}/api/likes`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            likeData
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Like backend error:",
                errorText
            );

            throw new Error(
                "Like failed"
            );
        }


        await loadLikeCount(
            postId
        );


        const likeButton =
            document.querySelector(
                `.like-btn[data-post-id="${postId}"]`
            );


        if (likeButton) {

            likeButton.textContent =
                "❤️ Liked";
        }


    } catch (error) {

        console.error(
            "Like error:",
            error
        );


        alert(
            "Unable to like post."
        );
    }
}


// ===============================
// LOAD LIKE COUNT
// ===============================

async function loadLikeCount(
    postId
) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/likes/post/${postId}/count`
            );


        if (!response.ok) {
            return;
        }


        const count =
            await response.json();


        const countElement =
            document.querySelector(
                `.like-count[data-post-id="${postId}"]`
            );


        if (countElement) {

            countElement.textContent =
                `❤️ ${count}`;
        }

    } catch (error) {

        console.error(
            "Like count error:",
            error
        );
    }
}


// ===============================
// COMMENT POST
// ===============================

async function commentPost(
    postId
) {

    if (!currentUserId) {

        alert(
            "Please login first."
        );

        return;
    }


    const commentText =
        prompt(
            "Enter your comment:"
        );


    if (
        commentText === null
    ) {
        return;
    }


    const content =
        commentText.trim();


    if (!content) {

        alert(
            "Please enter a comment."
        );

        return;
    }


    try {

        const commentData = {

            postId:
                Number(postId),

            userId:
                Number(currentUserId),

            content:
                content
        };


        const response =
            await fetch(
                `${API_BASE_URL}/api/comments`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            commentData
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Comment backend error:",
                errorText
            );

            throw new Error(
                "Comment failed"
            );
        }


        alert(
            "Comment added successfully! 💬"
        );


        await loadCommentCount(
            postId
        );


        await loadComments(
            postId
        );

    } catch (error) {

        console.error(
            "Comment error:",
            error
        );


        alert(
            "Unable to add comment."
        );
    }
}


// ===============================
// LOAD COMMENT COUNT
// ===============================

async function loadCommentCount(
    postId
) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/comments/post/${postId}`
            );


        if (!response.ok) {
            return;
        }


        const comments =
            await response.json();


        const countElement =
            document.querySelector(
                `.comment-count[data-post-id="${postId}"]`
            );


        if (countElement) {

            countElement.textContent =
                `💬 ${comments.length}`;
        }

    } catch (error) {

        console.error(
            "Comment count error:",
            error
        );
    }
}


// ===============================
// LOAD COMMENTS
// ===============================

async function loadComments(
    postId
) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/comments/post/${postId}`
            );


        if (!response.ok) {
            return;
        }


        const comments =
            await response.json();


        const container =
            document.querySelector(
                `.comments-container[data-post-id="${postId}"]`
            );


        if (!container) {
            return;
        }


        container.innerHTML =
            "";


        comments.forEach(
            function (comment) {

                const commentElement =
                    document.createElement(
                        "div"
                    );


                commentElement.className =
                    "comment-item";


                commentElement.innerHTML =
                    `
                    <p>
                        ${escapeHtml(
                            comment.content || ""
                        )}
                    </p>
                    `;


                container.appendChild(
                    commentElement
                );
            }
        );

    } catch (error) {

        console.error(
            "Load comments error:",
            error
        );
    }
}


// ===============================
// SHARE POST
// ===============================

async function sharePost(
    post
) {

    const shareUrl =
        `${window.location.origin}${window.location.pathname}?id=${communityId}`;


    try {

        if (
            navigator.share
        ) {

            await navigator.share({

                title:
                    post.title ||
                    "HobbyHub Post",

                text:
                    post.content ||
                    "Check out this post!",

                url:
                    shareUrl
            });

        } else {

            await navigator.clipboard.writeText(
                shareUrl
            );


            alert(
                "Community link copied! 🔗"
            );
        }

    } catch (error) {

        console.error(
            "Share error:",
            error
        );
    }
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value;

    return div.innerHTML;
}