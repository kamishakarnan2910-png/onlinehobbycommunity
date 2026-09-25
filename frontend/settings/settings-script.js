const API_BASE = "http://localhost:8080/api";

const userId = localStorage.getItem("userId");

if (!userId) {
    alert("Please login first.");
    window.location.href = "../login/login.html";
}

async function loadUser() {
    try {
        const response = await fetch(`${API_BASE}/users/${userId}`);

        if (!response.ok) {
            throw new Error("User not found");
        }

        const user = await response.json();

        const emailElement =
            document.querySelector(".email-text");

        if (emailElement) {
            emailElement.textContent =
                user.email || "Email not available";
        }

    } catch (error) {
        console.error("User loading error:", error);

        const emailElement =
            document.querySelector(".email-text");

        if (emailElement) {
            emailElement.textContent =
                "Unable to load email";
        }
    }
}


async function loadSettings() {
    try {

        const settingsResponse =
            await fetch(`${API_BASE}/settings/${userId}`);

        if (!settingsResponse.ok) {
            throw new Error("Unable to load settings");
        }

        const settings =
            await settingsResponse.json();

        document.getElementById("communityNotify").checked =
            settings.communityNotifications !== false;

        document.getElementById("postNotify").checked =
            settings.postNotifications !== false;

        const theme =
            settings.theme || "light";

        document.getElementById("theme").value =
            theme;

        applyTheme(theme);


        const profileResponse =
            await fetch(
                `${API_BASE}/profiles/${userId}?viewerId=${userId}`
            );

        const publicProfileCheckbox =
            document.getElementById("publicProfile");

        if (profileResponse.ok) {

            const profile =
                await profileResponse.json();

            publicProfileCheckbox.checked =
                profile.publicProfile !== false;

        } else {

            publicProfileCheckbox.checked = true;
        }

    } catch (error) {

        console.error(
            "Settings loading error:",
            error
        );
    }
}


async function saveSettings() {

    const communityNotify =
        document.getElementById("communityNotify").checked;

    const postNotify =
        document.getElementById("postNotify").checked;

    const publicProfile =
        document.getElementById("publicProfile").checked;

    const theme =
        document.getElementById("theme").value;


    try {

        const settingsResponse =
            await fetch(`${API_BASE}/settings`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    userId: Number(userId),

                    communityNotifications:
                        communityNotify,

                    postNotifications:
                        postNotify,

                    theme:
                        theme
                })
            });


        if (!settingsResponse.ok) {
            throw new Error(
                "Unable to save settings"
            );
        }


        const profileResponse =
            await fetch(
                `${API_BASE}/profiles/${userId}?viewerId=${userId}`
            );


        let profile = null;


        if (profileResponse.ok) {

            profile =
                await profileResponse.json();
        }


        if (!profile) {

            profile = {

                userId: Number(userId),

                publicProfile:
                    publicProfile
            };

        } else {

            profile.publicProfile =
                publicProfile;
        }


        const saveProfileResponse =
            await fetch(`${API_BASE}/profiles`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(profile)
            });


        if (!saveProfileResponse.ok) {

            throw new Error(
                "Unable to save profile privacy"
            );
        }


        applyTheme(theme);


        const message =
            document.getElementById("saveMessage");


        if (message) {

            message.textContent =
                "Settings saved successfully! ✓";

            setTimeout(function() {

                message.textContent = "";

            }, 2500);
        }

    } catch (error) {

        console.error(
            "Settings save error:",
            error
        );

        const message =
            document.getElementById("saveMessage");

        if (message) {

            message.textContent =
                "Unable to save settings.";
        }
    }
}


function applyTheme(theme) {

    if (theme === "soft") {

        document.body.style.background =
            "linear-gradient(135deg, #f3eaff, #e4d5ff)";

    } else {

        document.body.style.background =
            "linear-gradient(135deg, #f7efff, #eee5ff)";
    }
}


const themeSelect =
    document.getElementById("theme");


if (themeSelect) {

    themeSelect.addEventListener(
        "change",
        function() {

            applyTheme(this.value);
        }
    );
}


function logout() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");

    if (!confirmLogout) {
        return;
    }

    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");

    sessionStorage.removeItem("selectedUserId");

    window.location.href =
        "../login/login.html";
}


loadUser();
loadSettings();