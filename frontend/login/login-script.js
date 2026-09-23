const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (email === "") {
        message.textContent = "Please enter your email.";
        message.style.color = "#d14b5a";
        return;
    }

    if (!passwordPattern.test(password)) {
        message.textContent =
            "Password must contain 8+ characters, uppercase, lowercase, number and special character.";
        message.style.color = "#d14b5a";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/users/login",
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

        if (response.ok) {

            localStorage.setItem("loginEmail", email);

            message.textContent =
                "OTP sent to your email.";
            message.style.color = "#5c9b65";

            setTimeout(function () {
                window.location.href = "../otp/otp.html";
            }, 1000);

        } else {

            message.textContent = result;
            message.style.color = "#d14b5a";
        }

    } catch (error) {

        message.textContent =
            "Unable to connect to the server.";
        message.style.color = "#d14b5a";

        console.error(error);
    }

});