const API_BASE_URL = "https://onlinehobbycommunity-1.onrender.com";

const urlParams =
    new URLSearchParams(window.location.search);

const selectedCommunityId =
    urlParams.get("communityId");

const selectedPostId =
    urlParams.get("postId");

const currentUserId =
    localStorage.getItem("userId");

let allPosts = [];

let usersCache = {};


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCommunityInfo();

        loadUsers();

        loadPosts();

    }
);


// ======================================================
// LOAD USERS
// ======================================================

async function loadUsers() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users`
            );

        if (!response.ok) {
            return;
        }

        const users =
            await response.json();

        if (!Array.isArray(users)) {
            return;
        }

        users.forEach(
            function (user) {

                usersCache[
                    Number(user.id)
                ] =
                    user.name ||
                    "User";

            }
        );

        refreshCommentUserNames();

    } catch (error) {

        console.error(
            "Users loading error:",
            error
        );
    }
}


// ======================================================
// GET USER NAME
// ======================================================

function getUserName(userId) {

    const id =
        Number(userId);

    return (
        usersCache[id] ||
        "User"
    );
}


// ======================================================
// REFRESH COMMENT USER NAMES
// ======================================================

function refreshCommentUserNames() {

    const commentUsers =
        document.querySelectorAll(
            ".comment-user"
        );

    commentUsers.forEach(
        function (element) {

            const userId =
                element.dataset.userId;

            element.textContent =
                getUserName(userId);

        }
    );
}


// ======================================================
// LOAD COMMUNITY
// ======================================================

async function loadCommunityInfo() {

    if (!selectedCommunityId) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/communities/${encodeURIComponent(
                    selectedCommunityId
                )}`
            );

        if (!response.ok) {
            return;
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

        if (nameElement) {

            nameElement.textContent =
                community.name ||
                "Community Posts";

        }

        if (descriptionElement) {

            descriptionElement.textContent =
                community.description ||
                "Explore posts shared by community members.";

        }

    } catch (error) {

        console.error(
            "Community loading error:",
            error
        );
    }
}


// ======================================================
// LOAD POSTS
// ======================================================

