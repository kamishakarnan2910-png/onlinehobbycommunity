const form = document.getElementById("postForm");

const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const contentInput = document.getElementById("content");
const communityIdInput = document.getElementById("communityId");
const imageInput = document.getElementById("image");

const urlParams = new URLSearchParams(window.location.search);

const communityIdFromURL = urlParams.get("communityId");
const currentUserId = localStorage.getItem("userId");
const currentUserName = localStorage.getItem("userName");

let selectedFiles = [];


if (communityIdInput && communityIdFromURL) {
    communityIdInput.value = communityIdFromURL;
}


if (!currentUserId) {
    showMessage(
        "Please login first.",
        "#d14b5a"
    );
}


const previewUserName =
    document.getElementById("previewUserName");

const previewAvatar =
    document.getElementById("previewAvatar");


if (currentUserName) {

    previewUserName.textContent =
        currentUserName;

    previewAvatar.textContent =
        currentUserName
            .charAt(0)
            .toUpperCase();
}


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
    .forEach(function (input) {

        input.addEventListener(
            "change",
            updatePreview
        );

    });


// ======================================================
// IMAGE SELECTION
// ======================================================

imageInput.addEventListener(
    "change",
    function () {

        const newFiles =
            Array.from(imageInput.files);


        for (const file of newFiles) {

            if (
                !file.type.startsWith("image/")
            ) {

                showMessage(
                    "Please select only image files.",
                    "#d14b5a"
                );

                continue;
            }


            if (
                file.size > 5 * 1024 * 1024
            ) {

                showMessage(
                    `Image "${file.name}" must be less than 5 MB.`,
                    "#d14b5a"
                );

                continue;
            }


            const alreadyExists =
                selectedFiles.some(
                    function (oldFile) {

                        return (
                            oldFile.name === file.name &&
                            oldFile.size === file.size &&
                            oldFile.lastModified ===
                                file.lastModified
                        );

                    }
                );


            if (!alreadyExists) {

                selectedFiles.push(file);

            }

        }


        imageInput.value = "";

        updateImagePreviews();

    }
);


// ======================================================
// IMAGE PREVIEWS
// ======================================================

function updateImagePreviews() {

    const imagePreviewContainer =
        document.getElementById(
            "imagePreviewContainer"
        );

    const imagePreviewList =
        document.getElementById(
            "imagePreviewList"
        );

    const previewImageContainer =
        document.getElementById(
            "previewImageContainer"
        );

    const previewImageList =
        document.getElementById(
            "previewImageList"
        );


    imagePreviewList.innerHTML = "";

    previewImageList.innerHTML = "";


    if (selectedFiles.length === 0) {

        imagePreviewContainer.style.display =
            "none";

        previewImageContainer.style.display =
            "none";

        return;
    }


    selectedFiles.forEach(
        function (file, index) {

            const imageURL =
                URL.createObjectURL(file);


            const wrapper =
                document.createElement("div");


            wrapper.style.position =
                "relative";


            const image =
                document.createElement("img");


            image.src =
                imageURL;

            image.alt =
                file.name;


            image.style.cssText = `
                width:100%;
                height:120px;
                object-fit:cover;
                border-radius:12px;
                border:1px solid #ddd;
            `;


            const removeButton =
                document.createElement("button");


            removeButton.type =
                "button";


            removeButton.textContent =
                "×";


            removeButton.style.cssText = `
                position:absolute;
                top:5px;
                right:5px;
                width:28px;
                height:28px;
                border:none;
                border-radius:50%;
                background:#d14b5a;
                color:white;
                font-size:18px;
                cursor:pointer;
            `;


            removeButton.onclick =
                function () {

                    selectedFiles.splice(
                        index,
                        1
                    );

                    updateImagePreviews();

                };


            wrapper.appendChild(image);

            wrapper.appendChild(
                removeButton
            );

            imagePreviewList.appendChild(
                wrapper
            );

        }
    );


    imagePreviewContainer.style.display =
        "block";


    selectedFiles.forEach(
        function (file) {

            const imageURL =
                URL.createObjectURL(file);


            const image =
                document.createElement("img");


            image.src =
                imageURL;

            image.alt =
                file.name;


            image.style.cssText = `
                width:180px;
                height:150px;
                flex-shrink:0;
                object-fit:cover;
                border-radius:12px;
            `;


            previewImageList.appendChild(
                image
            );

        }
    );


    previewImageContainer.style.display =
        "block";


    console.log(
        "Total selected photos:",
        selectedFiles.length
    );
}


// ======================================================
// TEXT PREVIEW
// ======================================================

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
        title ||
        "Your post title";


    document.getElementById(
        "previewCategory"
    ).textContent =
        category ||
        "Category";


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
        .forEach(
            function (topic) {

                const span =
                    document.createElement(
                        "span"
                    );


                span.textContent =
                    "#" + topic.value;


                previewTopics.appendChild(
                    span
                );

            }
        );
}


// ======================================================
// PUBLISH POST
// ======================================================

form.addEventListener(
    "submit",
    async function (event) {

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


        // USE SELECTED FILES

        const imageFiles =
            selectedFiles;


        console.log(
            "Uploading image count:",
            imageFiles.length
        );


        if (imageFiles.length === 0) {

            showMessage(
                "Please select at least one image.",
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


        imageFiles.forEach(
            function (file) {

                formData.append(
                    "images",
                    file,
                    file.name
                );

            }
        );


        console.log(
            "FormData image count:",
            imageFiles.length
        );


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
                "Post saved:",
                savedPost
            );


            console.log(
                "Saved image URLs:",
                savedPost.imageUrls
            );


            showMessage(
                "Post published successfully! ✓",
                "#5c9b65"
            );


            setTimeout(
                function () {

                    window.location.href =
                        `../community-details/community-details.html?id=${encodeURIComponent(
                            communityId
                        )}`;

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


// ======================================================
// MESSAGE
// ======================================================

function showMessage(
    text,
    color
) {

    const message =
        document.getElementById(
            "message"
        );


    if (!message) {
        return;
    }


    message.textContent =
        text;

    message.style.color =
        color;
}


// ======================================================
// CANCEL
// ======================================================

function cancelPost() {

    const communityId =
        communityIdFromURL;


    if (communityId) {

        window.location.href =
            `../community-details/community-details.html?id=${encodeURIComponent(
                communityId
            )}`;

        return;
    }


    window.location.href =
        "../posts/posts.html";
}