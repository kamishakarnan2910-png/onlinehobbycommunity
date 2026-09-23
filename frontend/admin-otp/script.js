const form = document.getElementById("adminOtpForm");
const message = document.getElementById("message");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const email = sessionStorage.getItem("adminEmail");
    const otp = document.getElementById("otp").value.trim();

    if (!email) {

        message.textContent =
            "Admin email not found. Please login again.";

        return;
    }

    if (!/^\d{6}$/.test(otp)) {

        message.textContent =
            "Please enter a valid 6-digit OTP.";

        return;
    }

    message.textContent = "Verifying OTP...";

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

        const result = await response.json();

        if (!response.ok) {

            message.textContent =
                result.message ||
                "Invalid or expired OTP.";

            return;
        }

        if (
            result.role &&
            result.role.toUpperCase() === "ADMIN"
        ) {

            sessionStorage.setItem(
                "adminUser",
                JSON.stringify(result)
            );

            window.location.href =
                "../admin-dashboard/index.html";

        } else {

            message.textContent =
                "Access denied. Admin account required.";
        }

    } catch (error) {

        message.textContent =
            "Unable to connect to backend.";

        console.error(error);
    }
});