async function loadPosts() {

    const container =
        document.getElementById(
            "postsContainer"
        );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <p>Loading posts...</p>
    `;

    try {

        let url =
            `${API_BASE_URL}/api/posts`;

        if (selectedCommunityId) {

            url =
                `${API_BASE_URL}/api/posts/community/${encodeURIComponent(
                    selectedCommunityId
                )}`;

        }

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Unable to load posts"
            );
        }

        allPosts =
            await response.json();

        if (!Array.isArray(allPosts)) {

            allPosts = [];

        }

        allPosts.sort(
            function (a, b) {

                return (
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
                );

            }
        );

        container.innerHTML = "";

        if (allPosts.length === 0) {

            container.innerHTML = `
                <p>
                    No posts available yet.
                </p>
            `;

            return;
        }

        allPosts.forEach(
            function (post) {

                createPostCard(
                    post,
                    container
                );

            }
        );

        // IMPORTANT
        // Start all carousel arrow/dot/touch events
        initializeAllCarousels();

        if (selectedPostId) {

            setTimeout(
                function () {

                    openSelectedPost(
                        selectedPostId
                    );

                },
                300
            );
        }

    } catch (error) {

        console.error(
            "Post loading error:",
            error
        );

        container.innerHTML = `
            <p>
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
            "article"
        );

    card.className =
        "post-card";

    card.dataset.postId =
        post.id;

    const title =
        post.title ||
        "Untitled Post";

    const content =
        post.content ||
        "";

    const authorName =
        post.userName ||
        getUserName(
            post.userId
        );


    // ==================================================
    // GET ALL IMAGES
    // ==================================================

    let imageUrls = [];

    if (
        Array.isArray(
            post.imageUrls
        )
    ) {

        imageUrls =
            post.imageUrls.filter(
                function (url) {

                    return (
                        typeof url === "string" &&
                        url.trim() !== ""
                    );

                }
            );
    }


    // Old single-image support
    if (
        imageUrls.length === 0 &&
        post.imageUrl &&
        post.imageUrl.trim() !== ""
    ) {

        imageUrls = [
            post.imageUrl
        ];
    }


    const imageHTML =
        createImageCarousel(
            post.id,
            title,
            imageUrls
        );


    card.innerHTML = `

        <div
            class="post-author"
            style="
                display:flex;
                align-items:center;
                gap:10px;
                margin-bottom:10px;
            "
        >

            <div
                style="
                    width:40px;
                    height:40px;
                    min-width:40px;
                    border-radius:50%;
                    background:#8a58d0;
                    color:white;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-weight:bold;
                "
            >
                ${escapeHtml(
                    authorName
                        .charAt(0)
                        .toUpperCase()
                )}
            </div>

            <div>

                <strong>
                    ${escapeHtml(
                        authorName
                    )}
                </strong>

                <div
                    style="
                        font-size:12px;
                        color:#8b7b94;
                    "
                >
                    ${formatDate(
                        post.createdAt
                    )}
                </div>

            </div>

        </div>


        <h2>
            ${escapeHtml(
                title
            )}
        </h2>


        <div
            style="
                font-size:13px;
                color:#7953a8;
                margin:6px 0;
            "
        >
            ${escapeHtml(
                post.category ||
                "General"
            )}
        </div>


        ${imageHTML}


        <p class="post-content">
            ${escapeHtml(
                content
            )}
        </p>


        <div
            class="post-actions"
            style="
                display:flex;
                gap:8px;
                flex-wrap:wrap;
                margin-top:15px;
            "
        >

            <button
                type="button"
                class="like-btn"
                data-post-id="${post.id}"
            >
                ❤️ Like
            </button>


            <span
                class="like-count"
                data-post-id="${post.id}"
            >
                ❤️ 0
            </span>


            <button
                type="button"
                class="comment-btn"
                data-post-id="${post.id}"
            >
                💬 Comment
            </button>


            <button
                type="button"
                class="share-btn"
                data-post-id="${post.id}"
            >
                🔗 Share
            </button>


            <button
                type="button"
                class="view-post-btn"
                data-post-id="${post.id}"
            >
                👁️ View Post
            </button>


            ${
                currentUserId &&
                Number(post.userId) ===
                    Number(currentUserId)
                ? `
                    <button
                        type="button"
                        class="delete-post-btn"
                        data-post-id="${post.id}"
                    >
                        🗑️ Delete
                    </button>
                `
                : ""
            }

        </div>


        <div
            class="comments-container"
            data-post-id="${post.id}"
            style="
                display:none;
                margin-top:15px;
            "
        >
        </div>

    `;


    container.appendChild(
        card
    );


    // ==================================================
    // LIKE
    // ==================================================

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


    // ==================================================
    // COMMENT
    // ==================================================

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


    // ==================================================
    // SHARE
    // ==================================================

    const shareButton =
        card.querySelector(
            ".share-btn"
        );

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


    // ==================================================
    // VIEW POST
    // ==================================================

    const viewButton =
        card.querySelector(
            ".view-post-btn"
        );

    if (viewButton) {

        viewButton.addEventListener(
            "click",
            function () {

                openSelectedPost(
                    post.id
                );

            }
        );
    }


    // ==================================================
    // DELETE
    // ==================================================

    const deleteButton =
        card.querySelector(
            ".delete-post-btn"
        );

    if (deleteButton) {

        deleteButton.addEventListener(
            "click",
            function () {

                deletePost(
                    post.id
                );

            }
        );
    }


    loadLikeCount(
        post.id
    );

    loadUserLikeStatus(
        post.id
    );
}


// ======================================================
// CREATE IMAGE CAROUSEL
// ======================================================

