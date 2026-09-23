const form = document.getElementById("otpForm");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const otp = document.getElementById("otp").value.trim();
    const email = localStorage.getItem("loginEmail");
    const message = document.getElementById("message");

    if (!email) {
        message.textContent = "Login email not found.";
        message.style.color = "#d14b5a";
        return;
    }

    if (!/^\d{6}$/.test(otp)) {
        message.textContent = "Please enter a valid 6-digit OTP.";
        message.style.color = "#d14b5a";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/users/verify-otp",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    otp: otp
                })
            }
        );

        const result = await response.text();

        if (response.ok) {

            const user = JSON.parse(result);

            localStorage.setItem("userId", user.id);
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("userRole", user.role);

            message.textContent =
                "OTP verified successfully!";
            message.style.color = "#5c9b65";

            setTimeout(function () {

                if (user.role === "ADMIN") {

                    window.location.href =
                        "../admin-dashboard/index.html";

                } else {

                    window.location.href =
                        "../home/home.html";
                }

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