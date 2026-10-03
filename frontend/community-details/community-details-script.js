const API_BASE_URL =
    " https://onlinehobbycommunity-1.onrender.com";

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const communityId =
    urlParams.get("id");

const currentUserId =
    localStorage.getItem("userId");

const currentUserRole =
    localStorage.getItem("userRole");


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
        setupViewPostsButton();
        setupViewAllPostsButton();
    }
);


// ======================================================
// LOAD COMMUNITY
// ======================================================

async function loadCommunity() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/communities/${encodeURIComponent(communityId)}`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load community"
            );
        }

        const community =
            await response.json();

        const communityName =
            document.getElementById(
                "communityName"
            );

        if (communityName) {
            communityName.textContent =
                community.name ||
                "Community";
        }

        const communityDescription =
            document.getElementById(
                "communityDescription"
            );

        if (communityDescription) {
            communityDescription.textContent =
                community.description ||
                "Welcome to this community.";
        }

        const aboutCommunity =
            document.getElementById(
                "aboutCommunity"
            );

        if (aboutCommunity) {
            aboutCommunity.textContent =
                community.description ||
                "Welcome to this community.";
        }

        const communityCategory =
            document.getElementById(
                "communityCategory"
            );

        if (communityCategory) {
            communityCategory.textContent =
                "🎨 " +
                (
                    community.category ||
                    "General"
                );
        }

        setupCommunityImage(
            community
        );

    } catch (error) {

        console.error(
            "Community loading error:",
            error
        );

        const communityName =
            document.getElementById(
                "communityName"
            );

        if (communityName) {
            communityName.textContent =
                "Unable to load community";
        }
    }
}


// ======================================================
// COMMUNITY IMAGE
// ======================================================

function setupCommunityImage(
    community
) {

    const icon =
        document.getElementById(
            "communityIcon"
        );

    if (!icon) {
        return;
    }

    if (
        community.imageUrl &&
        community.imageUrl.trim() !== ""
    ) {

        let imageUrl =
            community.imageUrl;

        if (imageUrl.startsWith("/")) {
            imageUrl =
                API_BASE_URL +
                imageUrl;
        }

        icon.innerHTML = `
            <img
                src="${imageUrl}"
                alt="Community"
                style="
                    width:100%;
                    height:100%;
                    object-fit:cover;
                    border-radius:inherit;
                    display:block;
                "
            >
        `;

    } else {

        icon.textContent =
            "🎨";
    }
}


// ======================================================
// MEMBER COUNT
// ======================================================

async function loadMemberCount() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/communities/${encodeURIComponent(communityId)}/members/count`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load member count"
            );
        }

        const count =
            await response.json();

        const memberCount =
            document.getElementById(
                "memberCount"
            );

        if (memberCount) {

            memberCount.textContent =
                `👥 ${count} Members`;
        }

    } catch (error) {

        console.error(
            "Member count error:",
            error
        );
    }
}


// ======================================================
// CHECK MEMBERSHIP
// ======================================================