function createImageCarousel(
    postId,
    title,
    imageUrls
) {

    if (
        !imageUrls ||
        imageUrls.length === 0
    ) {

        return "";
    }


    // ==================================================
    // SINGLE IMAGE
    // ==================================================

    if (imageUrls.length === 1) {

        return `

            <div
                class="post-image-wrapper"
                style="
                    width:100%;
                    margin:15px 0;
                    background:#f5f1f8;
                    border-radius:14px;
                    overflow:hidden;
                    display:flex;
                    justify-content:center;
                    align-items:center;
                "
            >

                <img
                    src="${getImageUrl(
                        imageUrls[0]
                    )}"
                    alt="${escapeHtml(
                        title
                    )}"
                    style="
                        width:100%;
                        height:auto;
                        max-height:400px;
                        object-fit:contain;
                        display:block;
                    "
                >

            </div>

        `;
    }


    // ==================================================
    // MULTIPLE IMAGES
    // ==================================================

    const slides =
        imageUrls
            .map(
                function (
                    imageUrl,
                    index
                ) {

                    return `

                        <div
                            class="carousel-slide"
                            data-index="${index}"
                            style="
                                min-width:100%;
                                width:100%;
                                flex:0 0 100%;
                                display:flex;
                                justify-content:center;
                                align-items:center;
                            "
                        >

                            <img
                                src="${getImageUrl(
                                    imageUrl
                                )}"
                                alt="${escapeHtml(
                                    title
                                )} - Image ${index + 1}"
                                draggable="false"
                                style="
                                    width:100%;
                                    height:auto;
                                    max-height:400px;
                                    object-fit:contain;
                                    display:block;
                                    user-select:none;
                                    pointer-events:none;
                                "
                            >

                        </div>

                    `;

                }
            )
            .join("");


    const dots =
        imageUrls
            .map(
                function (
                    imageUrl,
                    index
                ) {

                    return `

                        <button
                            type="button"
                            class="carousel-dot ${
                                index === 0
                                    ? "active"
                                    : ""
                            }"
                            data-index="${index}"
                            aria-label="Image ${index + 1}"
                            style="
                                width:9px;
                                height:9px;
                                padding:0;
                                border:none;
                                border-radius:50%;
                                background:${
                                    index === 0
                                        ? "#7953a8"
                                        : "#d8cde3"
                                };
                                cursor:pointer;
                            "
                        ></button>

                    `;

                }
            )
            .join("");


    return `

        <div
            class="post-carousel"
            data-carousel-post-id="${postId}"
            style="
                position:relative;
                width:100%;
                margin:15px 0;
                background:#f5f1f8;
                border-radius:14px;
                overflow:hidden;
                touch-action:pan-y;
            "
        >

            <div
                class="carousel-track"
                style="
                    display:flex;
                    width:100%;
                    transition:transform 0.3s ease;
                    will-change:transform;
                "
            >

                ${slides}

            </div>


            <!-- PREVIOUS -->

            <button
                type="button"
                class="carousel-prev"
                aria-label="Previous image"
                style="
                    position:absolute;
                    left:10px;
                    top:50%;
                    transform:translateY(-50%);
                    width:40px;
                    height:40px;
                    border:none;
                    border-radius:50%;
                    background:rgba(0,0,0,0.55);
                    color:white;
                    font-size:25px;
                    line-height:40px;
                    padding:0;
                    cursor:pointer;
                    z-index:10;
                "
            >
                ‹
            </button>


            <!-- NEXT -->

            <button
                type="button"
                class="carousel-next"
                aria-label="Next image"
                style="
                    position:absolute;
                    right:10px;
                    top:50%;
                    transform:translateY(-50%);
                    width:40px;
                    height:40px;
                    border:none;
                    border-radius:50%;
                    background:rgba(0,0,0,0.55);
                    color:white;
                    font-size:25px;
                    line-height:40px;
                    padding:0;
                    cursor:pointer;
                    z-index:10;
                "
            >
                ›
            </button>


            <!-- DOTS -->

            <div
                class="carousel-dots"
                style="
                    position:absolute;
                    left:0;
                    right:0;
                    bottom:10px;
                    display:flex;
                    justify-content:center;
                    gap:7px;
                    z-index:10;
                "
            >

                ${dots}

            </div>


            <!-- COUNT -->

            <div
                class="carousel-count"
                style="
                    position:absolute;
                    top:10px;
                    right:10px;
                    background:rgba(0,0,0,0.6);
                    color:white;
                    padding:4px 9px;
                    border-radius:12px;
                    font-size:12px;
                    z-index:10;
                "
            >
                1 / ${imageUrls.length}
            </div>

        </div>

    `;
}


