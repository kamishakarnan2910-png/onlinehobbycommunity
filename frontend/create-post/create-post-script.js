const form =
    document.getElementById("postForm");

const titleInput =
    document.getElementById("title");

const categoryInput =
    document.getElementById("category");

const contentInput =
    document.getElementById("content");

const communityIdInput =
    document.getElementById("communityId");

const currentUserId = 1;


// Get Community ID from URL
const urlParams =
    new URLSearchParams(window.location.search);

const communityIdFromURL =
    urlParams.get("communityId");


// Automatically put Community ID into the form
if (communityIdInput && communityIdFromURL) {

    communityIdInput.value =
        communityIdFromURL;

}


// Preview
titleInput.addEventListener(
    "input",
    updatePreview
);

categoryInput.addEventListener(
    "change",
    updatePreview
);

contentInput.addEventListener(
    "input",
    updatePreview
);


document
    .querySelectorAll(".topic-list input")
    .forEach(function(input) {

        input.addEventListener(
            "change",
            updatePreview
        );

    });


function updatePreview() {

    const title =
        titleInput.value.trim();

    const category =
        categoryInput.value;

    const content =
        contentInput.value.trim();


    document.getElementById(
        "previewTitle"
    ).textContent =
        title || "Your post title";


    document.getElementById(
        "previewCategory"
    ).textContent =
        category || "Category";


    document.getElementById(
        "previewContent"
    ).textContent =
        content ||
        "Your post content will appear here.";


    const previewTopics =
        document.getElementById(
            "previewTopics"
        );

    previewTopics.innerHTML = "";


    document
        .querySelectorAll(
            ".topic-list input:checked"
        )
        .forEach(function(topic) {

            const span =
                document.createElement("span");

            span.textContent =
                "#" + topic.value;

            previewTopics.appendChild(span);

        });
}


// Publish post
form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const title =
            titleInput.value.trim();

        const category =
            categoryInput.value;

        const content =
            contentInput.value.trim();


        const communityId =
            Number(
                communityIdFromURL ||
                communityIdInput.value
            );


        if (
            title === "" ||
            category === "" ||
            content === ""
        ) {

            showMessage(
                "Please fill in all required fields.",
                "#d14b5a"
            );

            return;
        }


        if (!communityId) {

            showMessage(
                "Community ID is missing.",
                "#d14b5a"
            );

            return;
        }


        const postData = {

            title: title,

            content: content,

            userId: currentUserId,

            communityId: communityId

        };


        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/posts",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                postData
                            )
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Backend error:",
                    errorText
                );

                throw new Error(
                    errorText
                );
            }


            const savedPost =
                await response.json();


            console.log(
                "Post saved successfully:",
                savedPost
            );


            showMessage(
                "Post published successfully! ✓",
                "#5c9b65"
            );


            setTimeout(function() {

                window.location.href =
                    "../posts/posts.html";

            }, 1200);


        } catch (error) {

            console.error(
                "Post error:",
                error
            );


            showMessage(
                "Unable to publish post. Please try again.",
                "#d14b5a"
            );
        }

    }
);


function showMessage(
    text,
    color
) {

    const message =
        document.getElementById(
            "message"
        );

    message.textContent =
        text;

    message.style.color =
        color;
}


function cancelPost() {

    window.location.href =
        "../posts/posts.html";
}