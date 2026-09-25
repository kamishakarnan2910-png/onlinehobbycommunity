const searchInput =
    document.getElementById("searchInput");

const categories =
    document.querySelectorAll(".category");

const hobbyGrid =
    document.getElementById("hobbyGrid");

const noResults =
    document.getElementById("noResults");

const resultCount =
    document.getElementById("resultCount");

let hobbies = [];
let communities = [];
let selectedCategory = "all";


async function loadHobbies() {

    try {

        hobbyGrid.innerHTML = `
            <div class="empty-posts">
                <h3>Loading hobbies...</h3>
                <p>Please wait.</p>
            </div>
        `;


        const hobbyResponse =
            await fetch(
                "http://localhost:8080/api/hobbies"
            );

        if (!hobbyResponse.ok) {
            throw new Error(
                "Failed to load hobbies"
            );
        }

        hobbies =
            await hobbyResponse.json();


        const communityResponse =
            await fetch(
                "http://localhost:8080/api/communities"
            );

        if (!communityResponse.ok) {
            throw new Error(
                "Failed to load communities"
            );
        }

        communities =
            await communityResponse.json();


        displayHobbies();

    } catch (error) {

        console.error(
            "Explore loading error:",
            error
        );

        hobbyGrid.innerHTML = `
            <div class="empty-posts">
                <h3>Unable to load hobbies</h3>
                <p>Please make sure the backend is running.</p>
            </div>
        `;

        resultCount.textContent =
            "0 hobbies";
    }
}


function findCommunityForHobby(hobby) {

    const hobbyName =
        (hobby.name || "")
            .trim()
            .toLowerCase();


    return communities.find(
        function(community) {

            const communityName =
                (community.name || "")
                    .trim()
                    .toLowerCase();


            return communityName === hobbyName;
        }
    );
}


function displayHobbies() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredHobbies =
        hobbies.filter(
            function(hobby) {

                const name =
                    (hobby.name || "")
                        .toLowerCase();


                const description =
                    (hobby.description || "")
                        .toLowerCase();


                const category =
                    (hobby.category || "")
                        .toLowerCase();


                const matchesSearch =
                    name.includes(search) ||
                    description.includes(search);


                const matchesCategory =
                    selectedCategory === "all" ||
                    category ===
                    selectedCategory.toLowerCase();


                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );


    hobbyGrid.innerHTML = "";


    filteredHobbies.forEach(
        function(hobby) {

            const card =
                document.createElement("div");

            card.className =
                "hobby-card";


            const image =
                document.createElement("div");

            image.className =
                "hobby-image";


            if (hobby.imageUrl) {

                image.style.backgroundImage =
                    `url("${hobby.imageUrl}")`;

                image.style.backgroundSize =
                    "cover";

                image.style.backgroundPosition =
                    "center";

            } else {

                image.textContent =
                    "🎨";
            }


            const title =
                document.createElement("h3");

            title.textContent =
                hobby.name ||
                "Untitled Hobby";


            const description =
                document.createElement("p");

            description.textContent =
                hobby.description ||
                "No description available.";


            const info =
                document.createElement("div");

            info.className =
                "info";


            const categoryText =
                document.createElement("span");

            categoryText.textContent =
                hobby.category ||
                "General";


            info.appendChild(
                categoryText
            );


            card.appendChild(image);

            card.appendChild(title);

            card.appendChild(description);

            card.appendChild(info);


            hobbyGrid.appendChild(card);


            const matchingCommunity =
                findCommunityForHobby(hobby);


            card.addEventListener(
                "click",
                function() {

                    if (!matchingCommunity) {

                        alert(
                            "Community for this hobby is not available yet."
                        );

                        return;
                    }


                    window.location.href =
                        `../community-details/community-details.html?id=${encodeURIComponent(matchingCommunity.id)}`;

                }
            );

        }
    );


    resultCount.textContent =
        filteredHobbies.length +
        " hobbies";


    if (filteredHobbies.length === 0) {

        noResults.style.display =
            "block";

    } else {

        noResults.style.display =
            "none";
    }
}


searchInput.addEventListener(
    "input",
    displayHobbies
);


categories.forEach(
    function(category) {

        category.addEventListener(
            "click",
            function() {

                categories.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                selectedCategory =
                    this.dataset.category;


                displayHobbies();

            }
        );

    }
);


loadHobbies();