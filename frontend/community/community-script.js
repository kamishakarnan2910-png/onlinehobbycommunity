const communityGrid = document.querySelector(".community-grid");
const searchInput = document.getElementById("communitySearch");
const categories = document.querySelectorAll(".category");
const noResults = document.getElementById("noResults");

let communities = [];
let selectedCategory = "all";

const currentUserId = 1;


// Load communities from backend
async function loadCommunities() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/communities"
        );

        if (!response.ok) {
            throw new Error("Failed to load communities");
        }

        communities = await response.json();

        displayCommunities();

    } catch (error) {

        console.error("Load error:", error);

        communityGrid.innerHTML = "";

        noResults.style.display = "block";

        noResults.innerHTML = `
            <h3>Unable to load communities 🔍</h3>
            <p>Please make sure the backend is running.</p>
        `;
    }
}


// Display communities
function displayCommunities() {

    const search =
        searchInput.value.toLowerCase().trim();


    const filteredCommunities =
        communities.filter(community => {

            const name =
                (community.name || "").toLowerCase();

            const category =
                (community.category || "").toLowerCase();

            const matchesSearch =
                name.includes(search);

            const matchesCategory =
                selectedCategory === "all" ||
                category ===
                selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });


    communityGrid.innerHTML = "";


    filteredCommunities.forEach(community => {

        const card =
            document.createElement("a");


        card.className =
            "community-card";


        // Send community ID to details page
        card.href =
            `../community-details/community-details.html?id=${community.id}`;


        card.dataset.name =
            community.name;


        card.dataset.category =
            community.category || "";


        card.innerHTML = `
            <div class="community-icon">
                👥
            </div>

            <h3>
                ${community.name}
            </h3>

            <p>
                ${community.description || "No description available."}
            </p>

            <div class="card-bottom">

                <span>
                    👥 0 members
                </span>

                <button
                    class="join-btn"
                    type="button">
                    Join
                </button>

            </div>
        `;


        communityGrid.appendChild(card);


        // Join button
        const joinButton =
            card.querySelector(".join-btn");


        joinButton.addEventListener(
            "click",
            async function(event) {

                event.preventDefault();
                event.stopPropagation();


                if (
                    joinButton.classList.contains("joined")
                ) {
                    return;
                }


                joinButton.disabled = true;

                joinButton.textContent =
                    "Joining...";


                try {

                    const response =
                        await fetch(
                            `http://localhost:8080/api/community-members/join?communityId=${community.id}&userId=${currentUserId}`,
                            {
                                method: "POST"
                            }
                        );


                    if (!response.ok) {

                        const errorText =
                            await response.text();

                        throw new Error(errorText);
                    }


                    joinButton.textContent =
                        "Joined ✓";


                    joinButton.classList.add(
                        "joined"
                    );


                } catch (error) {

                    console.error(
                        "Join error:",
                        error
                    );


                    joinButton.disabled =
                        false;

                    joinButton.textContent =
                        "Join";


                    alert(
                        "Unable to join community. Please try again."
                    );
                }

            }
        );

    });


    if (filteredCommunities.length === 0) {

        noResults.style.display =
            "block";

    } else {

        noResults.style.display =
            "none";
    }
}


// Search
searchInput.addEventListener(
    "input",
    displayCommunities
);


// Category filter
categories.forEach(category => {

    category.addEventListener(
        "click",
        function() {

            categories.forEach(item => {

                item.classList.remove("active");

            });


            this.classList.add("active");


            selectedCategory =
                this.dataset.category;


            displayCommunities();

        }
    );

});


// Start
loadCommunities();