// ======================================================
// INITIALIZE ONE CAROUSEL
// ======================================================

function initializeCarousel(
    carousel
) {

    if (
        !carousel ||
        carousel.dataset.initialized === "true"
    ) {
        return;
    }


    const track =
        carousel.querySelector(
            ".carousel-track"
        );

    const slides =
        carousel.querySelectorAll(
            ".carousel-slide"
        );

    const prevButton =
        carousel.querySelector(
            ".carousel-prev"
        );

    const nextButton =
        carousel.querySelector(
            ".carousel-next"
        );

    const dots =
        carousel.querySelectorAll(
            ".carousel-dot"
        );

    const count =
        carousel.querySelector(
            ".carousel-count"
        );


    if (
        !track ||
        slides.length <= 1
    ) {
        return;
    }


    carousel.dataset.initialized =
        "true";


    let currentIndex = 0;

    let startX = 0;

    let currentX = 0;

    let isDragging = false;


    // ==================================================
    // UPDATE
    // ==================================================

    function updateCarousel() {

        track.style.transform =
            `translate3d(-${currentIndex * 100}%, 0, 0)`;


        dots.forEach(
            function (
                dot,
                index
            ) {

                dot.style.background =
                    index === currentIndex
                        ? "#7953a8"
                        : "#d8cde3";

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            }
        );


        if (count) {

            count.textContent =
                `${currentIndex + 1} / ${slides.length}`;

        }

    }


    // ==================================================
    // NEXT
    // ==================================================

    function showNext() {

        currentIndex =
            (
                currentIndex + 1
            ) %
            slides.length;

        updateCarousel();

    }


    // ==================================================
    // PREVIOUS
    // ==================================================

    function showPrevious() {

        currentIndex =
            (
                currentIndex -
                1 +
                slides.length
            ) %
            slides.length;

        updateCarousel();

    }


    // ==================================================
    // ARROW EVENTS
    // ==================================================

    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                showPrevious();

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                showNext();

            }
        );

    }


    // ==================================================
    // DOT EVENTS
    // ==================================================

    dots.forEach(
        function (
            dot,
            index
        ) {

            dot.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();

                    currentIndex =
                        index;

                    updateCarousel();

                }
            );

        }
    );


    // ==================================================
    // TOUCH SWIPE
    // ==================================================

    carousel.addEventListener(
        "touchstart",
        function (event) {

            if (
                !event.touches ||
                !event.touches[0]
            ) {
                return;
            }

            startX =
                event.touches[0].clientX;

            currentX =
                startX;

            isDragging =
                true;

        },
        {
            passive: true
        }
    );


    carousel.addEventListener(
        "touchmove",
        function (event) {

            if (
                !isDragging ||
                !event.touches ||
                !event.touches[0]
            ) {
                return;
            }

            currentX =
                event.touches[0].clientX;

        },
        {
            passive: true
        }
    );


    carousel.addEventListener(
        "touchend",
        function () {

            if (!isDragging) {
                return;
            }

            const difference =
                startX -
                currentX;

            if (
                Math.abs(difference) >=
                50
            ) {

                if (difference > 0) {

                    showNext();

                } else {

                    showPrevious();

                }

            }

            isDragging =
                false;

        }
    );


    // ==================================================
    // MOUSE DRAG
    // ==================================================

    carousel.addEventListener(
        "mousedown",
        function (event) {

            if (
                event.target.closest(
                    ".carousel-prev"
                ) ||
                event.target.closest(
                    ".carousel-next"
                ) ||
                event.target.closest(
                    ".carousel-dot"
                )
            ) {
                return;
            }

            startX =
                event.clientX;

            currentX =
                startX;

            isDragging =
                true;

        }
    );


    carousel.addEventListener(
        "mousemove",
        function (event) {

            if (!isDragging) {
                return;
            }

            currentX =
                event.clientX;

        }
    );


    carousel.addEventListener(
        "mouseup",
        function () {

            if (!isDragging) {
                return;
            }

            const difference =
                startX -
                currentX;

            if (
                Math.abs(difference) >=
                50
            ) {

                if (difference > 0) {

                    showNext();

                } else {

                    showPrevious();

                }

            }

            isDragging =
                false;

        }
    );


    carousel.addEventListener(
        "mouseleave",
        function () {

            isDragging =
                false;

        }
    );


    updateCarousel();
}


