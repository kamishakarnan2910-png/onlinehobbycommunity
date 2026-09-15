const joinButtons = document.querySelectorAll(".card-bottom button");

joinButtons.forEach(button => {

    button.addEventListener("click", function() {

        if (this.textContent === "Join") {

            this.textContent = "Joined ✓";

            this.style.background = "#713dcc";
            this.style.color = "white";

        }

    });

});