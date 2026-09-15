const communityForm = document.getElementById("communityForm");

communityForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("communityName").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const type = document.getElementById("communityType").value;

    if (name.length < 3) {
        alert("Community name must contain at least 3 characters.");
        return;
    }

    if (description.length < 10) {
        alert("Please enter a description with at least 10 characters.");
        return;
    }

    if (category === "") {
        alert("Please select a hobby category.");
        return;
    }

    if (type === "") {
        alert("Please select the community type.");
        return;
    }

    alert("Community created successfully! 🎉");

    window.location.href = "../community/community.html";
});