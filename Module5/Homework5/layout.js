/*
Class: CS290 Web Development
Assignment: Homework 5 JavaScript Game
Student Name: Finlay Christ
Students In Group: 1
Date: 05/04/2024
*/

// This file contains javascript to control the layout and styling of this page.
// Some elements like the footer and main container use javascript for dynamic styling.
// This script powers those effects.

// Run the init function once the DOM is loaded or right now if the DOM is already loaded.
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

// Register events to go off when the content of the page is updated or the window is resized.
function init() {
    let observer = new MutationObserver(updateStyles);
    observer.observe(document.querySelector("body"), { childList: true, subtree: true });
    window.addEventListener('resize', updateStyles);
    updateStyles();
}

// Updates the styles which are calculated with javascript.
// Mainly weather the footer is fixed to the bottom of the screen or free to move.
function updateStyles() {
    let mainElement = document.querySelector("main");
    let mainHeight = mainElement.offsetHeight;
    let footerElement = document.querySelector("footer");
    let footerHeight = footerElement.offsetHeight;
    let contentElement = document.querySelector("#content");

    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;

    if (mainHeight + footerHeight > viewportHeight) {
        footerElement.style.position = "static";
    } else {
        footerElement.style.position = "fixed";
    }

    // Get the value of some css variables for use later.
    let targetAspectStyle = getComputedStyle(document.documentElement).getPropertyValue("--target-aspect").trim();
    let targetAspect = eval(targetAspectStyle.substring(5, targetAspectStyle.length - 1));
    let scrollbarWidth = getComputedStyle(document.documentElement).getPropertyValue("--scrollbar-width").trim();
    let tileScalingFactor = getComputedStyle(document.documentElement).getPropertyValue("--tile-scaling-factor").trim();

    if ((viewportWidth - 15) / viewportHeight > targetAspect) {
        contentElement.style.width = "calc(var(--target-aspect) * 100vh)";
        contentElement.style.maxWidth = "calc(var(--target-aspect) * 100vh)";
        footerElement.style.width = "calc(var(--target-aspect) * 100vh)";
        footerElement.style.maxWidth = "calc(var(--target-aspect) * 100vh)";

        document.body.style.justifyContent = "center";
    } else {
        contentElement.style.width = "calc(100vw - " + scrollbarWidth + ")";
        contentElement.style.maxWidth = "calc(100vw - " + scrollbarWidth + ")";
        footerElement.style.width = "calc(100vw - " + scrollbarWidth + ")";
        footerElement.style.maxWidth = "calc(100vw - " + scrollbarWidth + ")";

        document.body.style.justifyContent = "left";
    }

    // Set the value of css variables.
    let contentWidth = contentElement.clientWidth;
    let tileSize = contentWidth / tileScalingFactor;
    document.documentElement.style.setProperty("--tile-size", tileSize + "px");
}