const adminUser = sessionStorage.getItem("adminUser");

if (!adminUser) {
    window.location.href = "../admin-login/index.html";
}

const totalUsers =
    document.getElementById("totalUsers");

const totalCommunities =
    document.getElementById("totalCommunities");

const totalPosts =
    document.getElementById("totalPosts");

const totalReports =
    document.getElementById("totalReports");

const contactMessagesContainer =
    document.getElementById("contactMessagesContainer");


// ===============================
// DASHBOARD DATA
// ===============================

async function loadDashboardData() {

    try {
        const response = await fetch(
            "http://localhost:8080/api/users"
        );

        if (response.ok) {
            const users = await response.json();
            totalUsers.textContent = users.length;
        }

    } catch (error) {
        console.error("Users loading error:", error);
    }


    try {
        const response = await fetch(
            "http://localhost:8080/api/communities"
        );

        if (response.ok) {
            const communities = await response.json();
            totalCommunities.textContent =
                communities.length;
        }

    } catch (error) {
        console.error(
            "Communities loading error:",
            error
        );
    }


    try {
        const response = await fetch(
            "http://localhost:8080/api/posts"
        );

        if (response.ok) {
            const posts = await response.json();
            totalPosts.textContent = posts.length;
        }

    } catch (error) {
        console.error("Posts loading error:", error);
    }


    try {
        const response = await fetch(
            "http://localhost:8080/api/reports"
        );

        if (response.ok) {
            const reports = await response.json();
            totalReports.textContent =
                reports.length;
        }

    } catch (error) {
        console.error(
            "Reports loading error:",
            error
        );
    }
}


// ===============================
// CONTACT MESSAGES
// ===============================

async function loadContactMessages() {

    if (!contactMessagesContainer) {
        return;
    }

    contactMessagesContainer.innerHTML = `
        <p>Loading contact messages...</p>
    `;

    try {

        const response = await fetch(
            "http://localhost:8080/api/contact"
        );

        if (!response.ok) {
            throw new Error(
                "Unable to load contact messages"
            );
        }

        const messages = await response.json();

        if (!messages || messages.length === 0) {

            contactMessagesContainer.innerHTML = `
                <div class="empty-messages">
                    <h3>No contact messages</h3>
                    <p>
                        No users have sent a message yet.
                    </p>
                </div>
            `;

            return;
        }

        contactMessagesContainer.innerHTML = "";

        messages
            .slice()
            .reverse()
            .forEach(function(message) {

                const card =
                    document.createElement("div");

                card.className =
                    "contact-message-card";

                const name =
                    message.name || "Unknown User";

                const email =
                    message.email || "No email";

                const subject =
                    message.subject || "No subject";

                const content =
                    message.message || "";

                const status =
                    message.status || "NEW";

                const createdAt =
                    message.createdAt
                        ? new Date(
                            message.createdAt
                        ).toLocaleString()
                        : "";

                card.innerHTML = `

                    <div class="contact-message-header">

                        <div>
                            <h3>
                                ${escapeHtml(name)}
                            </h3>

                            <p>
                                ${escapeHtml(email)}
                            </p>
                        </div>

                        <span class="message-status">
                            ${escapeHtml(status)}
                        </span>

                    </div>

                    <div class="contact-message-body">

                        <h4>
                            ${escapeHtml(subject)}
                        </h4>

                        <p>
                            ${escapeHtml(content)}
                        </p>

                    </div>

                    <div class="contact-message-footer">

                        <span>
                            ${escapeHtml(createdAt)}
                        </span>

                        <button
                            class="delete-contact-button"
                            onclick="deleteContactMessage(${message.id})">
                            Delete
                        </button>

                    </div>
                `;

                contactMessagesContainer.appendChild(card);
            });

    } catch (error) {

        console.error(
            "Contact messages loading error:",
            error
        );

        contactMessagesContainer.innerHTML = `
            <div class="empty-messages">

                <h3>
                    Unable to load messages
                </h3>

                <p>
                    Please make sure the backend is running.
                </p>

            </div>
        `;
    }
}


// ===============================
// DELETE MESSAGE
// ===============================

async function deleteContactMessage(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/contact/" + id,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Unable to delete message"
            );
        }

        await loadContactMessages();

    } catch (error) {

        console.error(
            "Delete contact message error:",
            error
        );

        alert(
            "Unable to delete the message."
        );
    }
}


// ===============================
// HTML SECURITY
// ===============================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;
}


// ===============================
// NAVIGATION
// ===============================

const navItems =
    document.querySelectorAll(".nav-item");

navItems.forEach(function(item) {

    item.addEventListener("click", function() {

        const text =
            item.textContent.trim();

        if (text === "Dashboard") {
            window.location.href =
                "../admin-dashboard/index.html";
        }

        if (text === "Users") {
            window.location.href =
                "../members/members.html";
        }

        if (text === "Communities") {
            window.location.href =
                "../community/community.html";
        }

        if (text === "Posts") {
            window.location.href =
                "../posts/posts.html";
        }

        if (text === "Reports") {
            window.location.href =
                "../admin-reports/index.html";
        }
    });
});


// ===============================
// QUICK ACTIONS
// ===============================

const actionCards =
    document.querySelectorAll(".action-card");

actionCards.forEach(function(card) {

    card.addEventListener("click", function() {

        const text =
            card
                .querySelector("strong")
                .textContent
                .trim();

        if (text === "Manage Users") {
            window.location.href =
                "../members/members.html";
        }

        if (text === "Manage Communities") {
            window.location.href =
                "../community/community.html";
        }

        if (text === "Manage Posts") {
            window.location.href =
                "../posts/posts.html";
        }

        if (text === "Manage Reports") {
            window.location.href =
                "../admin-reports/index.html";
        }
    });
});


// ===============================
// LOGOUT
// ===============================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        sessionStorage.removeItem("adminUser");
        sessionStorage.removeItem("adminEmail");

        window.location.href =
            "../admin-login/index.html";
    });
}


// ===============================
// START
// ===============================

loadDashboardData();
loadContactMessages();