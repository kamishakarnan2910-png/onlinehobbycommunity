const loggedInUserId =
    localStorage.getItem("userId");

const selectedUserId =
    sessionStorage.getItem("selectedUserId") ||
    loggedInUserId;

const API_BASE =
    "http://localhost:8080/api";


const profileForm =
    document.getElementById("profileForm");

const message =
    document.getElementById("message");


// =====================================================
// OWNER CHECK
// =====================================================

if (
    !loggedInUserId ||
    String(selectedUserId) !==
    String(loggedInUserId)
) {

    alert(
        "You can edit only your own profile."
    );

    window.location.href =
        "../profile/profile.html";

    throw new Error(
        "Unauthorized profile edit attempt."
    );
}


// =====================================================
// LOAD PROFILE
// =====================================================

async function loadProfile() {

    try {

        const userResponse =
            await fetch(
                `${API_BASE}/users/${loggedInUserId}`
            );

        if (!userResponse.ok) {
            throw new Error("User not found");
        }

        const user =
            await userResponse.json();


        let profile = null;


        const profileResponse =
            await fetch(
                `${API_BASE}/profiles/${loggedInUserId}`
            );


        if (profileResponse.ok) {

            profile =
                await profileResponse.json();
        }


        const name =
            profile?.name ||
            user.name ||
            "";


        const username =
            profile?.username ||
            "";


        const location =
            profile?.location ||
            "";


        const education =
            profile?.education ||
            "";


        const bio =
            profile?.bio ||
            "";


        document.getElementById(
            "name"
        ).value =
            name;


        document.getElementById(
            "username"
        ).value =
            username;


        document.getElementById(
            "location"
        ).value =
            location;


        document.getElementById(
            "education"
        ).value =
            education;


        document.getElementById(
            "bio"
        ).value =
            bio;


        updatePreview();


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        message.textContent =
            "Unable to load profile.";

    }
}


// =====================================================
// PREVIEW
// =====================================================

function updatePreview() {

    const name =
        document.getElementById(
            "name"
        ).value.trim();


    const username =
        document.getElementById(
            "username"
        ).value.trim();


    document.getElementById(
        "previewName"
    ).textContent =
        name || "User";


    document.getElementById(
        "previewUsername"
    ).textContent =
        username
            ? "@" + username
            : "@username";


    document.getElementById(
        "avatar"
    ).textContent =
        (name || "U")
            .charAt(0)
            .toUpperCase();
}


// =====================================================
// SAVE PROFILE
// =====================================================

profileForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        if (!loggedInUserId) {

            message.textContent =
                "Please login first.";

            return;
        }


        const name =
            document.getElementById(
                "name"
            ).value.trim();


        const username =
            document.getElementById(
                "username"
            ).value.trim();


        const location =
            document.getElementById(
                "location"
            ).value.trim();


        const education =
            document.getElementById(
                "education"
            ).value.trim();


        const bio =
            document.getElementById(
                "bio"
            ).value.trim();


        if (!name || !username) {

            message.textContent =
                "Name and username are required.";

            return;
        }


        const profileData = {

            userId:
                Number(loggedInUserId),

            name:
                name,

            username:
                username,

            location:
                location,

            education:
                education,

            bio:
                bio
        };


        try {

            message.textContent =
                "Saving profile...";


            const response =
                await fetch(
                    `${API_BASE}/profiles`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                profileData
                            )
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Profile save failed"
                );
            }


            const savedProfile =
                await response.json();


            console.log(
                "Saved profile:",
                savedProfile
            );


            message.textContent =
                "Profile saved successfully ✓";


            updatePreview();


            setTimeout(
                function() {

                    window.location.href =
                        "../profile/profile.html";

                },
                800
            );


        } catch (error) {

            console.error(
                "Profile save error:",
                error
            );


            message.textContent =
                "Unable to save profile. Please try again.";

        }

    }
);


// =====================================================
// LIVE PREVIEW
// =====================================================

document.getElementById(
    "name"
).addEventListener(
    "input",
    updatePreview
);


document.getElementById(
    "username"
).addEventListener(
    "input",
    updatePreview
);


// =====================================================
// CANCEL
// =====================================================

document.getElementById(
    "cancelButton"
).addEventListener(
    "click",
    function() {

        window.location.href =
            "../profile/profile.html";

    }
);


// =====================================================
// START
// =====================================================

loadProfile();