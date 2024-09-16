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

  // Event listener for the cancel button in the alert
  $('#cancelBtn').click(function() {
      // Hide the alert message
      $('#confirmAlert').hide();

      // Set focus back to the reset checklist button
      $('#clearBtn').focus();
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
  
// Form Component Error Messaging
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form');

  if (form) {
    const emailInput = document.getElementById('exampleInputEmail1');
    const passwordInput = document.getElementById('exampleInputPassword1');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const successMsg = document.querySelector('.success-msg');

    // Validation function for email
    function validateEmail() {
      if (emailInput.value === '' || !emailInput.value.includes('@')) {
        emailInput.classList.add('is-invalid');
        emailInput.setAttribute('aria-invalid', 'true');
        emailError.style.display = 'block';
        emailInput.setAttribute('aria-describedby', 'emailHelp email-error');
        return false;
      } else {
        emailInput.classList.remove('is-invalid');
        emailInput.removeAttribute('aria-invalid');
        emailError.style.display = 'none';
        emailInput.setAttribute('aria-describedby', 'emailHelp');
        return true;
      }
    }

    // Validation function for password
    function validatePassword() {
      if (passwordInput.value !== 'Password123') {
        passwordInput.classList.add('is-invalid');
        passwordInput.setAttribute('aria-invalid', 'true');
        passwordError.style.display = 'block';
        passwordInput.setAttribute('aria-describedby', 'passwordHelper password-error');
        return false;
      } else {
        passwordInput.classList.remove('is-invalid');
        passwordInput.removeAttribute('aria-invalid');
        passwordError.style.display = 'none';
        passwordInput.setAttribute('aria-describedby', 'passwordHelper');
        return true;
      }
    }

    // Event listeners for input fields
    emailInput.addEventListener('change', validateEmail);
    passwordInput.addEventListener('change', validatePassword);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();

      if (isEmailValid && isPasswordValid) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.focus();
      }
    });
  }
});

// Script for A11y Checklist page - Project Info Form and Detail Editting and Resetting
document.addEventListener('DOMContentLoaded', function() {
  // Check if the form exists on the page
  const form = document.getElementById('project-details-form');
  if (form) {
    // Save form data in local storage when form is submitted
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent form submission

      // Get form values
      const projectTitle = document.getElementById('project-title').value;
      const role = document.getElementById('role').value;
      const name = document.getElementById('name').value;
      const date = document.getElementById('date').value;

      // Save data to local storage
      const projectData = {
        projectTitle: projectTitle,
        role: role,
        name: name,
        date: date
      };
      localStorage.setItem('projectData', JSON.stringify(projectData));

      // Display the project information and hide the form
      displayProjectInfo(projectData);
      document.getElementById('project-details-form').style.display = 'none';
      document.getElementById('edit-btn').style.display = 'inline-block';
      document.getElementById('reset-btn').style.display = 'inline-block'; // Show Reset button
    });

    // Function to display stored project information
    function displayProjectInfo(data) {
      document.getElementById('display-project-title').textContent = data.projectTitle || 'N/A';
      document.getElementById('display-role').textContent = data.role || 'N/A';
      document.getElementById('display-name').textContent = data.name || 'N/A';
      document.getElementById('display-date').textContent = data.date || 'N/A';
      document.getElementById('project-info').style.display = 'block';
    }

    // Load project data from local storage on page load
    const storedData = JSON.parse(localStorage.getItem('projectData'));
    if (storedData) {
      displayProjectInfo(storedData);
      document.getElementById('project-details-form').style.display = 'none';
      document.getElementById('edit-btn').style.display = 'inline-block';
      document.getElementById('reset-btn').style.display = 'inline-block'; // Show Reset button
    }

    // Handle Edit button click to show form again
    document.getElementById('edit-btn').addEventListener('click', function() {
      const storedData = JSON.parse(localStorage.getItem('projectData'));
      if (storedData) {
        document.getElementById('project-title').value = storedData.projectTitle;
        document.getElementById('role').value = storedData.role;
        document.getElementById('name').value = storedData.name;
        document.getElementById('date').value = storedData.date;
      }
      document.getElementById('project-details-form').style.display = 'block';
      document.getElementById('project-info').style.display = 'none';
      document.getElementById('edit-btn').style.display = 'none';
      document.getElementById('reset-btn').style.display = 'none'; // Hide Reset button when form is shown
    });

    // Handle Reset button click to clear local storage and reset form
    document.getElementById('reset-btn').addEventListener('click', function() {
      localStorage.removeItem('projectData');
      document.getElementById('project-details-form').reset();
      document.getElementById('project-info').style.display = 'none';
      document.getElementById('project-details-form').style.display = 'block';
      document.getElementById('edit-btn').style.display = 'none';
      document.getElementById('reset-btn').style.display = 'none'; // Hide Reset button when form is shown
    });
  }
});

// A11y Checklist page - Export table to Excel blank 

    document.addEventListener('DOMContentLoaded', function() {
        // Check if the export button exists
        var exportBtn = document.getElementById('exportBtn');
        if (!exportBtn) {
            return; // Exit if the export button is not found
        }

        // Add event listener to the export button
        exportBtn.addEventListener('click', function() {
            // Retrieve project info from local storage
            const storedData = JSON.parse(localStorage.getItem('projectData'));

            if (storedData) {
                const projectTitle = storedData.projectTitle || 'Project';
                const role = storedData.role || 'N/A';
                const name = storedData.name || 'N/A';
                const date = storedData.date || 'N/A';

                // Export table with project information
                exportTableToExcel('checklist', projectTitle, role, name, date);
            } else {
                // Default export if no project information is found
                exportTableToExcel('checklist', 'Checklist');
            }
        });

        function exportTableToExcel(tableID, projectTitle, role, name, date) {
            var table = document.getElementById(tableID);
            if (!table) {
                console.error('Table not found!');
                return;
            }

            // Create a new sheet manually to include project info
            var worksheet = XLSX.utils.aoa_to_sheet([
                // Project info as the first row
                [`Project Title: ${projectTitle}`, `Role: ${role}`, `Name: ${name}`, `Date: ${date}`],
                [] // Empty row for spacing
            ]);

            // Append the actual table rows to the worksheet
            XLSX.utils.sheet_add_dom(worksheet, table, {origin: -1});

            // Create the workbook and add the sheet
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, worksheet, "Checklist");

            // Convert the workbook to binary
            var wbout = XLSX.write(wb, {bookType: 'xls', type: 'binary'});

            // Function to convert string to ArrayBuffer
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            // Set the filename to match the project title and trigger the download
            var filename = `${projectTitle || 'exported_data'}.xls`;
            var blob = new Blob([s2ab(wbout)], {type: "application/vnd.ms-excel"});
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

