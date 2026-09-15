const codes = document.querySelectorAll(".code");
const form = document.getElementById("verifyForm");
const message = document.getElementById("message");
const resendBtn = document.getElementById("resendBtn");


// Move to next box automatically

codes.forEach((code, index) => {

    code.addEventListener("input", function() {

        this.value = this.value.replace(/\D/g, "");

        if (this.value && index < codes.length - 1) {
            codes[index + 1].focus();
        }

    });


    code.addEventListener("keydown", function(event) {

        if (
            event.key === "Backspace" &&
            !this.value &&
            index > 0
        ) {
            codes[index - 1].focus();
        }

    });

});


// Verify

form.addEventListener("submit", function(event) {

    event.preventDefault();

    let verificationCode = "";

    codes.forEach(code => {
        verificationCode += code.value;
    });


    if (verificationCode.length !== 6) {

        message.textContent =
            "Please enter the 6-digit verification code.";

        message.style.color = "#d14b5a";

        return;
    }


    message.textContent =
        "Email verified successfully!";

    message.style.color = "#5c9b65";


    setTimeout(function() {
        window.location.href = "../login/login.html";
    }, 1000);

});


// Resend code

resendBtn.addEventListener("click", function(event) {

    event.preventDefault();

    message.textContent =
        "A new verification code has been sent.";

    message.style.color = "#713dcc";

});