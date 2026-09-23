const feed =
    document.getElementById("postsContainer");

let allPosts = [];
let allComments = [];


// Load posts and comments
async function loadData() {

    try {

        const postsResponse =
            await fetch(
                "http://localhost:8080/api/posts"
            );

        const commentsResponse =
            await fetch(
                "http://localhost:8080/api/comments"
            );


        if (!postsResponse.ok ||
            !commentsResponse.ok) {

            throw new Error(
                "Failed to load data"
            );
        }


        allPosts =
            await postsResponse.json();

        allComments =
            await commentsResponse.json();


        displayPosts();


    } catch (error) {

        console.error(
            "Data loading error:",
            error
        );


        feed.innerHTML = `
            <div class="empty-posts">
                <h3>Unable to load posts</h3>
                <p>Please make sure the backend is running.</p>
            </div>
        `;
    }
}


// Display posts
function displayPosts() {

    const sortValue =
        document.getElementById("sortPosts").value;


    let posts =
        [...allPosts];


    if (sortValue === "popular") {

        posts.sort(function(a, b) {

            return (
                (b.likesCount || 0) -
                (a.likesCount || 0)
            );

        });

    } else {

        posts.reverse();

    }


    feed.innerHTML = "";


    if (posts.length === 0) {

        feed.innerHTML = `
            <div class="empty-posts">
                <h3>No posts yet</h3>
                <p>Be the first to create a post!</p>
            </div>
        `;

        return;
    }


    posts.forEach(function(post) {

        const postElement =
            document.createElement("article");


        postElement.className =
            "post";


        postElement.dataset.id =
            post.id;


        postElement.dataset.likes =
            post.likesCount || 0;


        const postComments =
            allComments.filter(function(comment) {

                return Number(comment.postId) ===
                       Number(post.id);

            });


        let commentsHTML = "";


        postComments.forEach(function(comment) {

            commentsHTML += `
                <div class="comment-item">

                    <div class="comment-avatar">
                        A
                    </div>

                    <div class="comment-content">

                        <strong>
                            Amisha
                        </strong>

                        <p>
                            ${comment.content}
                        </p>

                        <small>
                            ${comment.createdAt || ""}
                        </small>

                    </div>

                </div>
            `;

        });


        postElement.innerHTML = `

            <div class="post-user">

                <div class="avatar purple">
                    A
                </div>

                <div>
                    <h3>Amisha</h3>

                    <span>
                        @amisha
                    </span>
                </div>

            </div>


            <div class="post-title">

                <h2>
                    ${post.title}
                </h2>

            </div>


            <p class="post-text">
                ${post.content}
            </p>


            <div class="post-stats">

                <span class="like-count">
                    ${post.likesCount || 0} likes
                </span>

                <span class="comment-count">
                    ${postComments.length} comments
                </span>

            </div>


            <div class="post-actions">

                <button
                    type="button"
                    onclick="likePost(this)"
                >
                    ♡ Like
                </button>


                <button
                    type="button"
                    onclick="commentPost(this)"
                >
                    💬 Comment
                </button>


                <button
                    type="button"
                    onclick="sharePost()"
                >
                    ↗ Share
                </button>

            </div>


            <div class="comments-section">

                ${commentsHTML}

            </div>
        `;


        feed.appendChild(postElement);

    });

}


// Like post
async function likePost(button) {

    const post =
        button.closest(".post");


    const postId =
        post.dataset.id;


    const currentLikes =
        parseInt(
            post.dataset.likes || 0
        );


    const likeData = {

        postId: Number(postId),

        userId: 1
    };


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/likes",
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

            throw new Error(
                "Unable to save like"
            );
        }


        const savedLike =
            await response.json();


        console.log(
            "Like saved:",
            savedLike
        );


        const newLikes =
            currentLikes + 1;


        post.dataset.likes =
            newLikes;


        post.querySelector(
            ".like-count"
        ).textContent =
            newLikes + " likes";


        button.textContent =
            "♥ Liked";


        button.style.color =
            "#7540c8";


        button.disabled =
            true;


    } catch (error) {

        console.error(
            "Like error:",
            error
        );


        alert(
            "Unable to like post. Please try again."
        );
    }
}


// Add comment
async function commentPost(button) {

    const post =
        button.closest(".post");


    const postId =
        post.dataset.id;


    const commentText =
        prompt(
            "Write your comment:"
        );


    if (
        commentText === null ||
        commentText.trim() === ""
    ) {

        return;
    }


    const commentData = {

        postId: Number(postId),

        userId: 1,

        content:
            commentText.trim()

    };


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/comments",
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
                "Unable to save comment"
            );
        }


        const savedComment =
            await response.json();


        console.log(
            "Comment saved:",
            savedComment
        );


        allComments.push(
            savedComment
        );


        displayPosts();


        alert(
            "Comment added successfully! ✓"
        );


    } catch (error) {

        console.error(
            "Comment error:",
            error
        );


        alert(
            "Unable to add comment. Please try again."
        );
    }
}


// Share
function sharePost() {

    alert(
        "Post sharing option will be connected later."
    );
}


// Sort
function sortPosts() {

    displayPosts();

}


// Start
loadData();