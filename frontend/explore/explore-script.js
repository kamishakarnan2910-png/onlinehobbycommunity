const searchInput =
    document.getElementById("searchInput");

const categories =
    document.querySelectorAll(".category");

const cards =
    document.querySelectorAll(".hobby-card");

const noResults =
    document.getElementById("noResults");

const resultCount =
    document.getElementById("resultCount");

let selectedCategory = "all";


function filterHobbies() {

    const search =
        searchInput.value.toLowerCase().trim();

    let visibleCount = 0;


    cards.forEach(card => {

        const name =
            card.dataset.name.toLowerCase();

        const category =
            card.dataset.category;


        const matchesSearch =
            name.includes(search);

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


    resultCount.textContent =
        visibleCount + " hobbies";


    if (visibleCount === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }

}


// Search

searchInput.addEventListener(
    "input",
    filterHobbies
);


// Categories

categories.forEach(category => {

    category.addEventListener("click", function() {

        categories.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

        selectedCategory =
            this.dataset.category;

        filterHobbies();

    });

});


// Join buttons

document.querySelectorAll(".info button")
.forEach(button => {

    button.addEventListener("click", function() {

        if (this.textContent === "Join") {

            this.textContent = "Joined ✓";

            this.style.background = "#713dcc";
            this.style.color = "white";

        }

    });

});