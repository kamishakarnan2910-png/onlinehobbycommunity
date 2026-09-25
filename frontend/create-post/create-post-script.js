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


const imageInput =
    document.getElementById("image");


// Get community ID from URL
const urlParams =
    new URLSearchParams(
        window.location.search
    );


const communityIdFromURL =
    urlParams.get("communityId");


// Get actual logged-in user
const currentUserId =
    localStorage.getItem("userId");


const currentUserName =
    localStorage.getItem("userName");


// Set community ID
if (
    communityIdInput &&
    communityIdFromURL
) {

    communityIdInput.value =
        communityIdFromURL;

}


// Check login
if (!currentUserId) {

    showMessage(
        "Please login first.",
        "#d14b5a"
    );

}


// Set preview user
const previewUserName =
    document.getElementById(
        "previewUserName"
    );


const previewAvatar =
    document.getElementById(
        "previewAvatar"
    );


if (currentUserName) {

    previewUserName.textContent =
        currentUserName;


    previewAvatar.textContent =
        currentUserName
            .charAt(0)
            .toUpperCase();

}


// Preview listeners
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


// Topic listeners
document
    .querySelectorAll(
        ".topic-list input"
    )
    .forEach(function(input) {

        input.addEventListener(
            "change",
            updatePreview
        );

    });


// Image preview
imageInput.addEventListener(
    "change",
    function() {

        const file =
            imageInput.files[0];


        const imagePreview =
            document.getElementById(
                "imagePreview"
            );


        const imagePreviewContainer =
            document.getElementById(
                "imagePreviewContainer"
            );


        const previewImage =
            document.getElementById(
                "previewImage"
            );


        if (!file) {

            imagePreviewContainer.style.display =
                "none";


            previewImage.style.display =
                "none";


            return;
        }


        if (!file.type.startsWith("image/")) {

            showMessage(
                "Please select an image file.",
                "#d14b5a"
            );


            imageInput.value =
                "";


            imagePreviewContainer.style.display =
                "none";


            previewImage.style.display =
                "none";


            return;
        }


        if (file.size > 5 * 1024 * 1024) {

            showMessage(
                "Image size must be less than 5 MB.",
                "#d14b5a"
            );


            imageInput.value =
                "";


            imagePreviewContainer.style.display =
                "none";


            previewImage.style.display =
                "none";


            return;
        }


        const imageURL =
            URL.createObjectURL(file);


        imagePreview.src =
            imageURL;


        imagePreviewContainer.style.display =
            "block";


        previewImage.src =
            imageURL;


        previewImage.style.display =
            "block";

    }
);


// Update preview
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


    previewTopics.innerHTML =
        "";


    document
        .querySelectorAll(
            ".topic-list input:checked"
        )
        .forEach(function(topic) {

            const span =
                document.createElement(
                    "span"
                );


            span.textContent =
                "#" + topic.value;


            previewTopics.appendChild(
                span
            );

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


        const userId =
            Number(
                currentUserId
            );


        if (!currentUserId) {

            showMessage(
                "Please login first.",
                "#d14b5a"
            );

            return;
        }


        if (
            !title ||
            !category ||
            !content
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


        if (!userId) {

            showMessage(
                "Invalid user information. Please login again.",
                "#d14b5a"
            );

            return;
        }


        const imageFile =
            imageInput.files[0];


        if (
            imageFile &&
            imageFile.size > 5 * 1024 * 1024
        ) {

            showMessage(
                "Image size must be less than 5 MB.",
                "#d14b5a"
            );

            return;
        }


        const formData =
            new FormData();


        formData.append(
            "title",
            title
        );


        formData.append(
            "content",
            content
        );


        formData.append(
            "category",
            category
        );


        formData.append(
            "userId",
            userId
        );


        formData.append(
            "communityId",
            communityId
        );


        if (imageFile) {

            formData.append(
                "image",
                imageFile
            );

        }


        const publishButton =
            document.querySelector(
                ".publish-btn"
            );


        publishButton.disabled =
            true;


        publishButton.textContent =
            "Publishing...";


        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/posts",
                    {
                        method: "POST",
                        body: formData
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


            setTimeout(
                function() {

                    window.location.href =
                        `../community-details/community-details.html?id=${encodeURIComponent(communityId)}`;

                },
                1200
            );


        } catch (error) {

            console.error(
                "Post error:",
                error
            );


            publishButton.disabled =
                false;


            publishButton.textContent =
                "Publish Post →";


            showMessage(
                "Unable to publish post. Please try again.",
                "#d14b5a"
            );

        }

    }
);


// Show message
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


// Cancel
function cancelPost() {

    const communityId =
        communityIdFromURL;


    if (communityId) {

        window.location.href =
            `../community-details/community-details.html?id=${encodeURIComponent(communityId)}`;

        return;
    }


    window.location.href =
        "../posts/posts.html";
}