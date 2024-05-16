/*
Class: CS290 Web Development
Assignment: Homework 6 Weather API
Student Name: Finlay Christ
Students In Group: 1
Date: 05/16/2024
*/

// Register the on window resized event once the dom finishes loading.
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initLayout);
} else {
    initLayout();
}
function initLayout() {
    window.addEventListener('resize', updateLayout);
    updateLayout();
}

// Update the footer as needed so its never floating in midair or overlapping the content
function updateLayout() {
    let footer = document.querySelector("footer");
    let footerHeight = footer.offsetHeight;
    let scrollableRegion = document.querySelector("#scrollable-region");
    let scrollableRegionHeight = scrollableRegion.offsetHeight;

    if (footerHeight + scrollableRegionHeight >= window.innerHeight) {
        // position: undefined; bottom: undefined;
        footer.style.removeProperty("position");
        footer.style.removeProperty("bottom");
    } else {
        // position: fixed; bottom: 0;
        footer.style.position = "fixed";
        footer.style.bottom = "0px";
    }
}