// ======================================================
// INITIALIZE ALL CAROUSELS
// ======================================================

function initializeAllCarousels() {

    const carousels =
        document.querySelectorAll(
            ".post-carousel"
        );

    carousels.forEach(
        function (carousel) {

            initializeCarousel(
                carousel
            );

        }
    );
}


// ======================================================
// VIEW POST
// ======================================================

function openSelectedPost(
    postId
) {

    const card =
        document.querySelector(
            `.post-card[data-post-id="${postId}"]`
        );

    if (!card) {
        return;
    }

    document
        .querySelectorAll(
            ".selected-post"
        )
        .forEach(
            function (element) {

                element.classList.remove(
                    "selected-post"
                );

            }
        );

    card.classList.add(
        "selected-post"
    );

    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    card.style.boxShadow =
        "0 0 0 3px #b993dc";

    setTimeout(
        function () {

            card.style.boxShadow =
                "";

        },
        1800
    );
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
            "Please login first."
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
                "Unable to load likes"
            );
        }

        const likes =
            await response.json();

        const userLikes =
            likes.filter(
                function (like) {

                    return (
                        Number(
                            like.postId
                        ) ===
                        Number(postId)
                        &&
                        Number(
                            like.userId
                        ) ===
                        Number(currentUserId)
                    );

                }
            );

        if (
            userLikes.length > 0
        ) {

            for (
                const like of userLikes
            ) {

                await fetch(
                    `${API_BASE_URL}/api/likes/${like.id}`,
                    {
                        method: "DELETE"
                    }
                );

            }

        } else {

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
                            JSON.stringify({

                                postId:
                                    Number(
                                        postId
                                    ),

                                userId:
                                    Number(
                                        currentUserId
                                    )

                            })
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
            document.querySelector(
                `.like-count[data-post-id="${postId}"]`
            );

        if (element) {

            element.textContent =
                `❤️ ${count}`;

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
                        Number(
                            like.postId
                        ) ===
                        Number(postId)
                        &&
                        Number(
                            like.userId
                        ) ===
                        Number(currentUserId)
                    );

                }
            );

        button.textContent =
            liked
                ? "❤️ Liked"
                : "❤️ Like";

    } catch (error) {

        console.error(
            "Like status error:",
            error
        );
    }
}


// ======================================================
// COMMENTS TOGGLE
// ======================================================

async function toggleComments(
    postId
) {

    const container =
        document.querySelector(
            `.comments-container[data-post-id="${postId}"]`
        );

    if (!container) {
        return;
    }

    if (
        container.style.display ===
            "none" ||
        container.style.display ===
            ""
    ) {

        container.style.display =
            "block";

        await loadComments(
            postId
        );

    } else {

        container.style.display =
            "none";
    }
}


// ======================================================
// LOAD COMMENTS
// ======================================================

