const questions = document.querySelectorAll(".faq-question");
const searchInput = document.getElementById("faqSearch");
const faqCards = document.querySelectorAll(".faq-card");
const noResults = document.getElementById("noResults");

questions.forEach(question => {

    question.addEventListener("click", function() {

        const card = this.parentElement;

        card.classList.toggle("active");

        const icon = this.querySelector("span");

        if (card.classList.contains("active")) {
            icon.textContent = "−";
        } else {
            icon.textContent = "+";
        }

    });

});

searchInput.addEventListener("input", function() {

    const searchText = this.value.toLowerCase();

    let visibleCount = 0;

    faqCards.forEach(card => {

        const text = card.textContent.toLowerCase();

        if (text.includes(searchText)) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }

    });

    noResults.style.display =
        visibleCount === 0 ? "block" : "none";

});