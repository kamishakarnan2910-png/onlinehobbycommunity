const selectedUserId =
    sessionStorage.getItem("selectedUserId") ||
    localStorage.getItem("userId");

const loggedInUserId =
    localStorage.getItem("userId");

const API_BASE = "http://localhost:8080/api";


// =====================================================
// LOAD PROFILE
// =====================================================

async function loadProfile() {

    if (!selectedUserId || !loggedInUserId) {
        alert("Please login first.");
        window.location.href = "../login/login.html";
        return;
    }

    try {

        // -----------------------------
        // USER DATA
        // -----------------------------

        const userResponse = await fetch(
            `${API_BASE}/users/${selectedUserId}`
        );

        if (!userResponse.ok) {
            throw new Error("User not found");
        }

        const user = await userResponse.json();


        // -----------------------------
        // PROFILE DATA
        // -----------------------------

        const profileResponse = await fetch(
            `${API_BASE}/profiles/${selectedUserId}?viewerId=${loggedInUserId}`
        );


        // -----------------------------
        // PRIVATE PROFILE
        // -----------------------------

        if (profileResponse.status === 403) {

            showPrivateProfile(user);

            return;
        }


        // -----------------------------
        // PROFILE NOT FOUND
        // -----------------------------

        if (!profileResponse.ok) {
            throw new Error("Profile not found");
        }


        const profile =
            await profileResponse.json();


        // -----------------------------
        // PROFILE INFORMATION
        // -----------------------------

        const name =
            profile?.name ||
            user.name ||
            "User";

        const bio =
            profile?.bio ||
            "No bio added yet.";

        const location =
            profile?.location ||
            "Location not added";


        document.getElementById(
            "profileName"
        ).textContent = name;


        document.getElementById(
            "profileImage"
        ).textContent =
            name.charAt(0).toUpperCase();


        document.getElementById(
            "profileBio"
        ).textContent = bio;


        document.getElementById(
            "profileLocation"
        ).textContent =
            "📍 " + location;


        const username =
            user.email
                ? "@" + user.email.split("@")[0]
                : "";


        document.getElementById(
            "profileUsername"
        ).textContent = username;


        document.getElementById(
            "profileEducation"
        ).textContent =
            profile?.education || "";


        // -----------------------------
        // LOAD HOBBIES
        // -----------------------------

        await loadMyHobbies();


        // -----------------------------
        // LOAD COMMUNITIES
        // -----------------------------

        await loadMyCommunities();


        // -----------------------------
        // LOAD POST COUNT
        // -----------------------------

        await loadPostCount();


        document.getElementById(
            "followerCount"
        ).textContent = "0";


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        document.getElementById(
            "profileName"
        ).textContent =
            "Unable to load profile";

        document.getElementById(
            "profileBio"
        ).textContent =
            "Please try again.";
    }
}


// =====================================================
// PRIVATE PROFILE
// =====================================================

function showPrivateProfile(user) {

    const name =
        user?.name || "User";


    document.getElementById(
        "profileName"
    ).textContent = name;


    document.getElementById(
        "profileImage"
    ).textContent =
        name.charAt(0).toUpperCase();


    document.getElementById(
        "profileUsername"
    ).textContent =
        user?.email
            ? "@" + user.email.split("@")[0]
            : "";


    document.getElementById(
        "profileBio"
    ).textContent =
        "🔒 This profile is private.";


    document.getElementById(
        "profileLocation"
    ).textContent =
        "Profile details are hidden";


    document.getElementById(
        "profileEducation"
    ).textContent = "";


    const hobbyList =
        document.getElementById("hobbyList");

    if (hobbyList) {

        hobbyList.innerHTML = `
            <p>🔒 Private profile</p>
        `;
    }


    const communityList =
        document.getElementById("communityList");

    if (communityList) {

        communityList.innerHTML = `
            <p>🔒 Private profile</p>
        `;
    }


    const communityCount =
        document.getElementById("communityCount");

    if (communityCount) {

        communityCount.textContent = "—";
    }


    const postCount =
        document.getElementById("postCount");

    if (postCount) {

        postCount.textContent = "—";
    }


    const followerCount =
        document.getElementById("followerCount");

    if (followerCount) {

        followerCount.textContent = "—";
    }
}


// =====================================================
// MY HOBBIES
// =====================================================