async function checkMembership() {

    const joinButton =
        document.getElementById(
            "joinButton"
        );

    if (!joinButton) {
        return;
    }

    if (!currentUserId) {

        joinButton.textContent =
            "Login to Join";

        joinButton.disabled =
            false;

        joinButton.onclick =
            function () {

                window.location.href =
                    "../login/login.html";
            };

        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/community-members/check?communityId=${encodeURIComponent(communityId)}&userId=${encodeURIComponent(currentUserId)}`
            );

        if (!response.ok) {

            console.error(
                "Membership check failed:",
                response.status
            );

            setupJoinButton();

            return;
        }

        const isMember =
            await response.json();

        if (isMember) {

            joinButton.textContent =
                "✓ Joined";

            joinButton.disabled =
                true;

            joinButton.onclick =
                null;

        } else {

            joinButton.textContent =
                "Join Community";

            joinButton.disabled =
                false;

            setupJoinButton();
        }

    } catch (error) {

        console.error(
            "Membership check error:",
            error
        );

        setupJoinButton();
    }
}


// ======================================================
// JOIN COMMUNITY
// ======================================================

function setupJoinButton() {

    const joinButton =
        document.getElementById(
            "joinButton"
        );

    if (!joinButton) {
        return;
    }

    joinButton.disabled =
        false;

    joinButton.onclick =
        async function () {

            if (!currentUserId) {

                alert(
                    "Please login first."
                );

                return;
            }

            if (!communityId) {

                alert(
                    "Community not found."
                );

                return;
            }

            joinButton.disabled =
                true;

            joinButton.textContent =
                "Joining...";

            try {

                const joinUrl =
                    `${API_BASE_URL}/api/community-members/join?communityId=${encodeURIComponent(communityId)}&userId=${encodeURIComponent(currentUserId)}`;

                console.log(
                    "Joining community:",
                    joinUrl
                );

                const response =
                    await fetch(
                        joinUrl,
                        {
                            method: "POST"
                        }
                    );

                const responseText =
                    await response.text();

                console.log(
                    "Join response status:",
                    response.status
                );

                console.log(
                    "Join response:",
                    responseText
                );

                if (!response.ok) {

                    throw new Error(
                        responseText ||
                        `Unable to join community. Status: ${response.status}`
                    );
                }

                joinButton.textContent =
                    "✓ Joined";

                joinButton.disabled =
                    true;

                alert(
                    "Joined community successfully! 🎉"
                );

                await loadMemberCount();

            } catch (error) {

                console.error(
                    "Join community error:",
                    error
                );

                joinButton.textContent =
                    "Join Community";

                joinButton.disabled =
                    false;

                alert(
                    error.message ||
                    "Unable to join community."
                );
            }
        };
}


// ======================================================
// CREATE POST BUTTON
// ======================================================

function setupCreatePostButton() {

    const button =
        document.getElementById(
            "createPostButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (!currentUserId) {

                alert(
                    "Please login first."
                );

                return;
            }

            window.location.href =
                `../create-post/create-post.html?communityId=${encodeURIComponent(communityId)}`;
        }
    );
}


// ======================================================
// VIEW POSTS BUTTON
// ======================================================

function setupViewPostsButton() {

    const button =
        document.getElementById(
            "viewPostsButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                `../posts/posts.html?communityId=${encodeURIComponent(communityId)}`;
        }
    );
}


// ======================================================
// VIEW ALL POSTS BUTTON
// ======================================================

function setupViewAllPostsButton() {

    const button =
        document.getElementById(
            "viewAllPostsButton"
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                `../posts/posts.html?communityId=${encodeURIComponent(communityId)}`;
        }
    );
}


// ======================================================
// LOAD RECENT POSTS
// ======================================================

async function loadRecentPosts() {

    const container =
        document.getElementById(
            "recentPostsContainer"
        );

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/posts/community/${encodeURIComponent(communityId)}`
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

            container.innerHTML = `
                <p class="empty-post-message">
                    No posts yet. Be the first to create a post!
                </p>
            `;

            return;
        }

        posts
            .slice(0, 5)
            .forEach(
                function (post) {

                    createPostCard(
                        post,
                        container
                    );
                }
            );

    } catch (error) {

        console.error(
            "Posts loading error:",
            error
        );

        container.innerHTML = `
            <p class="empty-post-message">
                Unable to load posts.
            </p>
        `;
    }
}


// ======================================================
// CREATE POST CARD
// ======================================================

