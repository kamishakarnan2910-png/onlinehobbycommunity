const communityName =
    document.getElementById("communityName");

const communityDescription =
    document.getElementById("communityDescription");

const communityCategory =
    document.getElementById("communityCategory");

const aboutCommunity =
    document.getElementById("aboutCommunity");

const memberCount =
    document.getElementById("memberCount");

const joinButton =
    document.getElementById("joinButton");


const currentUserId = 1;


// Get community ID from URL
const urlParams =
    new URLSearchParams(window.location.search);

const communityId =
    urlParams.get("id");


// Load community details
async function loadCommunityDetails() {

    if (!communityId) {

        communityName.textContent =
            "Community not found";

        return;
    }

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/communities/${communityId}`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load community"
            );
        }

        const community =
            await response.json();

        communityName.textContent =
            community.name;

        communityDescription.textContent =
            community.description;

        communityCategory.textContent =
            `🎨 ${community.category}`;

        aboutCommunity.textContent =
            community.description;


        // Get member count
        const countResponse =
            await fetch(
                `http://localhost:8080/api/communities/${communityId}/members/count`
            );

        if (countResponse.ok) {

            const count =
                await countResponse.json();

            memberCount.textContent =
                `👥 ${count} Members`;
        }


        // Load recent posts
        await loadRecentPosts();

    } catch (error) {

        console.error(
            "Community loading error:",
            error
        );

        communityName.textContent =
            "Unable to load community";

        communityDescription.textContent =
            "Please make sure the backend is running.";
    }
}


// Load recent posts
async function loadRecentPosts() {

    try {

        const response =
            await fetch(
                `http://localhost:8080/api/posts/community/${communityId}`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load posts"
            );
        }

        const posts =
            await response.json();


        const postContainer =
            document.querySelector(".content-card:nth-of-type(4)");

        if (!postContainer) {
            return;
        }


        const postList =
            postContainer.querySelectorAll(".post-preview");

        postList.forEach(function(post) {
            post.remove();
        });


        if (posts.length === 0) {

            const emptyMessage =
                document.createElement("p");

            emptyMessage.textContent =
                "No posts yet. Be the first to create a post!";

            postContainer.appendChild(
                emptyMessage
            );

            return;
        }


        posts.slice(0, 5).forEach(function(post) {

            const postPreview =
                document.createElement("div");

            postPreview.className =
                "post-preview";


            const postIcon =
                document.createElement("div");

            postIcon.className =
                "post-icon";

            postIcon.textContent =
                "🎨";


            const postContent =
                document.createElement("div");


            const title =
                document.createElement("h3");

            title.textContent =
                post.title;


            const content =
                document.createElement("p");

            content.textContent =
                post.content;


            const small =
                document.createElement("small");

            small.textContent =
                "Community post";


            postContent.appendChild(title);
            postContent.appendChild(content);
            postContent.appendChild(small);


            postPreview.appendChild(postIcon);
            postPreview.appendChild(postContent);


            postContainer.appendChild(
                postPreview
            );

        });


    } catch (error) {

        console.error(
            "Recent posts error:",
            error
        );

    }
}


// Join community
joinButton.addEventListener(
    "click",
    async function () {

        if (!communityId) {

            alert(
                "Community ID not found."
            );

            return;
        }

        if (
            joinButton.classList.contains("joined")
        ) {
            return;
        }

        joinButton.disabled = true;

        joinButton.textContent =
            "Joining...";


        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/community-members/join?communityId=${communityId}&userId=${currentUserId}`,
                    {
                        method: "POST"
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(errorText);
            }


            const savedMember =
                await response.json();


            console.log(
                "Community member saved:",
                savedMember
            );


            joinButton.textContent =
                "Joined ✓";

            joinButton.classList.add(
                "joined"
            );

            joinButton.disabled =
                true;


            // Update member count
            const countResponse =
                await fetch(
                    `http://localhost:8080/api/communities/${communityId}/members/count`
                );

            if (countResponse.ok) {

                const count =
                    await countResponse.json();

                memberCount.textContent =
                    `👥 ${count} Members`;
            }


            alert(
                "Joined community successfully! ✓"
            );


        } catch (error) {

            console.error(
                "Join error:",
                error
            );

            joinButton.disabled =
                false;

            joinButton.textContent =
                "Join Community";

            alert(
                "Unable to join community. Please try again."
            );
        }

    }
);


// Start
loadCommunityDetails();