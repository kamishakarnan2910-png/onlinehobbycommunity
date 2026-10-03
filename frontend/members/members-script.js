const membersContainer =
    document.getElementById("membersContainer");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const noResult =
    document.getElementById("noResult");

const message =
    document.getElementById("message");

let allUsers = [];


// =====================================================
// LOAD USERS
// =====================================================

async function loadUsers() {

    try {

        message.textContent =
            "Loading users...";


        const response =
            await fetch(
                "https://onlinehobbycommunity-1.onrender.com/api/users"
            );


        if (!response.ok) {

            throw new Error(
                "Server error: " +
                response.status
            );
        }


        allUsers =
            await response.json();


        message.textContent =
            "";


        displayUsers(
            allUsers
        );


    } catch (error) {

        console.error(
            "Users loading error:",
            error
        );


        message.textContent =
            "Unable to load users from backend.";


        membersContainer.innerHTML =
            "";
    }
}


// =====================================================
// DISPLAY USERS
// =====================================================

function displayUsers(users) {

    membersContainer.innerHTML =
        "";


    if (
        users.length ===
        0
    ) {

        noResult.style.display =
            "block";

        return;
    }


    noResult.style.display =
        "none";


    users.forEach(
        function(user) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "member-card";


            const userName =
                user.name ||
                "Unknown User";


            const firstLetter =
                userName
                    .charAt(0)
                    .toUpperCase();


            card.innerHTML = `

                <div class="member-info">

                    <div class="member-icon">
                        ${escapeHtml(
                            firstLetter
                        )}
                    </div>

                    <div>

                        <h3>
                            ${escapeHtml(
                                userName
                            )}
                        </h3>

                        <p>
                            ${escapeHtml(
                                user.email ||
                                "-"
                            )}
                        </p>

                        <small>
                            User ID:
                            ${escapeHtml(
                                user.id ||
                                "-"
                            )}
                        </small>

                    </div>

                </div>


                <button
                    class="view-button"
                    type="button">

                    View Profile

                </button>

            `;


            const viewButton =
                card.querySelector(
                    ".view-button"
                );


            viewButton.addEventListener(
                "click",
                function() {

                    viewProfile(
                        user.id
                    );
                }
            );


            membersContainer.appendChild(
                card
            );
        }
    );
}


// =====================================================
// SEARCH MEMBERS
// =====================================================

function searchMembers() {

    const searchText =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const filteredUsers =
        allUsers.filter(
            function(user) {

                const name =
                    (
                        user.name ||
                        ""
                    )
                    .toLowerCase();


                const email =
                    (
                        user.email ||
                        ""
                    )
                    .toLowerCase();


                return (
                    name.includes(
                        searchText
                    ) ||
                    email.includes(
                        searchText
                    )
                );
            }
        );


    displayUsers(
        filteredUsers
    );
}


// =====================================================
// VIEW OTHER USER PROFILE
// =====================================================

function viewProfile(userId) {

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
        String(userId).trim();


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
// HTML SECURITY
// =====================================================

function escapeHtml(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value == null
            ? ""
            : String(value);


    return div.innerHTML;
}


// =====================================================
// SEARCH BUTTON
// =====================================================

if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchMembers
    );
}


// =====================================================
// SEARCH INPUT
// =====================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchMembers
    );
}


// =====================================================
// BACK BUTTON
// =====================================================

const backButton =
    document.getElementById(
        "backButton"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "../admin-dashboard/index.html";

        }
    );
}


// =====================================================
// START
// =====================================================

loadUsers();