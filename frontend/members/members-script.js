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


async function loadUsers() {

    try {

        message.textContent = "Loading users...";

        const response = await fetch(
            "http://localhost:8080/api/users"
        );

        if (!response.ok) {
            throw new Error(
                "Server error: " + response.status
            );
        }

        allUsers = await response.json();

        message.textContent = "";

        displayUsers(allUsers);

    } catch (error) {

        console.error("Users loading error:", error);

        message.textContent =
            "Unable to load users from backend.";

        membersContainer.innerHTML = "";
    }
}


function displayUsers(users) {

    membersContainer.innerHTML = "";

    if (users.length === 0) {

        noResult.style.display = "block";

        return;
    }

    noResult.style.display = "none";


    users.forEach(function(user) {

        const card =
            document.createElement("div");

        card.className = "member-card";


        card.innerHTML = `

            <div class="member-info">

                <div class="member-icon">
                    ${(user.name || "U")
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div>

                    <h3>
                        ${user.name || "Unknown User"}
                    </h3>

                    <p>
                        ${user.email || "-"}
                    </p>

                    <small>
                        User ID: ${user.id || "-"}
                    </small>

                </div>

            </div>


            <button
                class="view-button"
                onclick="viewProfile(${user.id})">

                View / Manage

            </button>

        `;


        membersContainer.appendChild(card);

    });
}


function searchMembers() {

    const searchText =
        searchInput.value
        .toLowerCase()
        .trim();


    const filteredUsers =
        allUsers.filter(function(user) {

            const name =
                (user.name || "")
                .toLowerCase();

            const email =
                (user.email || "")
                .toLowerCase();

            return (
                name.includes(searchText) ||
                email.includes(searchText)
            );

        });


    displayUsers(filteredUsers);
}


function viewProfile(userId) {

    sessionStorage.setItem(
        "selectedUserId",
        userId
    );


    window.location.href =
        "../profile/profile.html";
}


if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchMembers
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchMembers
    );

}


const backButton =
    document.getElementById("backButton");


if (backButton) {

    backButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "../admin-dashboard/index.html";

        }
    );

}


loadUsers();