function createPostCard(
    post,
    container
) {

    const card =
        document.createElement(
            "div"
        );

    card.className =
        "post-card";

    const authorName =
        post.userName ||
        "User";

    let imageHtml =
        "";

    if (
        post.imageUrl &&
        post.imageUrl.trim() !== ""
    ) {

        let imageUrl =
            post.imageUrl;

        if (imageUrl.startsWith("/")) {
            imageUrl =
                API_BASE_URL +
                imageUrl;
        }

        imageHtml = `
            <div
                class="post-image-wrapper"
                style="
                    width:100%;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    background:#f5f5f5;
                    border-radius:12px;
                    overflow:hidden;
                "
            >
                <img
                    src="${imageUrl}"
                    alt="Post image"
                    style="
                        width:100%;
                        max-height:400px;
                        object-fit:contain;
                        display:block;
                    "
                >
            </div>
        `;
    }

    card.innerHTML = `
            <div class="post-header">

            <div
                class="post-author"
                onclick="openUserProfile(${Number(post.userId)})"
                style="cursor:pointer;"
            >
                👤 ${escapeHtml(authorName)}
            </div>

            <div class="post-category">
                ${escapeHtml(
                    post.category ||
                    "General"
                )}
            </div>

        </div>

        <div class="post-content">

            <h3>
                ${escapeHtml(
                    post.title ||
                    "Untitled Post"
                )}
            </h3>

            <p>
                ${escapeHtml(
                    post.content ||
                    ""
                )}
            </p>

            ${imageHtml}

        </div>

        <div class="post-actions">

            <button
                class="like-btn"
                data-post-id="${post.id}"
                type="button"
            >
                ❤️ Like
            </button>

            <span
                class="like-count"
                id="like-count-${post.id}"
            >
                0
            </span>

            <button
                class="comment-btn"
                data-post-id="${post.id}"
                type="button"
            >
                💬 Comment
            </button>

            <button
                class="share-btn"
                data-post-id="${post.id}"
                type="button"
            >
                🔗 Share
            </button>

            <button
                class="report-btn"
                data-post-id="${post.id}"
                type="button"
            >
                🚩 Report
            </button>

            <button
                class="view-post-btn"
                data-post-id="${post.id}"
                type="button"
            >
                👁 View Post
            </button>

        </div>

        <div
            class="comments-section"
            id="comments-${post.id}"
            style="display:none;"
        >

            <div
                class="comments-list"
                id="comments-list-${post.id}"
            ></div>

            <div class="comment-input-area">

                <input
                    type="text"
                    id="comment-input-${post.id}"
                    placeholder="Write a comment..."
                >

                <button
                    type="button"
                    onclick="addComment(${post.id})"
                >
                    Send
                </button>

            </div>

        </div>
    `;

    container.appendChild(
        card
    );

    loadLikeCount(
        post.id
    );

    loadUserLikeStatus(
        post.id
    );

    const likeButton =
        card.querySelector(
            ".like-btn"
        );

    if (likeButton) {

        likeButton.addEventListener(
            "click",
            function () {

                toggleLike(
                    post.id,
                    likeButton
                );
            }
        );
    }

    const commentButton =
        card.querySelector(
            ".comment-btn"
        );

    if (commentButton) {

        commentButton.addEventListener(
            "click",
            function () {

                toggleComments(
                    post.id
                );
            }
        );
    }

    const shareButton =
        card.querySelector(
            ".share-btn"
        );

    if (shareButton) {

        shareButton.addEventListener(
            "click",
            function () {

                sharePost(
                    post.id
                );
            }
        );
    }

    const reportButton =
        card.querySelector(
            ".report-btn"
        );

    if (reportButton) {

        reportButton.addEventListener(
            "click",
            function () {

                openReportForm(
                    post
                );
            }
        );
    }

    const viewButton =
        card.querySelector(
            ".view-post-btn"
        );

    if (viewButton) {

        viewButton.addEventListener(
            "click",
            function () {

                viewPost(
                    post.id
                );
            }
        );
    }
}


// ======================================================
// LIKE COUNT
// ======================================================

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

        const element =
            document.getElementById(
                `like-count-${postId}`
            );

        if (element) {
            element.textContent =
                count;
        }

    } catch (error) {

        console.error(
            "Like count error:",
            error
        );
    }
}