async function loadComments(
    postId
) {

    const container =
        document.querySelector(
            `.comments-container[data-post-id="${postId}"]`
        );

    if (!container) {
        return;
    }

    container.innerHTML = `
        <p>
            Loading comments...
        </p>
    `;

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

        container.innerHTML = "";

        if (
            !comments ||
            comments.length === 0
        ) {

            container.innerHTML = `
                <p>
                    No comments yet.
                </p>
            `;

        } else {

            comments.forEach(
                function (comment) {

                    const commentElement =
                        document.createElement(
                            "div"
                        );

                    commentElement.className =
                        "comment-item";

                    commentElement.style.cssText =
                        `
                        padding:10px;
                        margin-bottom:8px;
                        background:#f7f2fc;
                        border-radius:10px;
                        `;

                    commentElement.innerHTML = `

                        <strong
                            class="comment-user"
                            data-user-id="${comment.userId}"
                        >
                            ${escapeHtml(
                                getUserName(
                                    comment.userId
                                )
                            )}
                        </strong>

                        <p
                            style="
                                margin-top:4px;
                            "
                        >
                            ${escapeHtml(
                                comment.content ||
                                ""
                            )}
                        </p>

                    `;

                    container.appendChild(
                        commentElement
                    );

                }
            );
        }


        const form =
            document.createElement(
                "div"
            );

        form.style.cssText =
            `
            display:flex;
            gap:8px;
            margin-top:10px;
            `;

        form.innerHTML = `

            <input
                type="text"
                placeholder="Write a comment..."
                style="
                    flex:1;
                    padding:10px;
                    border:1px solid #ddd;
                    border-radius:8px;
                "
            >

            <button
                type="button"
            >
                Comment
            </button>

        `;

        const input =
            form.querySelector(
                "input"
            );

        const button =
            form.querySelector(
                "button"
            );

        button.addEventListener(
            "click",
            function () {

                addComment(
                    postId,
                    input
                );

            }
        );

        container.appendChild(
            form
        );

        refreshCommentUserNames();

    } catch (error) {

        console.error(
            "Comments error:",
            error
        );

        container.innerHTML = `
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
    postId,
    input
) {

    if (!currentUserId) {

        alert(
            "Please login first."
        );

        return;
    }

    const content =
        input.value.trim();

    if (!content) {

        alert(
            "Please enter a comment."
        );

        return;
    }

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
                        JSON.stringify({

                            postId:
                                Number(
                                    postId
                                ),

                            userId:
                                Number(
                                    currentUserId
                                ),

                            content:
                                content

                        })
                }
            );

        if (!response.ok) {

            throw new Error(
                "Comment failed"
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
// DELETE POST
// ======================================================

async function deletePost(
    postId
) {

    if (!currentUserId) {

        alert(
            "Please login first."
        );

        return;
    }

    const confirmed =
        confirm(
            "Are you sure you want to delete this post?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/posts/${postId}?userId=${encodeURIComponent(
                    currentUserId
                )}`,
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

            throw new Error(
                "Delete failed"
            );
        }

        alert(
            "Post deleted successfully."
        );

        await loadPosts();

    } catch (error) {

        console.error(
            "Delete post error:",
            error
        );

        alert(
            "Unable to delete post."
        );
    }
}


// ======================================================
// SHARE POST
// ======================================================

async function sharePost(
    post
) {

    const shareUrl =
        `${window.location.origin}${window.location.pathname}?communityId=${encodeURIComponent(
            post.communityId
        )}&postId=${encodeURIComponent(
            post.id
        )}`;

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
                "Post link copied! 🔗"
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
// IMAGE URL
// ======================================================

function getImageUrl(
    imageUrl
) {

    if (!imageUrl) {
        return "";
    }

    if (
        imageUrl.startsWith(
            "http://"
        ) ||
        imageUrl.startsWith(
            "https://"
        )
    ) {

        return imageUrl;
    }

    return (
        API_BASE_URL +
        imageUrl
    );
}


// ======================================================
// DATE FORMAT
// ======================================================

function formatDate(
    dateValue
) {

    if (!dateValue) {
        return "";
    }

    const date =
        new Date(
            dateValue
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";
    }

    return date.toLocaleString();
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

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(value);

    return div.innerHTML;
}