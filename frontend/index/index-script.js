const API_BASE_URL =
    "https://onlinehobbycommunity.onrender.com";


// ================================
// Smooth Scrolling
// ================================

document.querySelectorAll('a[href^="#"]').forEach(function(link) {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const target =
            document.querySelector(
                this.getAttribute("href")
            );

        if (target) {

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// ================================
// Load Page Data
// ================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadHobbies();
        loadCommunities();
        loadUsers();

    }
);


// ================================
// Load Hobbies
// ================================

async function loadHobbies() {

    const hobbyGrid =
        document.getElementById("hobbyGrid");

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/hobbies`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load hobbies"
            );

        }

        const hobbies =
            await response.json();


        // ================================
        // Hobby Count
        // ================================

        document.getElementById(
            "hobbyCount"
        ).textContent =
            hobbies.length;


        // ================================
        // No Hobbies
        // ================================

        if (
            !Array.isArray(hobbies) ||
            hobbies.length === 0
        ) {

            hobbyGrid.innerHTML = `
                <p>
                    No hobbies available.
                </p>
            `;

            return;

        }


        // ================================
        // Clear Old Cards
        // ================================

        hobbyGrid.innerHTML =
            "";


        // ================================
        // Create Hobby Cards
        // ================================

        hobbies.forEach(function(hobby) {

            const card =
                document.createElement("div");

            card.className =
                "hobby-card";


            // Entire card is clickable

            card.style.cursor =
                "pointer";


            card.addEventListener(
                "click",
                function() {

                    window.location.href =
                        "../register/register.html";

                }
            );


            // ================================
            // Hobby Image
            // ================================

            const imageContainer =
                document.createElement("div");

            imageContainer.className =
                "icon purple";


            if (hobby.imageUrl) {

                const image =
                    document.createElement("img");

                image.src =
                    hobby.imageUrl;

                image.alt =
                    hobby.name ||
                    "Hobby";

                image.style.width =
                    "100%";

                image.style.height =
                    "100%";

                image.style.objectFit =
                    "cover";

                image.style.borderRadius =
                    "inherit";


                imageContainer.appendChild(
                    image
                );

            }
            else {

                imageContainer.textContent =
                    "🎯";

            }


            // ================================
            // Hobby Name
            // ================================

            const title =
                document.createElement("h3");

            title.textContent =
                hobby.name ||
                "Hobby";


            // ================================
            // Hobby Description
            // ================================

            const description =
                document.createElement("p");

            description.textContent =
                hobby.description ||
                "Explore this hobby.";


            // ================================
            // Hobby Category
            // ================================

            const category =
                document.createElement("small");

            category.textContent =
                hobby.category ||
                "Hobby";


            // ================================
            // Add Elements To Card
            // ================================

            card.appendChild(
                imageContainer
            );

            card.appendChild(
                title
            );

            card.appendChild(
                description
            );

            card.appendChild(
                category
            );


            // Add card to grid

            hobbyGrid.appendChild(
                card
            );

        });


        // ================================
        // Popular Hobby
        // ================================

        const popularHobby =
            hobbies[0];


        if (popularHobby) {

            document.getElementById(
                "popularHobbyName"
            ).textContent =
                popularHobby.name ||
                "Hobby";


            document.getElementById(
                "popularHobbyDescription"
            ).textContent =
                popularHobby.description ||
                "Explore this hobby.";


            const popularIcon =
                document.getElementById(
                    "popularHobbyIcon"
                );


            if (popularHobby.imageUrl) {

                popularIcon.innerHTML = `
                    <img
                        src="${popularHobby.imageUrl}"
                        alt="${popularHobby.name || "Hobby"}"
                        style="
                            width:100%;
                            height:100%;
                            object-fit:cover;
                            border-radius:inherit;
                        "
                    >
                `;

            }

        }


        // ================================
        // Floating Hobby Cards
        // ================================

        if (hobbies.length > 1) {
    updateFloatingHobby(
        "floatingHobbyOne",
        hobbies[1]
    );
}

if (hobbies.length > 2) {
    updateFloatingHobby(
        "floatingHobbyTwo",
        hobbies[2]
    );
}

    }
    catch (error) {

        console.error(
            "Hobby loading error:",
            error
        );


        hobbyGrid.innerHTML = `
            <p>
                Unable to load hobbies.
            </p>
        `;

    }

}


// ================================
// Floating Hobby
// ================================

function updateFloatingHobby(
    elementId,
    hobby
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    if (!hobby) {

        element.style.display =
            "none";

        return;

    }


    element.innerHTML = `
        🎯
        <span>
            ${escapeHTML(
                hobby.name ||
                "Hobby"
            )}
        </span>
    `;

}


// ================================
// Load Communities
// ================================

async function loadCommunities() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/communities`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load communities"
            );

        }


        const communities =
            await response.json();


        document.getElementById(
            "communityCount"
        ).textContent =
            Array.isArray(communities)
                ? communities.length
                : 0;

    }
    catch (error) {

        console.error(
            "Community loading error:",
            error
        );


        document.getElementById(
            "communityCount"
        ).textContent =
            "0";

    }

}


// ================================
// Load Users
// ================================

async function loadUsers() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/users`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load users"
            );

        }


        const users =
            await response.json();


        document.getElementById(
            "memberCount"
        ).textContent =
            Array.isArray(users)
                ? users.length
                : 0;

    }
    catch (error) {

        console.error(
            "User loading error:",
            error
        );


        document.getElementById(
            "memberCount"
        ).textContent =
            "0";

    }

}


// ================================
// Escape HTML
// ================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}