// ======================================================
// USER LIKE STATUS
// ======================================================

async function loadUserLikeStatus(
    postId
) {

    const button =
        document.querySelector(
            `.like-btn[data-post-id="${postId}"]`
        );

    if (!button) {
        return;
    }

    if (!currentUserId) {

        button.textContent =
            "❤️ Like";

        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/likes`
            );

        if (!response.ok) {
            return;
        }

        const likes =
            await response.json();

        const liked =
            likes.some(
                function (like) {

                    return (
                        Number(like.postId) ===
                            Number(postId) &&
                        Number(like.userId) ===
                            Number(currentUserId)
                    );
                }
            );

        if (liked) {

            button.textContent =
                "❤️ Liked";

            button.classList.add(
                "liked"
            );

        } else {

            button.textContent =
                "❤️ Like";

            button.classList.remove(
                "liked"
            );
        }

    } catch (error) {

        console.error(
            "Like status error:",
            error
        );
    }
}


// ======================================================
// LIKE / UNLIKE
// ======================================================

async function toggleLike(
    postId,
    button
) {

    if (!currentUserId) {

        alert(
            "Please login to like posts."
        );

        return;
    }

    button.disabled =
        true;

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/likes`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to check likes"
            );
        }

        const likes =
            await response.json();

        const userLikes =
            likes.filter(
                function (like) {

                    return (
                        Number(like.postId) ===
                            Number(postId) &&
                        Number(like.userId) ===
                            Number(currentUserId)
                    );
                }
            );

        if (userLikes.length > 0) {

            for (
                const like
                of userLikes
            ) {

                await fetch(
                    `${API_BASE_URL}/api/likes/${like.id}`,
                    {
                        method: "DELETE"
                    }
                );
            }

        } else {

            const likeData = {

                postId:
                    Number(postId),

                userId:
                    Number(currentUserId)
            };

            const likeResponse =
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

            if (!likeResponse.ok) {

                throw new Error(
                    "Unable to like post"
                );
            }
        }

        await loadLikeCount(
            postId
        );

        await loadUserLikeStatus(
            postId
        );

    } catch (error) {

        console.error(
            "Like error:",
            error
        );

        alert(
            "Unable to update like."
        );

    } finally {

        button.disabled =
            false;
    }
}


// ======================================================
// COMMENTS
// ======================================================

async function toggleComments(
    postId
) {

    const section =
        document.getElementById(
            `comments-${postId}`
        );

    if (!section) {
        return;
    }

    if (
        section.style.display ===
        "none"
    ) {

        section.style.display =
            "block";

        await loadComments(
            postId
        );

    } else {

        section.style.display =
            "none";
    }
}


// ======================================================
// LOAD COMMENTS
// ======================================================

