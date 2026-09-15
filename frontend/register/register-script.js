const form = document.getElementById("registerForm");

form.addEventListener("submit", function(event) {

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
            "Password must meet all required conditions.";
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


    message.textContent = "Registration successful! Redirecting...";
    message.style.color = "#5c9b65";


    setTimeout(function() {
        window.location.href = "../verify/verify.html";
    }, 1000);

});