async function loadMyHobbies() {

    const hobbyList =
        document.getElementById("hobbyList");

    try {

        const response = await fetch(
            `${API_BASE}/user-hobbies/user/${selectedUserId}`
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load hobbies"
            );
        }

        const userHobbies =
            await response.json();


        hobbyList.innerHTML = "";


        if (
            !userHobbies ||
            userHobbies.length === 0
        ) {

            hobbyList.innerHTML = `
                <p>You have not joined any hobbies yet.</p>
            `;

            return;
        }


        for (const userHobby of userHobbies) {

            const hobbyResponse = await fetch(
                `${API_BASE}/hobbies/${userHobby.hobbyId}`
            );

            if (!hobbyResponse.ok) {
                continue;
            }

            const hobby =
                await hobbyResponse.json();


            const card =
                document.createElement("div");

            card.className =
                "hobby-card";


            card.innerHTML = `
                <span>
                    ${getHobbyIcon(hobby.category)}
                </span>

                <span>
                    ${escapeHtml(
                        hobby.name || "Hobby"
                    )}
                </span>
            `;


            hobbyList.appendChild(card);
        }


        if (!hobbyList.children.length) {

            hobbyList.innerHTML = `
                <p>No hobbies found.</p>
            `;
        }

    } catch (error) {

        console.error(
            "Hobbies loading error:",
            error
        );

        hobbyList.innerHTML = `
            <p>Unable to load hobbies.</p>
        `;
    }
}


// =====================================================
// MY COMMUNITIES
// =====================================================

async function loadMyCommunities() {

    const communityList =
        document.getElementById("communityList");

    try {

        const response = await fetch(
            `${API_BASE}/community-members/user/${selectedUserId}`
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load communities"
            );
        }

        const memberships =
            await response.json();


        communityList.innerHTML = "";


        if (
            !memberships ||
            memberships.length === 0
        ) {

            communityList.innerHTML = `
                <p>You have not joined any communities yet.</p>
            `;

            document.getElementById(
                "communityCount"
            ).textContent = "0";

            return;
        }


        let displayedCount = 0;


        for (const membership of memberships) {

            const communityResponse =
                await fetch(
                    `${API_BASE}/communities/${membership.communityId}`
                );


            if (!communityResponse.ok) {
                continue;
            }


            const community =
                await communityResponse.json();


            const card =
                document.createElement("div");

            card.className =
                "community-card";


            card.innerHTML = `
                <div class="community-icon">
                    ${getCommunityIcon(
                        community.category
                    )}
                </div>

                <div>
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
                </div>
            `;


            card.addEventListener(
                "click",
                function () {

                    window.location.href =
                        "../community-details/community-details.html?id="
                        + community.id;
                }
            );


            communityList.appendChild(card);

            displayedCount++;
        }


        document.getElementById(
            "communityCount"
        ).textContent =
            displayedCount;


        if (!communityList.children.length) {

            communityList.innerHTML = `
                <p>No joined communities found.</p>
            `;
        }

    } catch (error) {

        console.error(
            "Communities loading error:",
            error
        );

        communityList.innerHTML = `
            <p>Unable to load communities.</p>
        `;
    }
}


// =====================================================
// POSTS COUNT
// =====================================================

async function loadPostCount() {

    try {

        const response =
            await fetch(`${API_BASE}/posts`);

        if (!response.ok) {
            throw new Error(
                "Unable to load posts"
            );
        }

        const posts =
            await response.json();


        const userPosts =
            posts.filter(
                post =>
                    String(post.userId) ===
                    String(selectedUserId)
            );


        document.getElementById(
            "postCount"
        ).textContent =
            userPosts.length;

    } catch (error) {

        console.error(
            "Post count error:",
            error
        );

        document.getElementById(
            "postCount"
        ).textContent = "0";
    }
}


// =====================================================
// HOBBY ICON
// =====================================================

function getHobbyIcon(category) {

    const value =
        (category || "").toLowerCase();


    if (value.includes("creative")) {
        return "🎨";
    }

    if (value.includes("photography")) {
        return "📸";
    }

    if (value.includes("technology")) {
        return "💻";
    }

    if (value.includes("reading")) {
        return "📚";
    }

    if (value.includes("music")) {
        return "🎵";
    }

    if (value.includes("food")) {
        return "🍳";
    }

    return "🎯";
}


// =====================================================
// COMMUNITY ICON
// =====================================================

function getCommunityIcon(category) {

    const value =
        (category || "").toLowerCase();


    if (value.includes("creative")) {
        return "🎨";
    }

    if (value.includes("technology")) {
        return "💻";
    }

    if (value.includes("reading")) {
        return "📚";
    }

    if (
        value.includes("music") ||
        value.includes("entertainment")
    ) {
        return "🎵";
    }

    if (value.includes("food")) {
        return "🍳";
    }

    return "👥";
}


// =====================================================
// SECURITY
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

loadProfile();