const communityGrid =
    document.querySelector(".community-grid");

const searchInput =
    document.getElementById("communitySearch");

const categories =
    document.querySelectorAll(".category");

const noResults =
    document.getElementById("noResults");

let communities = [];

let selectedCategory = "all";

const API_BASE =
    "http://localhost:8080/api";


// =====================================================
// COMMUNITY ICON
// =====================================================

function getCommunityIcon(category) {

    const value =
        (category || "").toLowerCase();

    if (value.includes("creative")) {
        return "🎨";
    }

    if (value.includes("reading")) {
        return "📚";
    }

    if (value.includes("entertainment")) {
        return "🎵";
    }

    if (value.includes("technology")) {
        return "💻";
    }

    if (value.includes("food")) {
        return "🍳";
    }

    if (value.includes("gardening")) {
        return "🌱";
    }

    return "👥";
}


// =====================================================
// LOAD COMMUNITIES
// =====================================================

async function loadCommunities() {

    try {

        const response =
            await fetch(
                `${API_BASE}/communities`
            );

        if (!response.ok) {

            throw new Error(
                "Failed to load communities"
            );
        }

        communities =
            await response.json();

        await displayCommunities();

    } catch (error) {

        console.error(
            "Load communities error:",
            error
        );

        communityGrid.innerHTML = "";

        noResults.style.display =
            "block";

        noResults.innerHTML = `
            <h3>
                Unable to load communities 🔍
            </h3>

            <p>
                Please make sure the backend is running.
            </p>
        `;
    }
}


// =====================================================
// DISPLAY COMMUNITIES
// =====================================================

async function displayCommunities() {

    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredCommunities =
        communities.filter(
            community => {

                const name =
                    (community.name || "")
                        .toLowerCase();

                const category =
                    (community.category || "")
                        .toLowerCase();


                const matchesSearch =
                    name.includes(search);


                let matchesCategory = true;


                if (selectedCategory !== "all") {

                    if (
                        selectedCategory === "creative"
                    ) {

                        matchesCategory =
                            category === "creative";

                    } else if (
                        selectedCategory === "reading"
                    ) {

                        matchesCategory =
                            category === "reading";

                    } else if (
                        selectedCategory === "entertainment"
                    ) {

                        matchesCategory =
                            category === "entertainment";

                    } else if (
                        selectedCategory === "technology"
                    ) {

                        matchesCategory =
                            category === "technology";

                    } else if (
                        selectedCategory === "food"
                    ) {

                        matchesCategory =
                            category === "food";

                    }
                }


                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );


    communityGrid.innerHTML = "";


    if (filteredCommunities.length === 0) {

        noResults.style.display =
            "block";

        return;
    }


    noResults.style.display =
        "none";


    for (
        const community
        of filteredCommunities
    ) {

        const card =
            document.createElement("a");


        card.className =
            "community-card";


        card.href =
            `../community-details/community-details.html?id=${encodeURIComponent(community.id)}`;


        card.dataset.name =
            community.name || "";


        card.dataset.category =
            community.category || "";


        const icon =
            getCommunityIcon(
                community.category
            );


        card.innerHTML = `

            <div class="community-icon">
                ${icon}
            </div>

            <h3>
                ${escapeHtml(
                    community.name ||
                    "Community"
                )}
            </h3>

            <p>
                ${escapeHtml(
                    community.description ||
                    "No description available."
                )}
            </p>

            <div class="card-bottom">

                <span class="member-count">
                    👥 Loading members...
                </span>

            </div>
        `;


        communityGrid.appendChild(card);


        // =================================================
        // LOAD REAL MEMBER COUNT
        // =================================================

        try {

            const countResponse =
                await fetch(
                    `${API_BASE}/community-members/count/${encodeURIComponent(community.id)}`
                );


            if (!countResponse.ok) {

                throw new Error(
                    "Member count request failed"
                );
            }


            const count =
                await countResponse.json();


            const memberCount =
                card.querySelector(
                    ".member-count"
                );


            memberCount.textContent =
                `👥 ${count} members`;


        } catch (error) {

            console.error(
                "Member count error:",
                error
            );


            const memberCount =
                card.querySelector(
                    ".member-count"
                );


            memberCount.textContent =
                "👥 Unable to load members";
        }
    }
}


// =====================================================
// SEARCH
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        displayCommunities
    );
}


// =====================================================
// CATEGORY FILTER
// =====================================================

categories.forEach(
    category => {

        category.addEventListener(
            "click",
            function() {

                categories.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );
                    }
                );


                this.classList.add(
                    "active"
                );


                selectedCategory =
                    this.dataset.category;


                displayCommunities();
            }
        );
    }
);


// =====================================================
// HTML SECURITY
// =====================================================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;
}


// =====================================================
// START
// =====================================================

loadCommunities();