async function loadComments(
    postId
) {

    const list =
        document.getElementById(
            `comments-list-${postId}`
        );

    if (!list) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/comments/post/${postId}`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load comments"
            );
        }

        const comments =
            await response.json();

        list.innerHTML =
            "";

        if (
            !comments ||
            comments.length === 0
        ) {

            list.innerHTML = `
                <p>
                    No comments yet.
                </p>
            `;

            return;
        }

        for (const comment of comments) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "comment-item";

            let commenterName =
                "User";

            try {

                const userResponse =
                    await fetch(
                        `${API_BASE_URL}/api/users/${encodeURIComponent(comment.userId)}`
                    );

                if (userResponse.ok) {

                    const commenter =
                        await userResponse.json();

                    commenterName =
                        commenter.name ||
                        "User";
                }

            } catch (error) {

                console.error(
                    "Commenter loading error:",
                    error
                );
            }

            div.innerHTML = `
                <strong
                    onclick="openUserProfile(${Number(comment.userId)})"
                    style="cursor:pointer;"
                >
                    ${escapeHtml(commenterName)}
                </strong>

                <p>
                    ${escapeHtml(
                        comment.content ||
                        ""
                    )}
                </p>
            `;

            list.appendChild(
                div
            );
        }

    } catch (error) {

        console.error(
            "Comments error:",
            error
        );

        list.innerHTML = `
            <p>
                Unable to load comments.
            </p>
        `;
    }
}


// ======================================================
// ADD COMMENT
// ======================================================

async function addComment(
    postId
) {

    if (!currentUserId) {

        alert(
            "Please login to comment."
        );

        return;
    }

    const input =
        document.getElementById(
            `comment-input-${postId}`
        );

    if (!input) {
        return;
    }

    const content =
        input.value.trim();

    if (!content) {

        alert(
            "Please write a comment."
        );
                return;
    }

    const commentData = {

        postId:
            Number(postId),

        userId:
            Number(currentUserId),

        content:
            content
    };

    try {

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

            throw new Error(
                "Unable to add comment"
            );
        }

        input.value =
            "";

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


// ======================================================
// VIEW POST
// ======================================================

function viewPost(
    postId
) {

    window.location.href =
        `../posts/posts.html?communityId=${encodeURIComponent(communityId)}&postId=${encodeURIComponent(postId)}`;
}


// ======================================================
// SHARE POST
// ======================================================

async function sharePost(
    postId
) {

    const shareUrl =
        `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(communityId)}&postId=${encodeURIComponent(postId)}`;

    try {

        if (navigator.share) {

            await navigator.share({

                title:
                    "HobbyHub Post",

                text:
                    "Check out this post on HobbyHub!",

                url:
                    shareUrl
            });

        } else {

            await navigator.clipboard.writeText(
                shareUrl
            );

            alert(
                "Post link copied!"
            );
        }

    } catch (error) {

        console.error(
            "Share error:",
            error
        );
    }
}


// ======================================================
// DELETE BUTTON
// ======================================================

function setupDeleteButton() {

    const button =
        document.getElementById(
            "deleteCommunityButton"
        );

    if (!button) {
        return;
    }

    checkCommunityOwner();
}


// ======================================================
// CHECK COMMUNITY OWNER
// ======================================================

async function checkCommunityOwner() {

    const button =
        document.getElementById(
            "deleteCommunityButton"
        );

    if (!button) {
        return;
    }

    if (!currentUserId) {

        button.style.display =
            "none";

        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/communities/${encodeURIComponent(communityId)}`
            );

        if (!response.ok) {
            return;
        }

        const community =
            await response.json();

        const isAdmin =
            currentUserRole &&
            currentUserRole.toUpperCase() ===
                "ADMIN";

        const isCreator =
            community.createdBy &&
            Number(community.createdBy) ===
                Number(currentUserId);

        if (
            isAdmin ||
            isCreator
        ) {

            button.style.display =
                "inline-block";

            button.onclick =
                deleteCommunity;

        } else {

            button.style.display =
                "none";
        }

    } catch (error) {

        console.error(
            "Delete permission error:",
            error
        );
    }
}


