const API_BASE = "https://onlinehobbycommunity-1.onrender.com/api";

// =====================================================
// LOAD DATA
// =====================================================

async function loadHobbies() {

    try {

        hobbyGrid.innerHTML = `
            <div class="empty-posts">
                <h3>Loading hobbies...</h3>
                <p>Please wait.</p>
            </div>
        `;

        resultCount.textContent =
            "Loading hobbies...";


        // =================================================
        // LOAD HOBBIES
        // =================================================

        const hobbyResponse =
            await fetch(
                `${API_BASE}/hobbies`
            );


        if (!hobbyResponse.ok) {

            throw new Error(
                "Failed to load hobbies: " +
                hobbyResponse.status
            );
        }


        const hobbyData =
            await hobbyResponse.json();


        if (!Array.isArray(hobbyData)) {

            throw new Error(
                "Invalid hobbies response"
            );
        }


        hobbies =
            hobbyData;


        console.log(
            "Hobbies loaded:",
            hobbies
        );


        // =================================================
        // LOAD COMMUNITIES
        // =================================================

        try {

            const communityResponse =
                await fetch(
                    `${API_BASE}/communities`
                );


            if (communityResponse.ok) {

                const communityData =
                    await communityResponse.json();


                communities =
                    Array.isArray(
                        communityData
                    )
                        ? communityData
                        : [];


            } else {

                communities = [];

                console.warn(
                    "Communities API failed:",
                    communityResponse.status
                );
            }


        } catch (error) {

            communities = [];

            console.warn(
                "Community loading error:",
                error
            );
        }


        // =================================================
        // LOAD USERS
        // =================================================

        try {

            const userResponse =
                await fetch(
                    `${API_BASE}/users`
                );


            if (userResponse.ok) {

                const userData =
                    await userResponse.json();


                users =
                    Array.isArray(
                        userData
                    )
                        ? userData
                        : [];


            } else {

                users = [];

                console.warn(
                    "Users API failed:",
                    userResponse.status
                );
            }


        } catch (error) {

            users = [];

            console.warn(
                "User loading error:",
                error
            );
        }


        console.log(
            "Communities loaded:",
            communities
        );


        console.log(
            "Users loaded:",
            users
        );


        // =================================================
        // DISPLAY HOBBIES
        // =================================================

        displayHobbies();


    } catch (error) {

        console.error(
            "Explore loading error:",
            error
        );


        hobbyGrid.innerHTML = `
            <div class="empty-posts">
                <h3>Unable to load hobbies</h3>
                <p>
                    Please make sure the backend is running.
                </p>
            </div>
        `;


        resultCount.textContent =
            "0 hobbies";
    }
}


// =====================================================
// FIND COMMUNITY FOR HOBBY
// =====================================================

function findCommunityForHobby(
    hobby
) {

    if (!hobby) {

        return null;
    }


    const hobbyName =
        normalize(
            hobby.name
        );


    const hobbyCategory =
        normalize(
            hobby.category
        );


    // =================================================
    // 1. EXACT NAME
    // =================================================

    let community =
        communities.find(
            function(item) {

                return (
                    isAdminCommunity(item) &&
                    normalize(item.name) ===
                    hobbyName
                );

            }
        );


    if (community) {

        return community;
    }


    // =================================================
    // 2. NAME + COMMUNITY
    // =================================================

    community =
        communities.find(
            function(item) {

                if (
                    !isAdminCommunity(item)
                ) {

                    return false;
                }


                const communityName =
                    normalize(
                        item.name
                    );


                return (
                    communityName ===
                    hobbyName +
                    " community"
                );

            }
        );


    if (community) {

        return community;
    }


    // =================================================
    // 3. COMMUNITY NAME CONTAINS HOBBY NAME
    // =================================================

    community =
        communities.find(
            function(item) {

                if (
                    !isAdminCommunity(item)
                ) {

                    return false;
                }


                const communityName =
                    normalize(
                        item.name
                    );


                return (
                    communityName.includes(
                        hobbyName
                    ) ||
                    hobbyName.includes(
                        communityName
                    )
                );

            }
        );


    if (community) {

        return community;
    }


    // =================================================
    // 4. CATEGORY MATCH
    // =================================================

    if (hobbyCategory) {

        community =
            communities.find(
                function(item) {

                    if (
                        !isAdminCommunity(item)
                    ) {

                        return false;
                    }


                    return (
                        normalize(
                            item.category
                        ) ===
                        hobbyCategory
                    );

                }
            );


        if (community) {

            return community;
        }
    }


    // =================================================
    // NO MATCH
    // =================================================

    console.warn(
        "No ADMIN community found for hobby:",
        hobby.name
    );


    return null;
}
// =====================================================
// DISPLAY HOBBIES
// =====================================================

