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

// Checklist Script to save and reset local storage
// Document ready function
$(document).ready(function() {
// Hide the alert message initially
$('#confirmAlert').hide();

// Function to load the checklist state
function loadChecklistState() {
    // Loop through all the checkboxes in the checklist
    $('input[type="checkbox"]').each(function() {
    var id = $(this).attr('id');
    var checked = localStorage.getItem(id) === 'true';
    $(this).prop('checked', checked);
    });
}

// Function to save the checklist state
function saveChecklistState() {
    // Loop through all the checkboxes in the checklist
    $('input[type="checkbox"]').each(function() {
    var id = $(this).attr('id');
    var checked = $(this).is(':checked');
    localStorage.setItem(id, checked);
    });
}

// Event listener for checkbox state change
$('input[type="checkbox"]').change(function() {
    saveChecklistState();
});

// Load checklist state from local storage on page load
loadChecklistState();

// Event listener for the reset button
$('#clearBtn').click(function() {
    $('#confirmAlert').show(); // Show the alert
});

// Event listener for the confirm button in the alert
$('#confirmBtn').click(function() {
    // Loop through all the checkboxes and clear them
    $('input[type="checkbox"]').each(function() {
    $(this).prop('checked', false);
    });
    
    // Clear the local storage
    localStorage.clear();

    // Hide the alert again
    $('#confirmAlert').hide();

    // Set focus back to the reset button
    $('#clearBtn').focus();

    // You may want to reload the page to reset all form controls
    // location.reload();
    });
});

