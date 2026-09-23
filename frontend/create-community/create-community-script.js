const communityForm = document.getElementById("communityForm");

communityForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name =
        document.getElementById("communityName").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const category =
        document.getElementById("category").value;

    const communityData = {
        name: name,
        description: description,
        category: category,
        createdBy: 1
    };

    try {

        const response = await fetch(
            "http://localhost:8080/api/communities",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(communityData)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to create community");
        }

        const createdCommunity =
            await response.json();

        alert("Community created successfully! ✨");

        console.log(createdCommunity);

        window.location.href =
            "../community/community.html";

    } catch (error) {

        console.error(error);

        alert(
            "Unable to create community. Please make sure the backend is running."
        );

    }

});