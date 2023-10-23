//Add sidebar navigation to page
$(document).ready(function () {
    // Determine the path relative to the root directory
    var rootRelativePath = "../../../../templates/components/sidebar-navigation.html";

    // Use jQuery to load the sidebar-navigation.html file
    $("#sidebar-container").load(rootRelativePath);
});

// Copy Text - Copy Buttons
// Function to copy text and formatting to the clipboard
function copyTextWithFormattingToClipboard(element) {
    const range = document.createRange();
    range.selectNode(element);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    // Insert "Copied to clipboard" into the live region
    const liveRegion = document.getElementById("page-live-region");
    liveRegion.textContent = "Copied to clipboard";

    // Remove the message after 2 seconds
    setTimeout(() => {
        liveRegion.textContent = "";
    }, 2000);
}

// Attach click event handler to copy button
document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const textToCopy = button.parentElement.previousElementSibling;
        copyTextWithFormattingToClipboard(textToCopy);
    });
});