// ======================================================
// DELETE COMMUNITY
// ======================================================

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

    const deleteUrl =
        `${API_BASE_URL}/api/communities/${encodeURIComponent(communityId)}?userId=${encodeURIComponent(currentUserId)}&role=${encodeURIComponent(currentUserRole || "")}`;

    try {

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
                "Delete error:",
                errorText
            );

            alert(
                "Unable to delete community."
            );

            return;
        }

        alert(
            "Community deleted successfully."
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


// ======================================================
// REPORT FORM
// ======================================================

function openReportForm(
    post
) {

    if (!currentUserId) {

        alert(
            "Please login to report a post."
        );

        return;
    }

    const existingModal =
        document.getElementById(
            "reportModal"
        );

    if (existingModal) {
        existingModal.remove();
    }

    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "reportModal";

    modal.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.55);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:9999;
        padding:20px;
        box-sizing:border-box;
    `;

    modal.innerHTML = `

        <div
            style="
                width:100%;
                max-width:500px;
                background:white;
                border-radius:18px;
                padding:25px;
                box-shadow:0 20px 50px rgba(0,0,0,0.25);
                box-sizing:border-box;
            "
        >

            <h2
                style="
                    margin-top:0;
                    color:#4b2aad;
                "
            >
                Report Post
            </h2>

            <p
                style="
                    color:#666;
                    margin-bottom:20px;
                "
            >
                Why are you reporting this post?
            </p>

            <select
                id="reportReason"
                style="
                    width:100%;
                    padding:12px;
                    border:1px solid #ddd;
                    border-radius:10px;
                    margin-bottom:15px;
                    box-sizing:border-box;
                "
            >

                <option value="">
                    Select a reason
                </option>

                <option value="Spam">
                    Spam
                </option>

                <option value="Harassment">
                    Harassment
                </option>

                <option value="Inappropriate Content">
                    Inappropriate Content
                </option>

                <option value="Hate Speech">
                    Hate Speech
                </option>

                <option value="Other">
                    Other
                </option>

            </select>

            <textarea
                id="reportDescription"
                placeholder="Describe the problem..."
                rows="4"
                style="
                    width:100%;
                    box-sizing:border-box;
                    padding:12px;
                    border:1px solid #ddd;
                    border-radius:10px;
                    resize:vertical;
                    margin-bottom:18px;
                "
            ></textarea>

            <div
                style="
                    display:flex;
                    gap:10px;
                    justify-content:flex-end;
                "
            >

                <button
                    type="button"
                    id="cancelReportButton"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    id="submitReportButton"
                >
                    Submit Report
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(
        modal
    );

    document.getElementById(
        "cancelReportButton"
    ).onclick =
        function () {
            modal.remove();
        };

    document.getElementById(
        "submitReportButton"
    ).onclick =
        function () {

            submitReport(
                post.id,
                modal
            );
        };
}


// ======================================================
// SUBMIT REPORT
// ======================================================

async function submitReport(
    postId,
    modal
) {

    const reasonElement =
        document.getElementById(
            "reportReason"
        );

    const descriptionElement =
        document.getElementById(
            "reportDescription"
        );

    const submitButton =
        document.getElementById(
            "submitReportButton"
        );

    if (
        !reasonElement ||
        !descriptionElement ||
        !submitButton
    ) {
        return;
    }

    const reason =
        reasonElement.value;

    const description =
        descriptionElement.value.trim();

    if (!reason) {

        alert(
            "Please select a reason."
        );

        return;
    }

    if (!description) {

        alert(
            "Please describe the problem."
        );

        return;
    }

    submitButton.disabled =
        true;

    submitButton.textContent =
        "Submitting...";

    const reportData = {

        reporterId:
            Number(currentUserId),

        postId:
            Number(postId),

        reason:
            reason,

        description:
            description,

        status:
            "PENDING"
    };

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/reports`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            reportData
                        )
                }
            );

        if (!response.ok) {

            throw new Error(
                "Unable to submit report."
            );
        }

        modal.remove();

        alert(
            "Report submitted successfully. Admin will review it."
        );

    } catch (error) {

        console.error(
            "Report submission error:",
            error
        );

        submitButton.disabled =
            false;

        submitButton.textContent =
            "Submit Report";

        alert(
            "Unable to submit report. Please try again."
        );
    }
}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ======================================================
// OPEN USER PROFILE
// ======================================================

function openUserProfile(userId) {

    if (!userId) {

        console.error(
            "User ID is missing."
        );

        return;
    }

    const targetUserId =
        String(userId).trim();

    if (!targetUserId) {
        return;
    }

    sessionStorage.setItem(
        "selectedUserId",
        targetUserId
    );

    window.location.href =
        `../profile/profile.html?userId=${encodeURIComponent(targetUserId)}`;
}