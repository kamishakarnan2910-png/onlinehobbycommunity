function scrollToFeatures() {

    const features =
        document.getElementById("features");

    features.scrollIntoView({
        behavior: "smooth"
    });
}


function goExplore() {

    window.location.href =
        "../explore/explore.html";
}