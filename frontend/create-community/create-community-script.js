const communityForm =
    document.getElementById("communityForm");

communityForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("communityName")
                .value
                .trim();

        const description =
            document.getElementById("description")
                .value
                .trim();

        const category =
            document.getElementById("category")
                .value;

        const userId =
            localStorage.getItem("userId");

        if (!userId) {
            alert("Please login first.");
            return;
        }

        const imageInput =
            document.getElementById("communityImage");

        const imageFile =
            imageInput
                ? imageInput.files[0]
                : null;

        if (!imageFile) {
            alert("Please select a community image.");
            return;
        }

        console.log(
            "Selected image:",
            imageFile.name
        );

        console.log(
            "Image size:",
            imageFile.size
        );

        console.log(
            "Image type:",
            imageFile.type
        );

        if (!imageFile.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            alert("Image size must be less than 5 MB.");
            return;
        }

        const formData =
            new FormData();

        formData.append(
            "name",
            name
        );

        formData.append(
            "description",
            description
        );

        formData.append(
            "category",
            category
        );

        formData.append(
            "createdBy",
            userId
        );

        formData.append(
            "image",
            imageFile
        );

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/communities",
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
                    "Failed to create community"
                );
            }

            const createdCommunity =
                await response.json();

            console.log(
                "Created community:",
                createdCommunity
            );

            console.log(
                "Saved image URL:",
                createdCommunity.imageUrl
            );

            alert(
                "Community created successfully! ✨"
            );

            window.location.href =
                "../community/community.html";

        } catch (error) {

            console.error(
                "Create community error:",
                error
            );

            alert(
                "Unable to create community. Please make sure the backend is running."
            );
        }
    }
);