const adminUser = sessionStorage.getItem("adminUser");

if (!adminUser) {
    window.location.href = "../admin-login/index.html";
}

const totalUsers = document.getElementById("totalUsers");
const totalCommunities =
    document.getElementById("totalCommunities");
const totalPosts =
    document.getElementById("totalPosts");
const totalReports =
    document.getElementById("totalReports");


async function loadDashboardData() {

    try {

        const usersResponse = await fetch(
            "http://localhost:8080/api/users"
        );

        if (usersResponse.ok) {

            const users =
                await usersResponse.json();

            totalUsers.textContent =
                users.length;
        }

    } catch (error) {

        console.error(
            "Users loading error:",
            error
        );
    }


    try {

        const communitiesResponse = await fetch(
            "http://localhost:8080/api/communities"
        );

        if (communitiesResponse.ok) {

            const communities =
                await communitiesResponse.json();

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

        const postsResponse = await fetch(
            "http://localhost:8080/api/posts"
        );

        if (postsResponse.ok) {

            const posts =
                await postsResponse.json();

            totalPosts.textContent =
                posts.length;
        }

    } catch (error) {

        console.error(
            "Posts loading error:",
            error
        );
    }


    try {

        const reportsResponse = await fetch(
            "http://localhost:8080/api/reports"
        );

        if (reportsResponse.ok) {

            const reports =
                await reportsResponse.json();

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


document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "adminUser"
            );

            sessionStorage.removeItem(
                "adminEmail"
            );

            window.location.href =
                "../admin-login/index.html";
        }
    );


loadDashboardData();