function displayHobbies(
    hobbyList = hobbies
) {

    if (!hobbyGrid) {

        console.error(
            "Hobby grid element not found."
        );

        return;
    }


    // =================================================
    // CLEAR GRID
    // =================================================

    hobbyGrid.innerHTML = "";


    // =================================================
    // NO HOBBIES
    // =================================================

    if (
        !Array.isArray(hobbyList) ||
        hobbyList.length === 0
    ) {

        hobbyGrid.innerHTML = `
            <div class="empty-posts">
                <h3>No hobbies found</h3>
                <p>Try another search or category.</p>
            </div>
        `;


        if (resultCount) {

            resultCount.textContent =
                "0 hobbies";
        }


        return;
    }


    // =================================================
    // RESULT COUNT
    // =================================================

    if (resultCount) {

        resultCount.textContent =
            `${hobbyList.length} ${
                hobbyList.length === 1
                    ? "hobby"
                    : "hobbies"
            }`;
    }


    // =================================================
    // CREATE HOBBY CARDS
    // =================================================

    hobbyList.forEach(
        function(hobby) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "hobby-card";


            // =================================================
            // HOBBY DATA
            // =================================================

            const hobbyName =
                hobby.name ||
                "Hobby";


            const description =
                hobby.description ||
                "Explore this hobby and connect with others.";


            const category =
                hobby.category ||
                "General";


            const imageUrl =
                hobby.imageUrl ||
                "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80";


            // =================================================
            // CARD HTML
            // =================================================

            card.innerHTML = `
                <div class="hobby-image-wrapper">

                    <img
                        src="${imageUrl}"
                        alt="${hobbyName}"
                        class="hobby-image"
                    >

                </div>

                <div class="hobby-content">

                    <h3>
                        ${hobbyName}
                    </h3>

                    <p>
                        ${description}
                    </p>

                    <span class="hobby-category">
                        ${category}
                    </span>

                </div>
            `;


            // =================================================
            // CARD CLICK
            // =================================================

            card.addEventListener(
                "click",
                function() {

                    console.log(
                        "Hobby clicked:",
                        hobby
                    );


                    const matchingCommunity =
                        findCommunityForHobby(
                            hobby
                        );


                    // =============================================
                    // COMMUNITY NOT FOUND
                    // =============================================

                    if (!matchingCommunity) {

                        console.warn(
                            "Admin community not found:",
                            hobby.name
                        );


                        alert(
                            `${hobby.name} Community is not available yet.`
                        );


                        return;
                    }


                    // =============================================
                    // COMMUNITY ID
                    // =============================================

                    const communityId =
                        matchingCommunity.id;


                    if (
                        communityId === null ||
                        communityId === undefined ||
                        String(
                            communityId
                        ).trim() === ""
                    ) {

                        console.error(
                            "Community ID missing:",
                            matchingCommunity
                        );


                        alert(
                            "Community information is incomplete."
                        );


                        return;
                    }


                    // =============================================
                    // ADMIN CHECK
                    // =============================================

                    if (
                        !isAdminCommunity(
                            matchingCommunity
                        )
                    ) {

                        console.error(
                            "Community is not owned by ADMIN:",
                            matchingCommunity
                        );


                        alert(
                            "This community is not an admin community."
                        );


                        return;
                    }


                    // =============================================
                    // OPEN COMMUNITY DETAILS
                    // =============================================

                    console.log(
                        "Opening community:",
                        matchingCommunity.name
                    );


                    console.log(
                        "Community ID:",
                        communityId
                    );


                    window.location.href =
                        `../community-details/community-details.html?id=${encodeURIComponent(
                            communityId
                        )}`;
                }
            );


            // =================================================
            // ADD CARD TO GRID
            // =================================================

            hobbyGrid.appendChild(
                card
            );

        }
    );
}
// =====================================================
// SEARCH HOBBIES
// =====================================================

function searchHobbies() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {

        displayHobbies(
            hobbies
        );

        return;
    }


    const searchText =
        normalize(
            searchInput.value
        );


    if (!searchText) {

        displayHobbies(
            hobbies
        );

        return;
    }


    const filteredHobbies =
        hobbies.filter(
            function(hobby) {

                const name =
                    normalize(
                        hobby.name
                    );


                const description =
                    normalize(
                        hobby.description
                    );


                const category =
                    normalize(
                        hobby.category
                    );


                return (
                    name.includes(
                        searchText
                    ) ||
                    description.includes(
                        searchText
                    ) ||
                    category.includes(
                        searchText
                    )
                );
            }
        );


    displayHobbies(
        filteredHobbies
    );
}


// =====================================================
// CATEGORY FILTER
// =====================================================

function filterByCategory(
    category
) {

    if (
        !category ||
        normalize(category) === "all"
    ) {

        displayHobbies(
            hobbies
        );

        return;
    }


    const selectedCategory =
        normalize(
            category
        );


    const filteredHobbies =
        hobbies.filter(
            function(hobby) {

                return (
                    normalize(
                        hobby.category
                    ) ===
                    selectedCategory
                );
            }
        );


    displayHobbies(
        filteredHobbies
    );
}


// =====================================================
// SEARCH INPUT
// =====================================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            searchHobbies();

        }
    );
}


// =====================================================
// CATEGORY BUTTONS
// =====================================================

const categoryButtons =
    document.querySelectorAll(
        "[data-category]"
    );


categoryButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const category =
                    button.getAttribute(
                        "data-category"
                    );


                categoryButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                filterByCategory(
                    category
                );
            }
        );

    }
);


// =====================================================
// NORMALIZE TEXT
// =====================================================

function normalize(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        );
}


// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadHobbies();

    }
);
