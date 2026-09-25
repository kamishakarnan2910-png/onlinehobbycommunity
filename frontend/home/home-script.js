const userId = sessionStorage.getItem("userId");

if (!userId) {
    console.error("User ID not found in session.");
}

async function loadHomeData() {

    try {

        const [communitiesResponse, postsResponse, commentsResponse] =
            await Promise.all([
                fetch("http://localhost:8080/api/communities"),
                fetch("http://localhost:8080/api/posts"),
                fetch("http://localhost:8080/api/comments")
            ]);

        if (!communitiesResponse.ok ||
            !postsResponse.ok ||
            !commentsResponse.ok) {

            throw new Error("Failed to load home data");
        }

        const communities =
            await communitiesResponse.json();

        const posts =
            await postsResponse.json();

        const comments =
            await commentsResponse.json();


        // -------------------------
        // USER NAME
        // -------------------------

        const welcomeName =
            document.querySelector(".welcome h1 span");

        if (userId && welcomeName) {

            try {

                const userResponse =
                    await fetch(
                        `http://localhost:8080/api/users/${userId}`
                    );

                if (userResponse.ok) {

                    const user =
                        await userResponse.json();

                    welcomeName.textContent =
                        `${user.name}!`;
                }

            } catch (error) {

                console.error(
                    "User loading error:",
                    error
                );
            }
        }


        // -------------------------
        // STATS
        // -------------------------

        const statCards =
            document.querySelectorAll(".stat-card strong");


        if (statCards.length >= 4) {

            statCards[0].textContent =
                communities.length;

            statCards[1].textContent =
                communities.length;

            statCards[2].textContent =
                comments.length;

            statCards[3].textContent =
                posts.length;
        }


        // -------------------------
        // POPULAR HOBBIES
        // -------------------------

        const hobbyGrid =
            document.querySelector(".hobby-grid");

        if (hobbyGrid) {

            hobbyGrid.innerHTML = "";

            communities.slice(0, 3).forEach(
                function(community) {

                    const card =
                        document.createElement("div");

                    card.className =
                        "hobby-card";

                    card.innerHTML = `
                        <div class="hobby-image purple-bg">
                            🎨
                        </div>

                        <h3>
                            ${community.name}
                        </h3>

                        <p>
                            ${community.description || "Explore this community and connect with others."}
                        </p>

                        <div class="card-bottom">

                            <span>
                                👥 Community
                            </span>

                            <button type="button">
                                View
                            </button>

                        </div>
                    `;

                    const button =
                        card.querySelector("button");

                    button.addEventListener(
                        "click",
                        function() {

                            window.location.href =
                                `../community-details/community-details.html?id=${community.id}`;

                        }
                    );

                    hobbyGrid.appendChild(card);
                }
            );
        }


        // -------------------------
        // YOUR COMMUNITIES
        // -------------------------

        const communityGrid =
            document.querySelector(".community-grid");

        if (communityGrid) {

            communityGrid.innerHTML = "";

            communities.slice(0, 3).forEach(
                async function(community) {

                    const card =
                        document.createElement("div");

                    card.className =
                        "community-card";

                    card.innerHTML = `
                        <div class="community-icon">
                            👥
                        </div>

                        <div>

                            <h3>
                                ${community.name}
                            </h3>

                            <p>
                                ${community.description || "Community"}
                            </p>

                        </div>

                        <span class="arrow">
                            →
                        </span>
                    `;

                    card.addEventListener(
                        "click",
                        function() {

                            window.location.href =
                                `../community-details/community-details.html?id=${community.id}`;

                        }
                    );

                    communityGrid.appendChild(card);

                }
            );
        }


    } catch (error) {

        console.error(
            "Home loading error:",
            error
        );

    }
}


// Start
loadHomeData();