const form = document.getElementById("registerForm");

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const terms = document.getElementById("terms").checked;
    const message = document.getElementById("message");

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

    if (name === "") {
        message.textContent = "Please enter your name.";
        message.style.color = "#d14b5a";
        return;
    }

    if (!passwordPattern.test(password)) {
        message.textContent =
            "Password must contain 8+ characters, uppercase, lowercase, number and special character.";
        message.style.color = "#d14b5a";
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        message.style.color = "#d14b5a";
        return;
    }

    if (!terms) {
        message.textContent =
            "Please accept the Terms & Conditions.";
        message.style.color = "#d14b5a";
        return;
    }

    try {

        const response = await fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        if (response.ok) {

            message.textContent =
                "Registration successful! Redirecting to login...";
            message.style.color = "#5c9b65";

            setTimeout(function() {
                window.location.href = "../login/login.html";
            }, 1000);

        } else {

            const errorText = await response.text();

            if (errorText.includes("Duplicate") ||
                errorText.includes("duplicate")) {

                message.textContent =
                    "This email is already registered.";

            } else {

                message.textContent =
                    "Registration failed. Please try again.";
            }

            message.style.color = "#d14b5a";
        }

    } catch (error) {

        message.textContent =
            "Unable to connect to the server.";
        message.style.color = "#d14b5a";

        console.error(error);
    }

});