function toggleJoin() {

    const button =
        document.getElementById("joinButton");

    if (button.textContent.includes("Joined")) {

        button.textContent = "Join Community";

        button.style.background =
            "linear-gradient(135deg, #7540c8, #a76be5)";

        button.style.color = "white";

    } else {

        button.textContent = "✓ Joined";

        button.style.background = "#dff3e4";

        button.style.color = "#4d8b5a";
    }
}


function searchMembers() {

    const searchText =
        document.getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    const members =
        document.querySelectorAll(".member-card");

    let found = false;

    members.forEach(function(member) {

        const text =
            member.textContent.toLowerCase();

        if (text.includes(searchText)) {

            member.style.display = "flex";
            found = true;

        } else {

            member.style.display = "none";
        }
    });


    document.getElementById("noResult").style.display =
        found ? "none" : "block";
}


function viewProfile(name) {

    alert(
        "Opening " + name + "'s profile.\n" +
        "Profile details will be connected to the backend later."
    );
}