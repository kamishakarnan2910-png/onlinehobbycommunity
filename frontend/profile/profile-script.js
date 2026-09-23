const USER_ID = 134;

async function loadProfile() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/profiles/" + USER_ID
        );

        if (!response.ok) {
            throw new Error("Profile not found");
        }

        const profile = await response.json();

        document.querySelector(".profile-info h1").textContent =
            profile.name || "My Profile";

        document.querySelector(".profile-image").textContent =
            (profile.name || "M").charAt(0).toUpperCase();

    } catch (error) {

        console.error("Profile loading error:", error);
    }
}


async function editProfile() {

    let name = prompt("Enter your name:");

    if (!name || name.trim() === "") {
        return;
    }

    name = name.trim();

    let bio = prompt(
        "Enter your bio:",
        "Welcome to my hobby profile!"
    );

    if (bio === null) {
        bio = "";
    }

    let location = prompt(
        "Enter your location:",
        "Thanjavur"
    );

    if (location === null) {
        location = "";
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/profiles",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    userId: USER_ID,
                    name: name,
                    bio: bio,
                    location: location,
                    profilePicture: null
                })
            }
        );

        if (!response.ok) {
            throw new Error("Unable to update profile");
        }

        const updatedProfile =
            await response.json();

        document.querySelector(".profile-info h1").textContent =
            updatedProfile.name;

        document.querySelector(".profile-image").textContent =
            updatedProfile.name
                .charAt(0)
                .toUpperCase();

        alert("Profile updated successfully!");

    } catch (error) {

        console.error("Profile update error:", error);

        alert("Unable to connect to backend.");
    }
}


loadProfile();