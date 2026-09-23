const form = document.getElementById("profileForm");

const nameInput = document.getElementById("name");
const usernameInput = document.getElementById("username");

const avatar = document.getElementById("avatar");
const previewName = document.getElementById("previewName");
const previewUsername = document.getElementById("previewUsername");


nameInput.addEventListener("input", function() {

    const name = nameInput.value.trim();

    previewName.textContent =
        name || "Your Name";

    avatar.textContent =
        name ? name.charAt(0).toUpperCase() : "A";
});


usernameInput.addEventListener("input", function() {

    const username = usernameInput.value.trim();

    previewUsername.textContent =
        username ? "@" + username : "@username";
});


form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const username = usernameInput.value.trim();
    const location = document.getElementById("location").value.trim();
    const education = document.getElementById("education").value.trim();
    const bio = document.getElementById("bio").value.trim();

    const hobbies = [];

    document
        .querySelectorAll(".hobby-option input:checked")
        .forEach(function(item) {
            hobbies.push(item.value);
        });


    if (name === "" || username === "") {

        showMessage(
            "Please enter your name and username.",
            "#d14b5a"
        );

        return;
    }


    const profileData = {
        name: name,
        username: username,
        location: location,
        education: education,
        bio: bio,
        hobbies: hobbies
    };


    localStorage.setItem(
        "hobbyHubProfile",
        JSON.stringify(profileData)
    );


    showMessage(
        "Profile saved successfully! ✓",
        "#5c9b65"
    );


    setTimeout(function() {

        window.location.href =
            "../profile/profile.html";

    }, 1200);

});


function showMessage(text, color) {

    const message =
        document.getElementById("message");

    message.textContent = text;
    message.style.color = color;
}


function cancelEdit() {

    window.location.href =
        "../profile/profile.html";
}


function loadProfile() {

    const savedProfile =
        localStorage.getItem("hobbyHubProfile");

    if (!savedProfile) {
        return;
    }


    const profile =
        JSON.parse(savedProfile);


    nameInput.value =
        profile.name || "";

    usernameInput.value =
        profile.username || "";

    document.getElementById("location").value =
        profile.location || "";

    document.getElementById("education").value =
        profile.education || "";

    document.getElementById("bio").value =
        profile.bio || "";


    document
        .querySelectorAll(".hobby-option input")
        .forEach(function(item) {

            item.checked =
                profile.hobbies &&
                profile.hobbies.includes(item.value);

        });


    previewName.textContent =
        profile.name || "Your Name";

    previewUsername.textContent =
        profile.username
            ? "@" + profile.username
            : "@username";

    avatar.textContent =
        profile.name
            ? profile.name.charAt(0).toUpperCase()
            : "A";
}


loadProfile();