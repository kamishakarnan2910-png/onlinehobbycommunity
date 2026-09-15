const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (email === "") {
        alert("Please enter your email.");
        return;
    }

    const passwordPattern =
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

    if (!passwordPattern.test(password)) {
        alert(
            "Password must contain at least 8 characters, one capital letter, one number, and one special symbol."
        );
        return;
    }

    alert("Login successful!");

    window.location.href = "../home/home.html";
});