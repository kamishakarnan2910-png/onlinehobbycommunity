const form = document.getElementById("reportForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const postId =
        Number(document.getElementById("postId").value);

    const reason =
        document.getElementById("reason").value;

    const description =
        document.getElementById("description").value.trim();

    const userData =
        sessionStorage.getItem("user");

    let reporterId = 1;

    if (userData) {

        try {

            const user =
                JSON.parse(userData);

            if (user.id) {
                reporterId = user.id;
            }

        } catch (error) {

            console.error(
                "User data error:",
                error
            );
        }
    }

    message.textContent =
        "Submitting report...";

    try {

        const response = await fetch(
            "http://localhost:8080/api/reports",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    reporterId: reporterId,
                    postId: postId,
                    reason: reason,
                    description: description,
                    status: "PENDING"
                })
            }
        );

        if (!response.ok) {

            message.textContent =
                "Unable to submit report.";

            return;
        }

        const result =
            await response.json();

        message.textContent =
            "Report submitted successfully!";

        form.reset();

        console.log("Report:", result);

    } catch (error) {

        message.textContent =
            "Unable to connect to backend.";

        console.error(error);
    }
});