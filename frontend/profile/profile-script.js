```js
const urlParams =
    new URLSearchParams(
        window.location.search
    );

const urlUserId =
    urlParams.get("userId");

const loggedInUserId =
    localStorage.getItem("userId");

const selectedUserId =
    urlUserId ||
    sessionStorage.getItem("selectedUserId") ||
    loggedInUserId;

const API_BASE =
    "https://onlinehobbycommunity-1.onrender.com";

let currentProfileIsPrivate =
    false;


// =====================================================
// LOAD PROFILE
// =====================================================

async function loadProfile() {

    if (!loggedInUserId) {

        alert(
            "Please login first."
        );

        window.location.href =
            "../login/login.html";

        return;
    }


    if (!selectedUserId) {

        alert(
            "User profile not found."
        );

        return;
    }


    try {

        const userResponse =
            await fetch(
                `${API_BASE}/api/users/${encodeURIComponent(
                    selectedUserId
                )}`
            );


        if (!userResponse.ok) {

            throw new Error(
                "User not found"
            );
        }


        const user =
            await userResponse.json();


        const isOwner =
            String(
                selectedUserId
            ) ===
            String(
                loggedInUserId
            );


        setupProfileActions(
            isOwner
        );


        const profileResponse =
            await fetch(
                `${API_BASE}/api/profiles/${encodeURIComponent(
                    selectedUserId
                )}?viewerId=${encodeURIComponent(
                    loggedInUserId
                )}`
            );


        if (
            profileResponse.status ===
            403
        ) {

            currentProfileIsPrivate =
                true;


            showPrivateProfile(
                user
            );


            await loadFollowStatus();

            await loadFollowerCount();

            return;
        }


        if (!profileResponse.ok) {

            throw new Error(
                "Profile not found"
            );
        }


        const profile =
            await profileResponse.json();


        currentProfileIsPrivate =
            profile?.publicProfile ===
            false;


        const name =
            profile?.name ||
            user?.name ||
            "User";


        const profileName =
            document.getElementById(
                "profileName"
            );


        if (profileName) {

            profileName.textContent =
                name;
        }


        const profileImage =
            document.getElementById(
                "profileImage"
            );


        if (profileImage) {

            profileImage.textContent =
                name
                    .charAt(0)
                    .toUpperCase();
        }


        const profileBio =
            document.getElementById(
                "profileBio"
            );


        if (profileBio) {

            profileBio.textContent =
                profile?.bio ||
                "No bio added yet.";
        }


        const profileLocation =
            document.getElementById(
                "profileLocation"
            );


        if (profileLocation) {

            profileLocation.textContent =
                profile?.location
                    ? "📍 " +
                      profile.location
                    : "";
        }


        const profileEducation =
            document.getElementById(
                "profileEducation"
            );


        if (profileEducation) {

            profileEducation.textContent =
                profile?.education
                    ? "🎓 " +
                      profile.education
                    : "";
        }


        const profileUsername =
            document.getElementById(
                "profileUsername"
            );


        if (profileUsername) {

            profileUsername.textContent =
                profile?.username
                    ? "@" +
                      profile.username
                    : "";
        }


        await loadMyHobbies();


        await loadMyCommunities();


        await loadPostCount();


        await loadFollowerCount();


        if (!isOwner) {

            await loadFollowStatus();
        }


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        const profileName =
            document.getElementById(
                "profileName"
            );


        const profileBio =
            document.getElementById(
                "profileBio"
            );


        if (profileName) {

            profileName.textContent =
                "Unable to load profile";
        }


        if (profileBio) {

            profileBio.textContent =
                "Please try again.";
        }
    }
}


// =====================================================
// PROFILE ACTIONS
// =====================================================

function setupProfileActions(
    isOwner
) {

    const editButton =
        document.getElementById(
            "editProfileBtn"
        );


    const followButton =
        document.getElementById(
            "followBtn"
        );


    if (isOwner) {

        if (editButton) {

            editButton.style.display =
                "inline-block";
        }


        if (followButton) {

            followButton.style.display =
                "none";
        }


    } else {

        if (editButton) {

            editButton.style.display =
                "none";
        }


        if (followButton) {

            followButton.style.display =
                "inline-block";


            followButton.onclick =
                handleFollow;
        }
    }
}


// =====================================================
// FOLLOW STATUS
// =====================================================

async function loadFollowStatus() {

    if (
        !loggedInUserId ||
        String(
            selectedUserId
        ) ===
        String(
            loggedInUserId
        )
    ) {

        return;
    }


    const followButton =
        document.getElementById(
            "followBtn"
        );


    if (!followButton) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/api/follows/status?followerId=${encodeURIComponent(
                    loggedInUserId
                )}&followingId=${encodeURIComponent(
                    selectedUserId
                )}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load follow status"
            );
        }


        const status =
            await response.json();


        followButton.classList.remove(
            "following",
            "requested"
        );


        if (status.following) {

            followButton.textContent =
                "Following";


            followButton.classList.add(
                "following"
            );


        } else if (status.pending) {

            followButton.textContent =
                "Requested";


            followButton.classList.add(
                "requested"
            );


        } else {

            followButton.textContent =
                "Follow";
        }


    } catch (error) {

        console.error(
            "Follow status error:",
            error
        );
    }
}


// =====================================================
// FOLLOW / UNFOLLOW
// =====================================================

async function handleFollow() {

    const followButton =
        document.getElementById(
            "followBtn"
        );


    if (!followButton) {

        return;
    }


    const buttonText =
        followButton.textContent.trim();


    const isFollowing =
        buttonText ===
        "Following";


    const isRequested =
        buttonText ===
        "Requested";


    try {

        if (isFollowing) {

            const response =
                await fetch(
                    `${API_BASE}/api/follows?followerId=${encodeURIComponent(
                        loggedInUserId
                    )}&followingId=${encodeURIComponent(
                        selectedUserId
                    )}`,
                    {
                        method: "DELETE"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to unfollow"
                );
            }


            await loadFollowStatus();


            await loadFollowerCount();


            return;
        }


        if (isRequested) {

            return;
        }


        const response =
            await fetch(
                `${API_BASE}/api/follows?followerId=${encodeURIComponent(
                    loggedInUserId
                )}&followingId=${encodeURIComponent(
                    selectedUserId
                )}`,
                {
                    method: "POST"
                }
            );


        if (!response.ok) {

            const responseMessage =
                await response.text();


            throw new Error(
                responseMessage ||
                "Unable to follow"
            );
        }


        await loadFollowStatus();


        await loadFollowerCount();


    } catch (error) {

        console.error(
            "Follow error:",
            error
        );


        alert(
            error.message ||
            "Unable to follow this user."
        );
    }
}


// =====================================================
// FOLLOWER COUNT
// =====================================================

async function loadFollowerCount() {

    try {

        const response =
            await fetch(
                `${API_BASE}/api/follows/${encodeURIComponent(
                    selectedUserId
                )}/followers/count`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load follower count"
            );
        }


        const count =
            await response.json();


        const followerCount =
            document.getElementById(
                "followerCount"
            );


        if (followerCount) {

            followerCount.textContent =
                count;
        }


    } catch (error) {

        console.error(
            "Follower count error:",
            error
        );
    }
}


// =====================================================
// PRIVATE PROFILE
// =====================================================

function showPrivateProfile(
    user
) {

    const name =
        user?.name ||
        "User";


    const profileName =
        document.getElementById(
            "profileName"
        );


    if (profileName) {

        profileName.textContent =
            name;
    }


    const profileImage =
        document.getElementById(
            "profileImage"
        );


    if (profileImage) {

        profileImage.textContent =
            name
                .charAt(0)
                .toUpperCase();
    }


    const profileUsername =
        document.getElementById(
            "profileUsername"
        );


    if (profileUsername) {

        profileUsername.textContent =
            "";
    }


    const profileBio =
        document.getElementById(
            "profileBio"
        );


    if (profileBio) {

        profileBio.textContent =
            "🔒 This profile is private.";
    }


    const profileLocation =
        document.getElementById(
            "profileLocation"
        );


    if (profileLocation) {

        profileLocation.textContent =
            "Profile details are hidden";
    }


    const profileEducation =
        document.getElementById(
            "profileEducation"
        );


    if (profileEducation) {

        profileEducation.textContent =
            "";
    }


    const hobbyList =
        document.getElementById(
            "hobbyList"
        );


    if (hobbyList) {

        hobbyList.innerHTML = `
            <p>🔒 Private profile</p>
        `;
    }


    const communityList =
        document.getElementById(
            "communityList"
        );


    if (communityList) {

        communityList.innerHTML = `
            <p>🔒 Private profile</p>
        `;
    }


    const communityCount =
        document.getElementById(
            "communityCount"
        );


    if (communityCount) {

        communityCount.textContent =
            "—";
    }


    const postCount =
        document.getElementById(
            "postCount"
        );


    if (postCount) {

        postCount.textContent =
            "—";
    }
}


// =====================================================
// HOBBIES
// =====================================================

async function loadMyHobbies() {

    const hobbyList =
        document.getElementById(
            "hobbyList"
        );


    if (!hobbyList) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/api/user-hobbies/user/${encodeURIComponent(
                    selectedUserId
                )}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load hobbies"
            );
        }


        const userHobbies =
            await response.json();


        hobbyList.innerHTML =
            "";


        if (
            !userHobbies ||
            userHobbies.length === 0
        ) {

            hobbyList.innerHTML = `
                <p>No hobbies added yet.</p>
            `;

            return;
        }


        for (
            const userHobby
            of userHobbies
        ) {

            const hobbyResponse =
                await fetch(
                    `${API_BASE}/api/hobbies/${encodeURIComponent(
                        userHobby.hobbyId
                    )}`
                );


            if (!hobbyResponse.ok) {

                continue;
            }


            const hobby =
                await hobbyResponse.json();


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "hobby-card";


            const icon =
                document.createElement(
                    "span"
                );


            icon.textContent =
                getHobbyIcon(
                    hobby.category
                );


            const name =
                document.createElement(
                    "span"
                );


            name.textContent =
                hobby.name ||
                "Hobby";


            card.appendChild(
                icon
            );


            card.appendChild(
                name
            );


            hobbyList.appendChild(
                card
            );
        }


        if (
            !hobbyList.children.length
        ) {

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
// COMMUNITIES
// =====================================================

async function loadMyCommunities() {

    const communityList =
        document.getElementById(
            "communityList"
        );


    if (!communityList) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/api/community-members/user/${encodeURIComponent(
                    selectedUserId
                )}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load communities"
            );
        }


        const memberships =
            await response.json();


        communityList.innerHTML =
            "";


        if (
            !memberships ||
            memberships.length === 0
        ) {

            communityList.innerHTML = `
                <p>No joined communities yet.</p>
            `;


            const count =
                document.getElementById(
                    "communityCount"
                );


            if (count) {

                count.textContent =
                    "0";
            }


            return;
        }


        let displayedCount =
            0;


        for (
            const membership
            of memberships
        ) {

            const communityResponse =
                await fetch(
                    `${API_BASE}/api/communities/${encodeURIComponent(
                        membership.communityId
                    )}`
                );


            if (!communityResponse.ok) {

                continue;
            }


            const community =
                await communityResponse.json();


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "community-card";


            const icon =
                document.createElement(
                    "div"
                );


            icon.className =
                "community-icon";


            icon.textContent =
                getCommunityIcon(
                    community.category
                );


            const content =
                document.createElement(
                    "div"
                );


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                community.name ||
                "Community";


            const description =
                document.createElement(
                    "p"
                );


            description.textContent =
                community.description ||
                "No description available.";


            content.appendChild(
                title
            );


            content.appendChild(
                description
            );


            card.appendChild(
                icon
            );


            card.appendChild(
                content
            );


            card.style.cursor =
                "pointer";


            card.addEventListener(
                "click",
                function() {

                    window.location.href =
                        `../community-details/community-details.html?id=${encodeURIComponent(
                            community.id
                        )}`;
                }
            );


            communityList.appendChild(
                card
            );


            displayedCount++;
        }


        const communityCount =
            document.getElementById(
                "communityCount"
            );


        if (communityCount) {

            communityCount.textContent =
                displayedCount;
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
// POST COUNT
// =====================================================

async function loadPostCount() {

    try {

        const response =
            await fetch(
                `${API_BASE}/api/posts`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load posts"
            );
        }


        const posts =
            await response.json();


        const userPosts =
            posts.filter(
                function(post) {

                    return (
                        String(
                            post.userId
                        ) ===
                        String(
                            selectedUserId
                        )
                    );
                }
            );


        const postCount =
            document.getElementById(
                "postCount"
            );


        if (postCount) {

            postCount.textContent =
                userPosts.length;
        }


    } catch (error) {

        console.error(
            "Post count error:",
            error
        );
    }
}


// =====================================================
// HOBBY ICON
// =====================================================

function getHobbyIcon(
    category
) {

    const value =
        (
            category ||
            ""
        ).toLowerCase();


    if (
        value.includes(
            "creative"
        )
    ) {

        return "🎨";
    }


    if (
        value.includes(
            "photography"
        )
    ) {

        return "📸";
    }


    if (
        value.includes(
            "technology"
        )
    ) {

        return "💻";
    }


    if (
        value.includes(
            "reading"
        )
    ) {

        return "📚";
    }


    if (
        value.includes(
            "music"
        )
    ) {

        return "🎵";
    }


    if (
        value.includes(
            "food"
        )
    ) {

        return "🍳";
    }


    return "🎯";
}


// =====================================================
// COMMUNITY ICON
// =====================================================

function getCommunityIcon(
    category
) {

    const value =
        (
            category ||
            ""
        ).toLowerCase();


    if (
        value.includes(
            "creative"
        )
    ) {

        return "🎨";
    }


    if (
        value.includes(
            "technology"
        )
    ) {

        return "💻";
    }


    if (
        value.includes(
            "reading"
        )
    ) {

        return "📚";
    }


    if (
        value.includes("music") ||
        value.includes("entertainment")
    ) {

        return "🎵";
    }


    if (
        value.includes(
            "food"
        )
    ) {

        return "🍳";
    }


    return "👥";
}


// =====================================================
// FOLLOWERS
// =====================================================

async function loadFollowers() {

    try {

        const response =
            await fetch(
                `${API_BASE}/api/follows/${encodeURIComponent(
                    selectedUserId
                )}/followers`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load followers"
            );
        }


        const followers =
            await response.json();


        if (
            !followers ||
            followers.length === 0
        ) {

            alert(
                "No followers yet."
            );

            return;
        }


        const names = [];


        for (
            const follow
            of followers
        ) {

            try {

                const userResponse =
                    await fetch(
                        `${API_BASE}/api/users/${encodeURIComponent(
                            follow.followerId
                        )}`
                    );


                if (!userResponse.ok) {

                    continue;
                }


                const user =
                    await userResponse.json();


                names.push(
                    user.name ||
                    "User"
                );


            } catch (error) {

                console.error(
                    "Follower user error:",
                    error
                );
            }
        }


        alert(
            names.length
                ? "Followers:\n\n" +
                  names.join("\n")
                : "No follower information found."
        );


    } catch (error) {

        console.error(
            "Followers loading error:",
            error
        );


        alert(
            "Unable to load followers."
        );
    }
}


// =====================================================
// FOLLOWERS BUTTON
// =====================================================

const followersStat =
    document.getElementById(
        "followersStat"
    );


if (followersStat) {

    followersStat.addEventListener(
        "click",
        loadFollowers
    );
}


// =====================================================
// OPEN OTHER USER PROFILE
// =====================================================

function openUserProfile(
    userId
) {

    if (
        userId === null ||
        userId === undefined ||
        String(userId).trim() === ""
    ) {

        console.error(
            "User ID is missing."
        );

        return;
    }


    const targetUserId =
        String(
            userId
        ).trim();


    sessionStorage.setItem(
        "selectedUserId",
        targetUserId
    );


    window.location.href =
        `../profile/profile.html?userId=${encodeURIComponent(
            targetUserId
        )}`;
}


// =====================================================
// MAKE FUNCTION AVAILABLE TO OTHER PAGES
// =====================================================

window.openUserProfile =
    openUserProfile;


// =====================================================
// START PROFILE
// =====================================================

loadProfile();
```
