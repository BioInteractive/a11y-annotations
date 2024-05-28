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

// Tabs Component

(function () {
    // Select the first [role="tablist"] element
    const tablist = document.querySelectorAll('[role="tablist"]')[0];
    let tabs;
    let panels;
  
    // Generates arrays for tabs and panels
    generateArrays();
  
    function generateArrays() {
      tabs = document.querySelectorAll('[role="tab"]');
      panels = document.querySelectorAll('[role="tabpanel"]');
    };
  
    // Key codes for easy reference
    const keys = {
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46,
      enter: 13,
      space: 32
    };
  
    // Direction object for navigation
    const direction = {
      37: -1,
      38: -1,
      39: 1,
      40: 1
    };
  
    // Bind event listeners to each tab
    for (let i = 0; i < tabs.length; ++i) {
      addListeners(i);
    };
  
    function addListeners(index) {
      tabs[index].addEventListener('click', clickEventListener);
      tabs[index].addEventListener('keydown', keydownEventListener);
      tabs[index].addEventListener('keyup', keyupEventListener);
  
      // Assign index to each tab for reference
      tabs[index].index = index;
    };
  
    function clickEventListener(event) {
      const tab = event.target;
      activateTab(tab, false);
    };
  
    function keydownEventListener(event) {
      const key = event.keyCode;
  
      switch (key) {
        case keys.end:
          event.preventDefault();
          focusLastTab();
          break;
        case keys.home:
          event.preventDefault();
          focusFirstTab();
          break;
        case keys.up:
        case keys.down:
          event.preventDefault();
          determineOrientation(event);
          break;
      };
    };
  
    function keyupEventListener(event) {
      const key = event.keyCode;
  
      switch (key) {
        case keys.left:
        case keys.right:
          determineOrientation(event);
          break;
        case keys.delete:
          determineDeletable(event);
          break;
        case keys.enter:
        case keys.space:
          activateTab(event.target);
          break;
      };
    };
  
    function determineOrientation(event) {
      const key = event.keyCode;
      const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
      let proceed = false;
  
      if (vertical) {
        if (key === keys.up || key === keys.down) {
          proceed = true;
        }
      } else {
        if (key === keys.left || key === keys.right) {
          proceed = true;
        }
      }
  
      if (proceed) {
        switchTabOnArrowPress(event);
      }
    };
  
    function switchTabOnArrowPress(event) {
      const pressed = event.keyCode;
  
      if (direction[pressed]) {
        const target = event.target;
        if (target.index !== undefined) {
          if (tabs[target.index + direction[pressed]]) {
            tabs[target.index + direction[pressed]].focus();
          } else if (pressed === keys.left || pressed === keys.up) {
            focusLastTab();
          } else if (pressed === keys.right || pressed === keys.down) {
            focusFirstTab();
          }
        }
      }
    };
  
    function activateTab(tab, setFocus = true) {
      // Deactivate all tabs
      deactivateTabs();
  
      tab.removeAttribute('tabindex');
      tab.setAttribute('aria-selected', 'true');
  
      const controls = tab.getAttribute('aria-controls');
      document.getElementById(controls).removeAttribute('hidden');
  
      if (setFocus) {
        tab.focus();
      }
    };
  
    function deactivateTabs() {
      for (let t = 0; t < tabs.length; t++) {
        tabs[t].setAttribute('tabindex', '-1');
        tabs[t].setAttribute('aria-selected', 'false');
      }
  
      for (let p = 0; p < panels.length; p++) {
        panels[p].setAttribute('hidden', 'hidden');
      }
    };
  
    function focusFirstTab() {
      tabs[0].focus();
    };
  
    function focusLastTab() {
      tabs[tabs.length - 1].focus();
    };
  
    function determineDeletable(event) {
      let target = event.target;
  
      if (target.getAttribute('data-deletable') !== null) {
        deleteTab(event);
  
        generateArrays();
  
        if (target.index - 1 < 0) {
          activateTab(tabs[0]);
        } else {
          activateTab(tabs[target.index - 1]);
        }
      }
    };
  
    function deleteTab(event) {
      const target = event.target;
      const panel = document.getElementById(target.getAttribute('aria-controls'));
  
      target.parentElement.removeChild(target);
      panel.parentElement.removeChild(panel);
    };
  
    function determineDelay() {
      const hasDelay = tablist.hasAttribute('data-delay');
      let delay = 0;
  
      if (hasDelay) {
        const delayValue = tablist.getAttribute('data-delay');
        delay = delayValue ? parseInt(delayValue, 10) : 300;
      }
  
      return delay;
    };
  }());
  

