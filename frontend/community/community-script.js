const searchInput = document.getElementById("communitySearch");
const categoryButtons = document.querySelectorAll(".category");
const cards = document.querySelectorAll(".community-card");
const noResults = document.getElementById("noResults");

let selectedCategory = "all";

function filterCommunities() {

    const searchText = searchInput.value.toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {

        const name = card.dataset.name.toLowerCase();
        const category = card.dataset.category;

        const matchesSearch = name.includes(searchText);
        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    noResults.style.display =
        visibleCount === 0 ? "block" : "none";
}

searchInput.addEventListener("input", filterCommunities);

categoryButtons.forEach(button => {

    button.addEventListener("click", function () {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        selectedCategory = this.dataset.category;

        filterCommunities();
    });
});

document.querySelectorAll(".join-btn").forEach(button => {

    button.addEventListener("click", function () {

        if (this.classList.contains("joined")) {
            this.textContent = "Join";
            this.classList.remove("joined");
        } else {
            this.textContent = "Joined ✓";
            this.classList.add("joined");
        }
    });
});