const USER_ID = localStorage.getItem("userId");

const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

if (!USER_ID) {

    successMessage.textContent =
        "Please login first.";

    successMessage.style.color = "red";

} else {

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const message =
            document.getElementById("message").value.trim();

        if (!name || !email || !message) {

            successMessage.textContent =
                "Please fill all required fields.";

            successMessage.style.color = "red";

            return;
        }

        successMessage.textContent =
            "Sending message...";

        try {

            const response = await fetch(
                "http://localhost:8080/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId:
                            Number(USER_ID),

                        name:
                            name,

                        email:
                            email,

                        subject:
                            subject,

                        message:
                            message,

                        status:
                            "NEW"
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to send message"
                );
            }

            const result =
                await response.json();

            console.log(result);

            successMessage.textContent =
                "Message sent successfully! 💜";

            successMessage.style.color =
                "green";

            form.reset();

        } catch (error) {

            console.error(
                "Contact Us error:",
                error
            );

            successMessage.textContent =
                "Unable to connect to backend.";

            successMessage.style.color =
                "red";
        }
    });
}