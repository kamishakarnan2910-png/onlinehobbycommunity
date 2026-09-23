const USER_ID = 134;

const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    successMessage.textContent = "Sending message...";

    try {

        const response = await fetch(
            "http://localhost:8080/api/contact",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    userId: USER_ID,
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    status: "NEW"
                })
            }
        );

        if (!response.ok) {
            throw new Error("Unable to send message");
        }

        const result = await response.json();

        console.log(result);

        successMessage.textContent =
            "Message sent successfully! 💜";

        form.reset();

    } catch (error) {

        console.error("Contact Us error:", error);

        successMessage.textContent =
            "Unable to connect to backend.";
    }
});