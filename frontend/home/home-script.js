```javascript
const userId = sessionStorage.getItem("userId");

if (!userId) {
    console.error("User ID not found in session.");
}

async function loadHomeData() {

    try {

        const [
            hobbiesResponse,
            communitiesResponse,
            postsResponse,
            commentsResponse
        ] = await Promise.all([

            fetch(
                "https://onlinehobbycommunity-1.onrender.com/api/hobbies"
            ),

            fetch(
                "https://onlinehobbycommunity-1.onrender.com/api/communities"
            ),

            fetch(
                "https://onlinehobbycommunity-1.onrender.com/api/posts"
            ),

            fetch(
                "https://onlinehobbycommunity-1.onrender.com/api/comments"
            )
        ]);


        if (
            !hobbiesResponse.ok ||
            !communitiesResponse.ok ||
            !postsResponse.ok ||
            !commentsResponse.ok
        ) {
            throw new Error("Failed to load home data");
        }


        const hobbies =
            await hobbiesResponse.json();

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
                        `https://onlinehobbycommunity-1.onrender.com/api/users/${userId}`
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

            // Hobbies Joined
            statCards[0].textContent =
                hobbies.length;

            // Communities
            statCards[1].textContent =
                communities.length;

            // Discussions
            statCards[2].textContent =
                posts.length;

            // Activities
            statCards[3].textContent =
                comments.length;
        }


        // -------------------------
        // POPULAR HOBBIES
        // -------------------------

        const hobbyGrid =
            document.querySelector(".hobby-grid");

        if (hobbyGrid) {

            hobbyGrid.innerHTML = "";

            hobbies.slice(0, 3).forEach(
                function(hobby) {

                    const card =
                        document.createElement("div");

                    card.className =
                        "hobby-card";

                    card.innerHTML = `
                        <div class="hobby-image purple-bg">
                            ðŸŽ¨
                        </div>

                        <h3>
                            ${hobby.name}
                        </h3>

                        <p>
                            ${hobby.description ||
                            "Explore this hobby and connect with others."}
                        </p>

                        <div class="card-bottom">

                            <span>
                                ðŸŽ¯ ${hobby.category || "Hobby"}
                            </span>

                            <button type="button">
                                Explore
                            </button>

                        </div>
                    `;

                    const button =
                        card.querySelector("button");

                    button.addEventListener(
                        "click",
                        function() {

                            window.location.href =
                                "../explore/explore.html";

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
                function(community) {

                    const card =
                        document.createElement("div");

                    card.className =
                        "community-card";

                    card.innerHTML = `
                        <div class="community-icon">
                            ðŸ‘¥
                        </div>

                        <div>

                            <h3>
                                ${community.name}
                            </h3>

                            <p>
                                ${community.description ||
                                "Community"}
                            </p>

                        </div>

                        <span class="arrow">
                            â†’
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


// -------------------------
// START
// -------------------------

loadHomeData();
```

