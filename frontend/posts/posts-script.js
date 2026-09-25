const feed =
    document.getElementById("postsContainer");

let allPosts = [];

async function loadPosts() {

    try {

        feed.innerHTML = `
            <div class="empty-posts">
                <h3>Loading posts...</h3>
                <p>Please wait.</p>
            </div>
        `;

        const response =
            await fetch(
                "http://localhost:8080/api/posts"
            );

        if (!response.ok) {
            throw new Error(
                "Failed to load posts"
            );
        }

        allPosts =
            await response.json();

        displayPosts();

    } catch (error) {

        console.error(
            "Posts loading error:",
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


function displayPosts() {

    const sortElement =
        document.getElementById("sortPosts");

    const sortValue =
        sortElement
            ? sortElement.value
            : "latest";

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
                <p>No posts are available.</p>
            </div>
        `;

        return;
    }


    posts.forEach(function(post) {

        const postElement =
            document.createElement("article");

        postElement.className =
            "post";


        postElement.innerHTML = `

            <div class="post-user">

                <div class="avatar purple">
                    U
                </div>

                <div>
                    <h3>User ID: ${post.userId || "-"}</h3>

                    <span>
                        Community ID: ${post.communityId || "-"}
                    </span>
                </div>

            </div>


            <div class="post-title">

                <h2>
                    ${post.title || "Untitled Post"}
                </h2>

            </div>


            <p class="post-text">
                ${post.content || ""}
            </p>


            <div class="post-stats">

                <span>
                    Post ID: ${post.id}
                </span>

                <span>
                    ${post.createdAt || "Date not available"}
                </span>

            </div>


            <div class="post-actions">

                <button
                    type="button"
                    onclick="viewPost(${post.id})">
                    👁 View
                </button>

                <button
                    type="button"
                    onclick="deletePost(${post.id})">
                    🗑 Delete
                </button>

            </div>

        `;


        feed.appendChild(postElement);

    });

}


function viewPost(postId) {

    const post =
        allPosts.find(function(item) {

            return Number(item.id) ===
                   Number(postId);

        });


    if (!post) {

        alert("Post not found.");

        return;
    }


    alert(
        "Post ID: " + post.id +
        "\n\nTitle: " + post.title +
        "\n\nContent: " + post.content +
        "\n\nUser ID: " + post.userId +
        "\nCommunity ID: " + post.communityId
    );
}


async function deletePost(postId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete Post #" +
            postId +
            "?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/posts/" +
                postId,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );
        }


        allPosts =
            allPosts.filter(function(post) {

                return Number(post.id) !==
                       Number(postId);

            });


        displayPosts();


        alert(
            "Post deleted successfully! ✓"
        );


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


function sortPosts() {

    displayPosts();

}


loadPosts();