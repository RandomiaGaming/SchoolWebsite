if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initLayout);
} else {
    initLayout();
}
function initLayout() {
    window.addEventListener('resize', updateLayout);
    updateLayout();
}

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