// Copy Text - Copy Buttons
// Function to copy text and formatting to the clipboard using Clipboard API
function copyTextToClipboard(element) {
    const text = element.innerText; // Or element.textContent
    navigator.clipboard.writeText(text).then(() => {
        // Insert "Copied to clipboard" into the live region
        const liveRegion = document.getElementById("page-live-region");
        liveRegion.textContent = "Copied to clipboard";

        // Remove the message after 2 seconds
        setTimeout(() => {
            liveRegion.textContent = "";
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
}

document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const textToCopy = button.parentElement.previousElementSibling;
        copyTextToClipboard(textToCopy);
    });
});


// Attach click event handler to copy button
document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", () => {
        const textToCopy = button.parentElement.previousElementSibling;
        copyTextWithFormattingToClipboard(textToCopy);
    });
});

//Skip Link
document.addEventListener('DOMContentLoaded', function() {
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.querySelector('#main-content');

  if (skipLink && mainContent) { // Check if both elements exist
    skipLink.addEventListener('click', function(e) {
      mainContent.focus(); // Send focus to main content
    });
  }
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

// Script for A11y Checklist page - Project Info Form and Detail Editing and Resetting
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
      const comments = document.getElementById('comments').value; // Get comments value

      // Save data to local storage
      const projectData = {
        projectTitle: projectTitle,
        role: role,
        name: name,
        date: date,
        comments: comments // Include comments in projectData
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
      document.getElementById('display-comments').textContent = data.comments || 'N/A'; // Display comments
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
        document.getElementById('comments').value = storedData.comments; // Restore comments
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

    // Site Search
    // Redirect user to search results page with the query in the URL
      function redirectToSearchPage(event) {
          event.preventDefault(); // Prevent the form from submitting the traditional way

          const query = document.getElementById('search-input').value.trim();
          if (query) {
              // Redirect to the search results page, passing the search query as a URL parameter
              window.location.href = `/a11y-annotations/default/search.html?query=${encodeURIComponent(query)}`;
          }
      }

      // Search index (static data embedded directly)
      const pages = [
        {
          title: 'Introduction',
          url: '/index.html',
          description: 'Introduction to the A11y Annotations repository, helping Designers, Auditors, and Developers collaborate for accessible design and development.',
          content: 'This repository empowers Designers, Auditors and Developers to collaborate within Figma and streamline the process of creating born accessible interactives, webpages and components. Designers can reference this repository for accessibility guidance during their design process. Auditors may use this repository to help identify potential accessibility issues in the design phase...'
        },
        {
          title: 'Accessibility Checklist',
          url: '/default/accessibility-checklist.html',
          description: 'The complete accessibility checklist for evaluating heuristic categories such as structure, forms, color, navigation, nontext content, interactivity, movement and flashing, timing, and screen magnification.',
          content: 'This page provides a comprehensive checklist to help designers, auditors, and developers evaluate key accessibility aspects including structure, forms, color contrast, navigation and wayfinding, nontext content, interactive elements, movement and flashing content, timing, and screen magnification adjustments.'
        },
        {
          title: 'How to Annotate',
          url: '/default/how-to-annotate.html',
          description: 'Learn how to annotate accessibility issues step by step, covering design changes and developer hand-off in Figma.',
          content: 'Follow these steps to create design annotations for accessibility in Figma. Phase One involves identifying WCAG defects using automated and manual testing tools, adding comments directly to the Figma board for issues like color contrast and form labeling. Phase Two focuses on preparing annotations for developer hand-off using tools like Include—Accessibility Annotations plugin, outlining landmarks, and creating a walkthrough document...'
        },
        {
          title: 'Landmarks',
          url: '/templates/general/structure/landmarks.html',
          description: 'Learn about the role of landmarks in accessible web design, including their use and implementation to improve navigation for assistive technology users.',
          content: 'Landmarks identify regions of a screen and help people who use assistive technology to make a mental model of a screen\'s content. Landmark regions must be present and used appropriately to accurately reflect the purpose of the content. Key landmarks include banner, navigation, main, region, and form...',
          wcagCriteria: [
              { id: '1.3.1', description: 'Info and Relationships - Information, structure, and relationships conveyed through presentation can be programmatically determined or available in text.' }
          ]
        },
        {
          title: 'Headings',
          url: '/templates/general/structure/headings.html',
          description: 'How to structure headings for accessibility, ensuring a logical and meaningful hierarchy for better navigation and understanding.',
          content: 'Properly structured headings provide a hierarchical structure to your content, making it easier for all users, including those who rely on screen readers, to navigate and understand your web page. Heading levels should be used sequentially, starting with <code>&lt;h1&gt;</code> for the main page title and following with <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>, and so on...',
          wcagCriteria: [
            { id: '1.3.1', description: 'Info and Relationships - Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.' },
            { id: '2.4.6', description: 'Headings and Labels - Headings and labels describe the topic or purpose.' }
          ]
        },        
        {
          title: 'Page',
          url: '/templates/general/structure/page.html',
          description: 'Guidelines for developers, designers, and auditors to ensure the structure of a webpage meets accessibility requirements.',
          content: 'This page covers critical accessibility guidelines for developing web pages, including meaningful sequence, correct orientation, bypass blocks, page titles, multiple ways to navigate, and proper language specification...',
          wcagCriteria: [
              { id: '1.3.2', description: 'Meaningful Sequence - Content is presented in a logical reading sequence.' },
              { id: '1.3.4', description: 'Orientation - Content is accessible in both portrait and landscape orientations.' },
              { id: '2.4.1', description: 'Bypass Blocks - A mechanism is available to bypass repeated blocks of content.' },
              { id: '2.4.2', description: 'Page Titled - Web pages have titles that describe the topic or purpose.' },
              { id: '2.4.5', description: 'Multiple Ways - More than one way is available to locate a webpage within a set of webpages.' },
              { id: '3.1.1', description: 'Language of Page - The default language of the webpage is programmatically determined.' },
              { id: '3.1.2', description: 'Language of Parts - The language of each passage or phrase is programmatically determined.' }
          ]
        },
        {
          title: 'Text Best Practices',
          url: '/templates/general/structure/text-best-practices.html',
          description: 'Best practices for making text readable and accessible, focusing on clear language, readable fonts, spacing, and contrast.',
          content: 'Ensuring text is readable and accessible is crucial for making content inclusive. Key practices include using plain language, sans-serif fonts, proper line height and paragraph spacing, and ensuring sufficient contrast between text and background...',
          wcagCriteria: [
              { id: '1.4.3', description: 'Contrast (Minimum) - Text has sufficient contrast with its background.' },
              { id: '1.4.4', description: 'Resize Text - Text can be resized up to 200% without loss of content or functionality.' },
              { id: '3.1.1', description: 'Language of Page - The default human language of each webpage is programmatically determined.' }
          ]
        },
        {
          title: 'Lists',
          url: '/templates/general/structure/lists.html',
          description: 'Learn how to create accessible lists using proper semantic markup for unordered, ordered, and definition lists.',
          content: 'Semantically marking up lists helps assistive technologies understand the structure and purpose of the content. Visually presented lists must be in semantic list markup to ensure information and relationships are programmatically determinable. Different list types include unordered, ordered, and definition lists...',
          wcagCriteria: [
              { id: '1.3.1', description: 'Info and Relationships - Information, structure, and relationships conveyed through presentation can be programmatically determined or available in text.' }
          ]
        },  
        {
          title: 'Use of Color',
          url: '/templates/general/color/use-of-color.html',
          description: 'Ensure proper use of color to meet accessibility standards and avoid relying solely on color to convey information.',
          content: 'Color must not be used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Designers should provide alternative indicators such as text labels, icons, or patterns...',
          wcagCriteria: [
              { id: '1.4.1', description: 'Use of Color - Color is not used as the only visual means of conveying information.' }
          ]
        },
        {
          title: 'Text Color Contrast',
          url: '/templates/general/color/text-contrast.html',
          description: 'How to achieve sufficient text color contrast to meet WCAG accessibility standards.',
          content: 'The visual presentation of text and images of text must have a contrast ratio of at least 4.5:1 for regular-sized text, and 3:1 for large-sized text or bold text. Designers should use tools like the Color Contrast Analyzer to ensure these contrast ratios are met...',
          wcagCriteria: [
              { id: '1.4.3', description: 'Contrast (Minimum) - Text must have sufficient contrast against its background to ensure readability.' }
          ]
        },
        {
          title: 'Non-text Color Contrast',
          url: '/templates/general/color/non-text-contrast.html',
          description: 'Guidance for meeting non-text color contrast requirements, ensuring sufficient contrast for UI components and graphical objects.',
          content: 'Non-text elements like user interface components and graphical objects must have a contrast ratio of at least 3:1 against adjacent colors. Designers should use tools like the Color Contrast Analyzer to evaluate the contrast of these elements...',
          wcagCriteria: [
              { id: '1.4.11', description: 'Non-text Contrast - The visual presentation of non-text elements must have a contrast ratio of at least 3:1.' }
          ]
        },
        {
          title: 'Images',
          url: '/templates/general/non-text-content/images.html',
          description: 'Accessible image guidelines and best practices, including meaningful and decorative images, SVGs, and icons.',
          content: 'All meaningful non-text content, such as images, must have alt text that provides the same information found in the content. Decorative images should have alt="", while complex images should provide more detailed alternatives or descriptions...',
          wcagCriteria: [
              { id: '1.1.1', description: 'Non-text Content - All non-text content must have text alternatives that serve the same purpose.' }
          ]
        },
        {
          title: 'Images of Text',
          url: '/templates/general/non-text-content/images-of-text.html',
          description: 'Why and how to avoid using images of text unless essential, and how to meet contrast requirements.',
          content: 'If the visual presentation can be achieved using text, avoid using images of text. Exceptions include logotypes and cases where the visual presentation of the text is essential to the message. Ensure contrast meets accessibility standards...',
          wcagCriteria: [
              { id: '1.4.5', description: 'Images of Text - Text is used to convey information rather than images of text, with exceptions for logotypes and essential presentations.' },
              { id: '1.4.3', description: 'Contrast (Minimum) - The contrast ratio for text and images of text must be at least 4.5:1.' }
          ]
        },
        {
          title: 'Time-based Media',
          url: '/templates/general/non-text-content/media.html',
          description: 'Requirements and best practices for ensuring accessibility of time-based media, including captions, transcripts, and audio descriptions.',
          content: 'All prerecorded audio-only, video-only, and video with audio content must have appropriate captions, transcripts, or audio descriptions to ensure accessibility for users with disabilities. Live video with audio must have real-time captions...',
          wcagCriteria: [
              { id: '1.2.1', description: 'Audio-only and Video-only - Provide alternatives for prerecorded audio-only or video-only content.' },
              { id: '1.2.2', description: 'Captions (Prerecorded) - Provide captions for all prerecorded audio content in synchronized media.' },
              { id: '1.2.3', description: 'Audio Description or Media Alternative - Provide audio description or media alternatives for prerecorded video content.' },
              { id: '1.2.4', description: 'Captions (Live) - Provide captions for all live audio content in synchronized media.' },
              { id: '1.2.5', description: 'Audio Description (Prerecorded) - Provide audio descriptions for all prerecorded video content.' }
          ]
        },
        {
          title: 'Timing Adjustable',
          url: '/templates/general/non-text-content/timing-adjustable.html',
          description: 'Guidelines for making timing adjustable for users, including options to disable, extend, or adjust time limits.',
          content: 'Users must be provided with options to turn off, adjust, or extend time limits on interactive content. These mechanisms should be easy to access and use, with clear warnings before time limits expire...',
          wcagCriteria: [
              { id: '2.2.1', description: 'Timing Adjustable - Users can turn off, adjust, or extend time limits, with exceptions for real-time, essential, and long-duration activities.' }
          ]
        },
        {
          title: 'Pause, Stop, Hide',
          url: '/templates/general/non-text-content/pause-stop-hide.html',
          description: 'Learn how to allow users to pause, stop, or hide moving, blinking, or auto-updating content.',
          content: 'For any moving, blinking, scrolling, or auto-updating content that starts automatically, users must have mechanisms to pause, stop, or hide the content. This ensures content is accessible for users with motion sensitivities or attention difficulties...',
          wcagCriteria: [
              { id: '2.2.2', description: 'Pause, Stop, Hide - Provide mechanisms to control moving, blinking, scrolling, or auto-updating content that lasts longer than five seconds.' }
          ]
        },
        {
          title: 'Three Flashes or Below Threshold',
          url: '/templates/general/non-text-content/three-flashes.html',
          description: 'Avoid content that flashes more than three times per second to protect users from seizures or physical reactions.',
          content: 'Web pages must ensure that content does not flash more than three times per second. If flashing is necessary, it must stay below the general and red flash thresholds to minimize risks...',
          wcagCriteria: [
              { id: '2.3.1', description: 'Three Flashes or Below Threshold - Ensure content does not flash more than three times per second to prevent seizures.' }
          ]
        },
        {
          title: 'Keyboard Accessibility',
          url: '/templates/general/interactives/keyboard.html',
          description: 'Ensure full keyboard accessibility for interactive content.',
          content: 'Keyboard accessibility ensures that all functionality of the content is operable through a keyboard interface, without specific timing requirements for keystrokes. This prevents users from being trapped in any part of the page and ensures seamless navigation.',
          wcagCriteria: [
              { id: '2.1.1', description: 'Keyboard - All content functionality must be operable via a keyboard interface without timing dependencies.' },
              { id: '2.1.2', description: 'No Keyboard Trap - Keyboard focus can be moved to and away from any component using the keyboard without getting trapped.' }
          ]
        },
        {
          title: 'Focus Visible',
          url: '/templates/general/interactives/focus-visible.html',
          description: 'Provide clear focus indicators for users navigating by keyboard.',
          content: 'Focus Visible ensures that all interactive elements have a visible focus indicator for keyboard navigation. This is critical for helping users, particularly those who rely on keyboard navigation, identify which element has focus and ensure smooth navigation.',
          wcagCriteria: [
              { id: '2.4.7', description: 'Focus Visible - Interactive elements must have a visible focus indicator, and it must be clearly distinguishable from the rest of the page.' }
          ]
        },
        {
          title: 'Focus Order',
          url: '/templates/general/interactives/focus-order.html',
          description: 'How to maintain logical focus order for accessibility.',
          content: 'Focus Order ensures that focusable components on a web page are navigated in a logical sequence that preserves meaning and usability. This includes maintaining logical tab order, handling dialogs and modals, and ensuring users can navigate smoothly through interactive elements.',
          wcagCriteria: [
              { id: '2.4.3', description: 'Focus Order - Focusable components receive focus in an order that preserves meaning and operability.' }
          ]
        },
        {
          title: 'On Focus',
          url: '/templates/general/interactives/on-focus.html',
          description: 'Best practices for handling content when elements receive focus.',
          content: 'On Focus addresses how elements behave when they receive focus. To comply with WCAG, no automatic context changes should occur when focus is applied to any component, and any actions must be triggered through explicit user interaction, not just by focus alone.',
          wcagCriteria: [
              { id: '3.2.1', description: 'On Focus - Focus should not trigger automatic context changes.' }
          ]
        }, 
        {
          title: 'On Input',
          url: '/templates/general/interactives/on-input.html',
          description: 'Accessible handling of changes that result from user input.',
          content: 'On Input ensures that adjusting user interface components does not automatically cause a change of context. Any changes in context must be initiated by explicit user actions, and users must be informed about behavior that could lead to such changes.',
          wcagCriteria: [
              { id: '3.2.2', description: 'On Input - Input should not cause automatic context changes without explicit user action.' }
          ]
        },
        {
          title: 'Dynamic Changes',
          url: '/templates/general/interactives/dynamic-changes.html',
          description: 'Ensure users are aware of dynamic changes in content.',
          content: 'When content is updated dynamically, users must be made aware of the change through accessible mechanisms, particularly for screen reader users. Developers can use ARIA live regions or manage focus to ensure updates are communicated effectively without disrupting the user experience.',
          wcagCriteria: [
              { id: '4.1.2', description: 'Name, Role, Value - Dynamically updated content must be announced to assistive technologies.' }
          ]
        },
        {
          title: 'Target Size',
          url: '/templates/general/interactives/touch-target.html',
          description: 'Ensure sufficient target size for touch interactions.',
          content: 'Touch targets must be at least 24 by 24 CSS pixels to meet WCAG 2.5.8, with a recommended size of 44 by 44 for better accessibility. Ensure spacing between targets to prevent accidental taps.',
          wcagCriteria: [
              { id: '2.5.8', description: 'Target Size - The target size for pointer inputs must be at least 24x24 CSS pixels, with 44x44 CSS pixels recommended as a best practice.' }
          ]
        },
        {
          title: 'Resize Text',
          url: '/templates/general/screen-magnification/resize.html',
          description: 'How to support resizing of text for better readability.',
          content: 'Text must be resizable up to 200% without loss of content or functionality. Designers should use flexible layouts and relative units for text sizing to support resizing, and developers should ensure content remains accessible and usable when text is resized.',
          wcagCriteria: [
              { id: '1.4.4', description: 'Resize Text - Text can be resized up to 200% without loss of content or functionality.' }
          ]
        },
        {
          title: 'Reflow',
          url: '/templates/general/screen-magnification/reflow.html',
          description: 'Allow reflowing content to fit different screen sizes.',
          content: 'Content must reflow to fit within 320 CSS pixels wide and 256 CSS pixels tall, without requiring two-dimensional scrolling. Designers and developers must use responsive layouts and scalable units to ensure content adjusts dynamically to different screen sizes while retaining full functionality and meaning.',
          wcagCriteria: [
              { id: '1.4.10', description: 'Reflow - Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions.' }
          ]
        },
        {
          title: 'Text Spacing',
          url: '/templates/general/screen-magnification/text-spacing.html',
          description: 'Provide adjustable text spacing for better readability.',
          content: 'Ensure text spacing is flexible to accommodate adjustments in line height, paragraph spacing, letter spacing, and word spacing without loss of content or functionality. Designers and developers must ensure text remains readable and functional when spacing properties are increased for accessibility purposes.',
          wcagCriteria: [
              { id: '1.4.12', description: 'Text Spacing - Content must maintain functionality and readability when text spacing is adjusted by the user.' }
          ]
        },
        {
          "title": "Accordion",
          "url": "/templates/components/accordion.html",
          "description": "Accessible accordion components allow users to expand and collapse sections of content. Implementing a fully accessible accordion requires proper use of ARIA roles and properties, keyboard navigation support, and clear visual indicators for expanded and collapsed states.",
          "content": "Accordion components help organize content by allowing users to toggle the visibility of sections. Accessible accordions must be operable by keyboard, use ARIA roles and properties to indicate states, and provide clear visual feedback. Focus management and proper semantic labels ensure a smooth, accessible user experience."
        },
        {
          "title": "Alert",
          "url": "/templates/components/alert.html",
          "description": "Create accessible alerts for web content to notify users about important information. Alerts should be properly announced by assistive technologies and must be visually and programmatically distinct to ensure they capture user attention.",
          "content": "Accessible alert components use ARIA roles to ensure proper announcement by assistive technologies, notifying users of important messages. Alerts should use role='alert', be visible until dismissed, and maintain strong visual contrast to ensure readability. Developers must ensure alerts are dynamically injected and maintain keyboard accessibility for all interactive elements."
        },  
        {
          "title": "Breadcrumb",
          "url": "/templates/components/breadcrumb.html",
          "description": "Guide users with accessible breadcrumb navigation by using proper semantic structure, ensuring visual clarity, and providing programmatic indicators of the current page.",
          "content": "Accessible breadcrumb components help users understand their location within the website's hierarchy. Breadcrumb navigation should be contained within a <nav> or <div> with role='navigation' and structured using an ordered list. Ensure that the current page is programmatically identifiable with aria-current='page' and that the links are clearly distinguishable with proper contrast and interactive states."
        },
        {
          "title": "Button",
          "url": "/templates/components/button.html",
          "description": "Best practices for creating accessible buttons that are fully functional with keyboard and assistive technologies while ensuring clear visual indicators and proper contrast.",
          "content": "Accessible buttons must be interactive, clearly labeled, and fully operable by all users, including those using a keyboard or assistive technologies. Buttons should be implemented with <code>&lt;button&gt;</code> elements or other elements using role='button' and must have clear, descriptive text or labels. Ensure that button states, such as focus or disabled, are visually and programmatically distinguishable. Use ARIA attributes as needed for buttons with specific functions, such as aria-haspopup for dialog-opening buttons, and ensure sufficient contrast for all text and icons."
        },
        {
          "title": "Carousel",
          "url": "/templates/components/carousel.html",
          "description": "Learn how to build accessible carousels or explore alternative methods for presenting content commonly found in carousels.",
          "content": "Carousels are often problematic for accessibility, with issues such as inconsistent navigation, poor focus management, and timing constraints. For a more accessible approach, consider alternatives like static content displays, tabbed interfaces, or collapsible sections. If a carousel is required, ensure it is fully controllable with keyboard navigation, play/pause options, and proper ARIA attributes to convey the current state to assistive technologies."
        },
        {
          "title": "Data Chart",
          "url": "/templates/components/data-chart.html",
          "description": "Implement accessible data charts on your website.",
          "content": "Data charts visually represent data, and to ensure they are accessible, they must include clear labels, provide alternative text descriptions, and avoid relying solely on color. Charts should have sufficient color contrast, be keyboard accessible, and be designed to work across all devices. It is also beneficial to offer the data in supplemental formats, such as tables or lists, for users who may require additional accessibility options."
        },  
        {
          "title": "Data Visualization",
          "url": "/templates/components/data-visualization.html",
          "description": "Accessible data visualization techniques and best practices.",
          "content": "Accessible data visualizations ensure that all users, including those with disabilities, can interpret and interact with the visual data. This includes providing alternative text descriptions, using patterns and shapes in addition to color, ensuring sufficient color contrast, and making the visualizations keyboard accessible. Data visualizations should be responsive and adaptable to different screen sizes, and data should also be presented in supplemental formats such as tables or lists."
        },
        {
          "title": "Dialog",
          "url": "/templates/components/dialog.html",
          "description": "How to create accessible dialog windows.",
          "content": "Accessible dialog windows, or modals, are designed to ensure that all users, including those relying on assistive technologies, can interact with them seamlessly. Dialogs must use appropriate ARIA roles, manage focus effectively, and be fully navigable via keyboard. Additional considerations include ensuring the dialog is dismissible with an ESC key, using aria-labelledby for proper labeling, and providing visual contrast for readability."
        },
        {
          "title": "Dropdown / Disclosure",
          "url": "/templates/components/dropdown.html",
          "description": "Accessible dropdowns and disclosure components.",
          "content": "Accessible dropdowns and disclosure components require correct ARIA roles and properties, such as aria-expanded and aria-controls, to help users understand the current state of the dropdown and control its visibility. These components must be fully navigable via keyboard, with Enter/Space keys to open and Esc to close. Focus should remain within the dropdown while open, and icons indicating dropdown state must be hidden from assistive technologies if purely decorative."
        },
        {
          "title": "Form",
          "url": "/templates/components/forms.html",
          "description": "Build accessible forms with proper field labels, clear instructions, and programmatically associated error messages.",
          "content": "Accessible forms must follow WCAG guidelines to ensure usability for all users, including those with disabilities. Each form field should have a descriptive, visible label, programmatically associated with the input using the <code>&lt;label&gt;</code> element or ARIA attributes such as aria-labelledby or aria-label for elements without visible labels. Placeholder text alone is insufficient because it disappears as users type. Required fields should be clearly indicated, and instructions for the form should explain the meaning of visual indicators like asterisks (*). Forms must provide real-time validation for required fields and specific format requirements, with error messages presented clearly next to the relevant field. These error messages should be associated with the field via aria-describedby and visible to screen readers. Form elements should be operable via keyboard, and custom controls must include ARIA roles and focus management. Success or error states should be communicated using ARIA live regions to ensure assistive technology users are notified of changes. Ensure contrast ratios meet WCAG standards, with a minimum contrast ratio of 4.5:1 for normal text and 3:1 for larger text. Additionally, HTML5 validation should be disabled in favor of custom validation techniques that allow for more accessible, user-friendly feedback. For complex inputs, provide examples of the expected format and ensure the logical order of fields follows a natural reading pattern. Consider grouping related form elements like radio buttons or checkboxes and providing additional instructions where necessary."
        },
        {
          "title": "Form Group",
          "url": "/templates/components/form-group.html",
          "description": "Group form elements for better accessibility, ensuring clear relationships and logical structure.",
          "content": "Form groups improve the accessibility and usability of forms by grouping related controls like checkboxes, radio buttons, or input fields. Grouping related elements with a <code>&lt;fieldset&gt;</code> and a descriptive <code>&lt;legend&gt;</code> makes it easier for users, particularly those using assistive technologies, to comprehend the form. These groupings provide clear relationships between form controls, allowing users to concentrate on smaller sections of the form. For form controls that aren't easily grouped with <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code>, use <code>role='group'</code> with <code>aria-labelledby</code> to achieve similar functionality. The grouping should also ensure accessibility for keyboard navigation, with no interference to logical tab order. Common examples include grouping radio buttons for selecting options or checkboxes for multiple selections. Ensure form groups are marked with sufficient visual cues, such as color contrast and a logical reading order to maintain a smooth user experience."
        },     
        {
          "title": "Link",
          "url": "/templates/components/links.html",
          "description": "Create accessible links for easy navigation, ensuring clarity and proper functionality across devices.",
          "content": "Links are essential navigation elements that must be accessible for all users, including those with disabilities. A link (<code>&lt;a&gt;</code>) is typically used to navigate between webpages, resources, or locations within a page. Links must be styled and marked up properly to be distinguishable from other content. They must have accessible names that clearly indicate their purpose and destination. Links like 'Learn More' or 'Click Here' should provide additional context using aria-labels or visually hidden text to clarify their destination. Additionally, links should be usable with a keyboard alone and have a sufficient contrast ratio with surrounding text to ensure visibility. All links must be in focus order and accessible by assistive technologies to ensure that users understand where each link leads without relying on surrounding content or unclear descriptions."
        },
        {
          "title": "Navigation",
          "url": "/templates/components/navigation.html",
          "description": "Best practices for accessible website navigation.",
          "content": "Navigation elements must be properly marked up and styled to ensure accessibility. All navigation bars should be contained within a <code>&lt;nav&gt;</code> element or a sectioning element with role=\"navigation\". When multiple navigation elements exist on the same page, each must have a unique aria-label to differentiate them for screen reader users. Navigation items should be presented in a list structure to reflect their relationships, using <code>&lt;ul&gt;</code> for unordered lists of links. Submenu disclosure buttons should be marked up with aria-expanded and aria-controls attributes, and should function equally with both mouse and keyboard interaction. For mobile navigation, buttons should have accessible names using aria-label or visually hidden text, and toggling states (expanded/collapsed) should be programmatically indicated. Links within navigation menus must be distinguishable from other content with appropriate visual cues and contrast ratios, and interactive elements should have clear focus indicators to ensure accessibility during keyboard navigation. All states (collapsed, expanded, current page, etc.) must be clearly communicated both visually and programmatically to assistive technologies."
        }, 
        {
          "title": "Pagination",
          "url": "/templates/components/pagination.html",
          "description": "Implement accessible pagination for web content.",
          "content": "Pagination helps users navigate through multiple pages of content. Accessible pagination must be operable via keyboard, and screen readers should be able to identify the current page. Ensure the active page is visually and programmatically indicated using aria-current=\"page.\" Disabled links should use aria-disabled=\"true\" and tabindex=\"-1\" to remove them from focus order. Include accessible names for pagination controls, and use aria-label or sr-only text to describe icons. Pagination should be structured in lists for better semantics and operability across devices."
        }, 
        {
          title: 'Progress',
          url: '/templates/components/progress.html',
          description: 'Accessible progress indicators for dynamic content.',
          content: 'Progress bars provide visual indicators of ongoing processes, such as loading or data uploads. To ensure accessibility, they must be designed with proper ARIA attributes to convey real-time status to assistive technologies, offer sufficient color contrast, and include accessible alternatives for all users.'
        },      
        {
          title: 'Table',
          url: '/templates/components/tables.html',
          description: 'Create accessible data tables for web content.',
          content: 'Tables must use semantic markup, with table headers (<th>) and data cells (<td>) appropriately defined. For accessible names, include a <caption> tag or aria-labelledby. In complex tables, use scope, ids, and headers attributes to ensure the relationship between data cells and headers is programmatically determined. Developers must ensure logical structure and use sufficient color contrast for better legibility.'
        },   
        {
          title: 'Tabs',
          url: '/templates/components/tabs.html',
          description: 'Build accessible tab interfaces for content sections.',
          content: 'Tabs must use the appropriate ARIA roles such as role="tablist" on the container, role="tab" on tab buttons, and role="tabpanel" on content panels. Keyboard navigation must be supported, including focus management and arrow key navigation. Use aria-controls to associate each tab with its corresponding content panel and aria-selected="true" to indicate the active tab. Ensure clear visual indicators for active/inactive tabs and follow consistent design patterns across views.'
        },  
        {
          title: 'Tooltip',
          url: '/templates/components/tooltip.html',
          description: 'Best practices for accessible tooltips.',
          content: 'Tooltips must display on both hover and focus events and be dismissible with the ESC key if covering other content. Use aria-describedby to associate the tooltip with the UI control it describes and aria-hidden="true" to manage visibility for assistive technologies. Ensure tooltips remain visible while hovered or focused, and provide sufficient color contrast for readability.'
        },   
        {
          title: 'Toggletip',
          url: '/templates/components/toggletip.html',
          description: 'Ensure accessibility for toggletip elements.',
          content: 'Toggletips must display on both click and keypress events and be dismissible with the ESC key if covering other content. Use aria-describedby to associate the toggletip with the UI control it describes and aria-hidden="true" to manage visibility for assistive technologies. Ensure toggletips remain visible while focused or clicked, and provide sufficient color contrast for readability.'
        }, 
        {
          title: 'Toggle Switch',
          url: '/templates/components/toggle-switch.html',
          description: 'Implement accessible toggle switches for user interaction.',
          content: 'Toggle switches must be operable with keyboard (Enter and Space keys) and mouse. Use aria-checked to indicate state, and provide a clear focus indicator. Ensure color contrast meets accessibility standards and that the switch has a minimum target size of 44x44 pixels for touch interactions.'
        },   
        {
          title: 'Video',
          url: '/templates/components/video.html',
          description: 'How to make video content accessible for all users.',
          content: 'Ensure video controls have sufficient contrast and provide clear focus indicators for keyboard navigation. Use captions, transcripts, and audio descriptions as necessary, and ensure videos are responsive across devices. Provide an accessible name for video iframes or custom elements.'
        },  
        {
          title: 'General Accessibility Resources',
          url: '/templates/resources/general-resources.html',
          description: 'Find general resources on accessibility best practices.',
          content: 'Access links to foundational accessibility resources, including WCAG, ARIA, WebAIM, and the A11Y Project. Resources are categorized by structure, text, landmarks, color, and more.'
        },     
        {
          title: 'Components Resources',
          url: '/templates/resources/components-resources.html',
          description: 'Resources for building accessible web components.',
          content: 'Find guides, best practices, and documentation for creating accessible web components such as accordions, alerts, buttons, modals, and more. Resources cover ARIA, inclusive design, and development tips.'
        },   
        {
          title: 'Designer Resources',
          url: '/templates/resources/design-resources.html',
          description: 'Accessibility resources specifically for designers.',
          content: 'Explore resources, tools, and articles aimed at helping designers incorporate accessibility into their design process. Includes color contrast tools, Figma plugins, and learning materials focused on accessible design principles.'
        },    
        {
          title: 'Developer Resources',
          url: '/templates/resources/development-resources.html',
          description: 'Resources for developers implementing accessible code.',
          content: 'Access tools, guides, and extensions designed for developers focused on building accessible websites. Includes browser extensions, automated testing tools, and comprehensive resources on accessibility implementation.'
        },  
        {
          title: 'Auditor & Testing Resources',
          url: '/templates/resources/auditor-resources.html',
          description: 'Find resources for auditing and testing accessibility.',
          content: 'Explore tools for accessibility auditing, testing, and validation. Includes plugins, browser extensions, automated tools, screen readers, magnification software, and color contrast analyzers.'
        },                                                                                       
      ];
      
      // Perform search
      function performSearch(event) {
          event.preventDefault(); // Prevent form submission
      
          const query = document.getElementById('search-input').value.toLowerCase();
          const resultsContainer = document.getElementById('results');
          if (!resultsContainer) return; // Exit if there's no results container (e.g., on non-search pages)
      
          resultsContainer.innerHTML = ''; // Clear previous results
      
          const results = pages.filter(page =>
              page.title.toLowerCase().includes(query) ||
              page.description.toLowerCase().includes(query)
          );
      
          if (results.length > 0) {
              results.forEach(result => {
                  const resultItem = document.createElement('div');
                  resultItem.classList.add('result-item');
                  resultItem.innerHTML = `
                      <a href="${result.url}">${result.title}</a>
                      <p>${result.description}</p>
                  `;
                  resultsContainer.appendChild(resultItem);
              });
          } else {
              resultsContainer.innerHTML = '<p>No results found.</p>';
          }
      }
      