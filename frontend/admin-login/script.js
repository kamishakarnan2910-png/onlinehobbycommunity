const form = document.getElementById("adminLoginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Checking admin login...";

    try {

        const response = await fetch(
            "http://localhost:8080/api/users/admin-login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        const result = await response.text();

        if (!response.ok) {

            message.textContent = result;

            return;
        }

        if (result === "Admin OTP sent to your email.") {

            sessionStorage.setItem(
                "adminEmail",
                email
            );

            window.location.href =
                "../admin-otp/index.html";

        } else {

            message.textContent = result;
        }

    } catch (error) {

        message.textContent =
            "Unable to connect to backend.";

        console.error(error);
    }
});