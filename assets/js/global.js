document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form');

  if (form) {
    const emailInput = document.getElementById('exampleInputEmail1');
    const passwordInput = document.getElementById('exampleInputPassword1');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const successMsg = document.querySelector('.success-msg');

    // Email validation
    function validateEmail() {
      const isValid = emailInput.value.trim() !== '' && emailInput.value.includes('@');
      emailInput.classList.toggle('is-invalid', !isValid);
      emailInput.setAttribute('aria-invalid', !isValid);
      emailError.style.display = isValid ? 'none' : 'block';
      emailInput.setAttribute('aria-describedby', isValid ? 'emailHelp' : 'emailHelp email-error');
      return isValid;
    }

    // Password validation
    function validatePassword() {
      const isValid = passwordInput.value === 'Password123';
      passwordInput.classList.toggle('is-invalid', !isValid);
      passwordInput.setAttribute('aria-invalid', !isValid);
      passwordError.style.display = isValid ? 'none' : 'block';
      passwordInput.setAttribute('aria-describedby', isValid ? 'passwordHelper' : 'passwordHelper password-error');
      return isValid;
    }

    // Focus the first invalid field
    function focusFirstInvalidField() {
      if (emailInput.classList.contains('is-invalid')) {
        emailInput.focus();
      } else if (passwordInput.classList.contains('is-invalid')) {
        passwordInput.focus();
      }
    }

    // Handle form submission
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Always prevent submission for the demo

      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();

      if (isEmailValid && isPasswordValid) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
        successMsg.focus();
      } else {
        focusFirstInvalidField();
      }
    });

    // Revalidate on change and focus out
    emailInput.addEventListener('change', validateEmail);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('change', validatePassword);
    passwordInput.addEventListener('blur', validatePassword);
  }
});



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
          url: '/a11y-annotations/index.html',
          description: 'Introduction to the A11y Annotations repository, helping Designers, Auditors, and Developers collaborate for accessible design and development.',
          content: 'This repository empowers Designers, Auditors and Developers to collaborate within Figma and streamline the process of creating born accessible interactives, webpages and components. Designers can reference this repository for accessibility guidance during their design process. Auditors may use this repository to help identify potential accessibility issues in the design phase...'
        },
        {
          title: 'Accessibility Checklist',
          url: '/a11y-annotations/default/accessibility-checklist.html',
          description: 'The complete accessibility checklist for evaluating heuristic categories such as structure, forms, color, navigation, nontext content, interactivity, movement and flashing, timing, and screen magnification.',
          content: 'This page provides a comprehensive checklist to help designers, auditors, and developers evaluate key accessibility aspects including structure, forms, color contrast, navigation and wayfinding, nontext content, interactive elements, movement and flashing content, timing, and screen magnification adjustments.'
        },
        {
          title: 'How to Annotate',
          url: '/a11y-annotations/default/how-to-annotate.html',
          description: 'Learn how to annotate accessibility issues step by step, covering design changes and developer hand-off in Figma.',
          content: 'Follow these steps to create design annotations for accessibility in Figma. Phase One involves identifying WCAG defects using automated and manual testing tools, adding comments directly to the Figma board for issues like color contrast and form labeling. Phase Two focuses on preparing annotations for developer hand-off using tools like Include—Accessibility Annotations plugin, outlining landmarks, and creating a walkthrough document...'
        },
        {
          title: 'Landmarks',
          url: '/a11y-annotations/templates/general/structure/landmarks.html',
          description: 'Learn about the role of landmarks in accessible web design, including their use and implementation to improve navigation for assistive technology users.',
          content: 'Landmarks identify regions of a screen and help people who use assistive technology to make a mental model of a screen\'s content. Landmark regions must be present and used appropriately to accurately reflect the purpose of the content. Key landmarks include banner, navigation, main, region, and form...',
          wcagCriteria: [
              { id: '1.3.1', description: 'Info and Relationships - Information, structure, and relationships conveyed through presentation can be programmatically determined or available in text.' }
          ]
        },
        {
          "title": "Bypass Blocks",
          "url": "/a11y-annotations/templates/general/interactives/bypass-blocks.html",
          "description": "Explore how bypass blocks enhance accessibility by allowing users to skip repetitive content, improving navigation for keyboard-only and screen reader users.",
          "content": "Bypass blocks provide mechanisms, such as skip links, that allow users to bypass repetitive sections like navigation menus and footers, enabling faster access to main content. They are especially beneficial for keyboard and screen reader users, allowing for smoother navigation and a more efficient browsing experience. Implementing bypass blocks effectively meets accessibility requirements and ensures that key content is easily reachable for all users.",
          "wcagCriteria": [
            { "id": "2.4.1", "description": "Bypass Blocks - A mechanism is available to bypass blocks of content that are repeated on multiple web pages." }
          ]
        },        
        {
          title: 'Headings',
          url: '/a11y-annotations/templates/general/structure/headings.html',
          description: 'How to structure headings for accessibility, ensuring a logical and meaningful hierarchy for better navigation and understanding.',
          content: 'Properly structured headings provide a hierarchical structure to your content, making it easier for all users, including those who rely on screen readers, to navigate and understand your web page. Heading levels should be used sequentially, starting with <code>&lt;h1&gt;</code> for the main page title and following with <code>&lt;h2&gt;</code>, <code>&lt;h3&gt;</code>, and so on...',
          wcagCriteria: [
            { id: '1.3.1', description: 'Info and Relationships - Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.' },
            { id: '2.4.6', description: 'Headings and Labels - Headings and labels describe the topic or purpose.' }
          ]
        },        
        {
          "title": "Meaningful Sequence",
          "url": "/a11y-annotations/templates/general/structure/meaningful-sequence.html",
          "description": "Guidelines for ensuring that content is presented in a logical reading order for assistive technologies.",
          "content": "This page covers accessibility guidelines related to presenting content in a meaningful sequence, ensuring that the order preserves its intended meaning regardless of visual layout.",
          "wcagCriteria": [
            { "id": "1.3.2", "description": "Meaningful Sequence - Content is presented in a logical reading sequence." }
          ]
        },
        {
          "title": "Orientation",
          "url": "/a11y-annotations/templates/general/structure/orientation.html",
          "description": "Guidelines for ensuring that web content is accessible in both portrait and landscape orientations.",
          "content": "This page covers accessibility guidelines for ensuring that content adapts to different device orientations, avoiding orientation lock unless essential.",
          "wcagCriteria": [
            { "id": "1.3.4", "description": "Orientation - Content is accessible in both portrait and landscape orientations." }
          ]
        },
        {
          "title": "Page Titled",
          "url": "/a11y-annotations/templates/general/structure/page-titled.html",
          "description": "Guidelines for ensuring that web pages have descriptive and informative titles.",
          "content": "This page outlines best practices for creating clear page titles that reflect the content and purpose of the webpage.",
          "wcagCriteria": [
            { "id": "2.4.2", "description": "Page Titled - Web pages have titles that describe the topic or purpose." }
          ]
        },
        {
          "title": "Multiple Ways",
          "url": "/a11y-annotations/templates/general/structure/multiple-ways.html",
          "description": "Guidelines for providing multiple navigation methods to help users locate content on a website.",
          "content": "This page covers accessibility guidelines for offering diverse navigation options, such as primary menus, site maps, search functions, and breadcrumb trails, to facilitate content discovery and achieve pedagogical learning outcomes.",
          "wcagCriteria": [
            { "id": "2.4.5", "description": "Multiple Ways - More than one way is available to locate a webpage within a set of webpages." }
          ]
        },
        {
          "title": "Language",
          "url": "/a11y-annotations/templates/general/structure/language.html",
          "description": "Guidelines for specifying the language of a webpage and its parts for proper assistive technology interpretation.",
          "content": "This page outlines accessibility guidelines for declaring the default language of a webpage using the lang attribute, as well as marking passages in different languages with additional lang attributes to ensure correct pronunciation and comprehension.",
          "wcagCriteria": [
            { "id": "3.1.1", "description": "Language of Page - The default language of the webpage is programmatically determined." },
            { "id": "3.1.2", "description": "Language of Parts - The language of each passage or phrase is programmatically determined." }
          ]
        },        
        {
          title: 'Text Best Practices',
          url: '/a11y-annotations/templates/general/structure/text-best-practices.html',
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
          url: '/a11y-annotations/templates/general/structure/lists.html',
          description: 'Learn how to create accessible lists using proper semantic markup for unordered, ordered, and definition lists.',
          content: 'Semantically marking up lists helps assistive technologies understand the structure and purpose of the content. Visually presented lists must be in semantic list markup to ensure information and relationships are programmatically determinable. Different list types include unordered, ordered, and definition lists...',
          wcagCriteria: [
              { id: '1.3.1', description: 'Info and Relationships - Information, structure, and relationships conveyed through presentation can be programmatically determined or available in text.' }
          ]
        },  
        {
          title: 'Consistent Navigation',
          url: '/a11y-annotations/templates/general/structure/consistent-navigation.html',
          description: 'Ensure navigational mechanisms are presented in the same relative order on every page to improve predictability and usability.',
          content: 'The Consistent Navigation guideline ensures that navigation mechanisms, such as menus, search bars, and other recurring elements, occur in the same relative order across all pages unless a user initiates a change. This consistency improves user experience, particularly for those relying on assistive technologies, by making navigation predictable and reducing cognitive load. Even minor changes in navigation order can disorient users with cognitive disabilities or those using screen readers. Best practices include maintaining a consistent order and placement of navigation elements, using a standard template for headers, footers, and menus, and offering flexibility for user customization, such as pinning or rearranging links.',
          wcagCriteria: [
            { id: '3.2.3', description: 'Consistent Navigation - Navigational mechanisms that are repeated on multiple pages occur in the same relative order each time they are repeated, unless a change is initiated by the user.' }
          ]
        },        
        {
          title: 'Use of Color',
          url: '/a11y-annotations/templates/general/color/use-of-color.html',
          description: 'Ensure proper use of color to meet accessibility standards and avoid relying solely on color to convey information.',
          content: 'Color must not be used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Designers should provide alternative indicators such as text labels, icons, or patterns...',
          wcagCriteria: [
              { id: '1.4.1', description: 'Use of Color - Color is not used as the only visual means of conveying information.' }
          ]
        },
        {
          title: 'Text Color Contrast',
          url: '/a11y-annotations/templates/general/color/text-contrast.html',
          description: 'How to achieve sufficient text color contrast to meet WCAG accessibility standards.',
          content: 'The visual presentation of text and images of text must have a contrast ratio of at least 4.5:1 for regular-sized text, and 3:1 for large-sized text or bold text. Designers should use tools like the Color Contrast Analyzer to ensure these contrast ratios are met...',
          wcagCriteria: [
              { id: '1.4.3', description: 'Contrast (Minimum) - Text must have sufficient contrast against its background to ensure readability.' }
          ]
        },
        {
          title: 'Non-text Color Contrast',
          url: '/a11y-annotations/templates/general/color/non-text-contrast.html',
          description: 'Guidance for meeting non-text color contrast requirements, ensuring sufficient contrast for UI components and graphical objects.',
          content: 'Non-text elements like user interface components and graphical objects must have a contrast ratio of at least 3:1 against adjacent colors. Designers should use tools like the Color Contrast Analyzer to evaluate the contrast of these elements...',
          wcagCriteria: [
              { id: '1.4.11', description: 'Non-text Contrast - The visual presentation of non-text elements must have a contrast ratio of at least 3:1.' }
          ]
        },
        {
          title: 'Images',
          url: '/a11y-annotations/templates/general/non-text-content/images.html',
          description: 'Accessible image guidelines and best practices, including meaningful and decorative images, SVGs, and icons.',
          content: 'All meaningful non-text content, such as images, must have alt text that provides the same information found in the content. Decorative images should have alt="", while complex images should provide more detailed alternatives or descriptions...',
          wcagCriteria: [
              { id: '1.1.1', description: 'Non-text Content - All non-text content must have text alternatives that serve the same purpose.' }
          ]
        },
        {
          title: 'Images of Text',
          url: '/a11y-annotations/templates/general/non-text-content/images-of-text.html',
          description: 'Why and how to avoid using images of text unless essential, and how to meet contrast requirements.',
          content: 'If the visual presentation can be achieved using text, avoid using images of text. Exceptions include logotypes and cases where the visual presentation of the text is essential to the message. Ensure contrast meets accessibility standards...',
          wcagCriteria: [
              { id: '1.4.5', description: 'Images of Text - Text is used to convey information rather than images of text, with exceptions for logotypes and essential presentations.' },
              { id: '1.4.3', description: 'Contrast (Minimum) - The contrast ratio for text and images of text must be at least 4.5:1.' }
          ]
        },
        {
          title: 'Time-based Media',
          url: '/a11y-annotations/templates/general/non-text-content/media.html',
          description: 'Requirements and best practices for ensuring accessibility of time-based media, including captions, transcripts, and audio descriptions.',
          content: 'All prerecorded audio-only, video-only, and video with audio content must have appropriate captions, transcripts, or audio descriptions to ensure accessibility for users with disabilities. Live video with audio must have real-time captions...',
          wcagCriteria: [
              { id: '1.2.1', description: 'Audio-only and Video-only - Provide alternatives for prerecorded audio-only or video-only content.' },
              { id: '1.2.2', description: 'Captions (Prerecorded) - Provide captions for all prerecorded audio content in synchronized media.' },
              { id: '1.2.3', description: 'Audio Description or Media Alternative - Provide audio description or media alternatives for prerecorded video content.' },
              { id: '1.2.4', description: 'Captions (Live) - Provide captions for all live audio content in synchronized media.' },
              { id: '1.2.5', description: 'Audio Description (Prerecorded) - Provide audio descriptions for all prerecorded video content.' },
              { id: '1.4.2', description: 'Audio Control - Provide a mechanism to pause or stop autoplaying audio and adjust volume.' }
          ]
        },
        {
          title: 'Timing Adjustable',
          url: '/a11y-annotations/templates/general/non-text-content/timing-adjustable.html',
          description: 'Guidelines for making timing adjustable for users, including options to disable, extend, or adjust time limits.',
          content: 'Users must be provided with options to turn off, adjust, or extend time limits on interactive content. These mechanisms should be easy to access and use, with clear warnings before time limits expire...',
          wcagCriteria: [
              { id: '2.2.1', description: 'Timing Adjustable - Users can turn off, adjust, or extend time limits, with exceptions for real-time, essential, and long-duration activities.' }
          ]
        },
        {
          title: 'Pause, Stop, Hide',
          url: '/a11y-annotations/templates/general/non-text-content/pause-stop-hide.html',
          description: 'Learn how to allow users to pause, stop, or hide moving, blinking, or auto-updating content.',
          content: 'For any moving, blinking, scrolling, or auto-updating content that starts automatically, users must have mechanisms to pause, stop, or hide the content. This ensures content is accessible for users with motion sensitivities or attention difficulties...',
          wcagCriteria: [
              { id: '2.2.2', description: 'Pause, Stop, Hide - Provide mechanisms to control moving, blinking, scrolling, or auto-updating content that lasts longer than five seconds.' }
          ]
        },
        {
          title: 'Three Flashes or Below Threshold',
          url: '/a11y-annotations/templates/general/non-text-content/three-flashes.html',
          description: 'Avoid content that flashes more than three times per second to protect users from seizures or physical reactions.',
          content: 'Web pages must ensure that content does not flash more than three times per second. If flashing is necessary, it must stay below the general and red flash thresholds to minimize risks...',
          wcagCriteria: [
              { id: '2.3.1', description: 'Three Flashes or Below Threshold - Ensure content does not flash more than three times per second to prevent seizures.' }
          ]
        },
        {
          title: 'Name, Role, Value',
          url: '/a11y-annotations/templates/general/interactives/name-role-value.html',
          description: 'Ensure all user interface components have programmatically determined names, roles, and values to improve accessibility for assistive technology users.',
          content: 'The Name, Role, Value guideline ensures that every interactive component, such as buttons, form fields, sliders, and custom widgets, has clear and accessible information. Properly labeling elements and providing their roles helps assistive technologies inform users about the function of each component. Additionally, any state changes (e.g., a checkbox becoming checked or a form input showing an error) must be communicated programmatically to keep users informed of updates. This is critical for users relying on assistive technologies to interact with web content effectively. Use semantic HTML elements or ARIA attributes like aria-label, aria-labelledby, aria-describedby, and role to ensure accurate implementation. Dynamic content or custom widgets often require additional scripting to meet this guideline.',
          wcagCriteria: [
            { id: '4.1.2', description: 'Name, Role, Value - For all user interface components, the name, role, and value must be programmatically determined and communicated to assistive technologies.' }
          ]
        },
        {
          title: 'Status Messages',
          url: '/a11y-annotations/templates/general/interactives/status-messages.html',
          description: 'Ensure status messages are conveyed programmatically to users without requiring a change in focus, improving accessibility for dynamic content.',
          content: 'The Status Messages guideline ensures that important updates, such as form validation errors or success messages, are communicated to users without disrupting their workflow or requiring a change in focus. These messages must be programmatically identified and automatically announced by assistive technologies. Using ARIA live regions, such as aria-live and aria-relevant, or native elements like <output>, ensures these updates are accessible. Examples include form submission confirmations (e.g., "Form submitted successfully"), error messages (e.g., "Please enter a valid email address"), live search results, system notifications, progress updates, and alerts about changes in system status (e.g., "Network connection restored").',
          wcagCriteria: [
            { id: '4.1.3', description: 'Status Messages - Status messages can be programmatically determined through role or properties so that they are presented to the user without receiving focus.' }
          ]
        },                
        {
          title: 'Keyboard',
          url: '/a11y-annotations/templates/general/interactives/keyboard.html',
          description: 'Ensure full keyboard accessibility for interactive content.',
          content: 'Keyboard accessibility ensures that all functionality of the content is operable through a keyboard interface, without specific timing requirements for keystrokes. This prevents users from being trapped in any part of the page and ensures seamless navigation.',
          wcagCriteria: [
              { id: '2.1.1', description: 'Keyboard - All content functionality must be operable via a keyboard interface without timing dependencies.' },
              { id: '2.1.2', description: 'No Keyboard Trap - Keyboard focus can be moved to and away from any component using the keyboard without getting trapped.' },
              { id: '2.1.4', description: 'Character Key Shortcuts - Single character keys can be turned off, remapped or activated only on focus.' }
          ]
        },
        {
          title: 'Focus Visible',
          url: '/a11y-annotations/templates/general/interactives/focus-visible.html',
          description: 'Provide clear focus indicators for users navigating by keyboard.',
          content: 'Focus Visible ensures that all interactive elements have a visible focus indicator for keyboard navigation. This is critical for helping users, particularly those who rely on keyboard navigation, identify which element has focus and ensure smooth navigation.',
          wcagCriteria: [
              { id: '2.4.7', description: 'Focus Visible - Interactive elements must have a visible focus indicator, and it must be clearly distinguishable from the rest of the page.' }
          ]
        },
        {
          title: 'Focus Order',
          url: '/a11y-annotations/templates/general/interactives/focus-order.html',
          description: 'How to maintain logical focus order for accessibility.',
          content: 'Focus Order ensures that focusable components on a web page are navigated in a logical sequence that preserves meaning and usability. This includes maintaining logical tab order, handling dialogs and modals, and ensuring users can navigate smoothly through interactive elements.',
          wcagCriteria: [
              { id: '2.4.3', description: 'Focus Order - Focusable components receive focus in an order that preserves meaning and operability.' }
          ]
        },
        {
          title: 'On Focus',
          url: '/a11y-annotations/templates/general/interactives/on-focus.html',
          description: 'Best practices for handling content when elements receive focus.',
          content: 'On Focus addresses how elements behave when they receive focus. To comply with WCAG, no automatic context changes should occur when focus is applied to any component, and any actions must be triggered through explicit user interaction, not just by focus alone.',
          wcagCriteria: [
              { id: '3.2.1', description: 'On Focus - Focus should not trigger automatic context changes.' }
          ]
        }, 
        {
          title: 'On Input',
          url: '/a11y-annotations/templates/general/interactives/on-input.html',
          description: 'Accessible handling of changes that result from user input.',
          content: 'On Input ensures that adjusting user interface components does not automatically cause a change of context. Any changes in context must be initiated by explicit user actions, and users must be informed about behavior that could lead to such changes.',
          wcagCriteria: [
              { id: '3.2.2', description: 'On Input - Input should not cause automatic context changes without explicit user action.' }
          ]
        },
        {
          title: 'Dynamic Changes',
          url: '/a11y-annotations/templates/general/interactives/dynamic-changes.html',
          description: 'Ensure users are aware of dynamic changes in content.',
          content: 'When content is updated dynamically, users must be made aware of the change through accessible mechanisms, particularly for screen reader users. Developers can use ARIA live regions or manage focus to ensure updates are communicated effectively without disrupting the user experience.',
          wcagCriteria: [
              { id: '4.1.2', description: 'Name, Role, Value - Dynamically updated content must be announced to assistive technologies.' }
          ]
        },
        {
          title: 'Pointer Cancellation',
          url: '/a11y-annotations/templates/general/interactives/pointer-cancelation.html',
          description: 'Ensure functions operated by a single pointer are designed to prevent accidental activation by offering mechanisms to abort, undo, or reverse actions.',
          content: 'The Pointer Cancellation guideline ensures that functions activated by a single pointer (e.g., mouse or touch) are designed to minimize accidental activation. Functions should not be executed on the down-event unless essential, and mechanisms must be provided to abort the action before completion, undo the action after completion, or reverse the outcome of the preceding down-event upon releasing the pointer. These measures ensure that users, including those with motor disabilities, can interact with web content confidently and accurately without triggering unintended actions.',
          wcagCriteria: [
            { id: '2.5.2', description: 'Pointer Cancellation - For functions operated by a single pointer, at least one mechanism is available to prevent accidental activation or allow reversal of actions.' }
          ]
        },               
        {
          title: 'Pointer Gestures',
          url: '/a11y-annotations/templates/general/interactives/pointer-gestures.html',
          description: 'Ensure web content requiring complex gestures is accessible by providing simpler, single-point alternatives that work with a single pointer.',
          content: 'The Pointer Gestures guideline ensures that web content requiring multi-point or path-based gestures, such as pinch-to-zoom or drag-and-drop, is accessible by offering simpler, single-point alternatives. Web content should provide alternatives, such as buttons or input fields, for complex gestures and ensure controls are operable with standard input methods like single-tap or click. Tasks requiring gestures must also be performable using simpler pointer-based methods or keyboard navigation. These practices enable users with limited dexterity or assistive devices to interact effectively with web content.',
          wcagCriteria: [
            { id: '2.5.1', description: 'Pointer Gestures - Multi-point or path-based gestures must have an alternative method of operation that requires only a single pointer.' }
          ]
        },
        {
          title: 'Motion Actuation',
          url: '/a11y-annotations/templates/general/interactives/motion-actuation.html',
          description: 'Ensure functionality triggered by motion, such as shaking or tilting, is also accessible via conventional inputs and can be disabled unless essential.',
          content: 'The Motion Actuation guideline ensures that any functionality triggered by device or user motion, such as shaking or tilting a device, is accessible via standard controls or interface components. Users must be able to disable motion-based interactions to prevent unintended activation unless the motion is essential to the functionality. Alternative controls, such as buttons or gestures, must be provided to ensure accessibility for users who may have difficulty performing specific motions or who prefer alternative interaction methods for personal or accessibility reasons.',
          wcagCriteria: [
            { id: '2.5.4', description: 'Motion Actuation - Functionality triggered by motion can also be operated by standard controls and can be disabled unless it is essential to the design.' }
          ]
        },        
        {
          title: "Sensory Characteristics",
          url: "/a11y-annotations/templates/general/structure/sensory-characterists.html",
          description: "Ensure that instructions for interacting with content do not rely solely on sensory characteristics such as shape, size, visual location, orientation, or sound.",
          content: "The Sensory Characteristics guideline ensures that instructions are inclusive and do not rely solely on sensory cues like shape, size, color, or location. Instructions should use descriptive text to complement sensory information. Programmatically determinable descriptions and accessible names should be provided using semantic HTML and ARIA attributes. Relying solely on visual or sensory characteristics can create barriers for users with vision impairments, cognitive disabilities, or those relying on assistive technologies.",
          wcagCriteria: [
            {
              id: "1.3.3",
              description: "Sensory Characteristics - Instructions for interacting with content do not rely solely on sensory characteristics such as shape, size, visual location, orientation, or sound."
            }
          ]
        },                                      
        {
          title: 'Target Size',
          url: '/a11y-annotations/templates/general/interactives/touch-target.html',
          description: 'Ensure sufficient target size for touch interactions.',
          content: 'Touch targets must be at least 24 by 24 CSS pixels to meet WCAG 2.5.8, with a recommended size of 44 by 44 for better accessibility. Ensure spacing between targets to prevent accidental taps.',
          wcagCriteria: [
              { id: '2.5.8', description: 'Target Size - The target size for pointer inputs must be at least 24x24 CSS pixels, with 44x44 CSS pixels recommended as a best practice.' }
          ]
        },
        {
          title: 'Resize Text',
          url: '/a11y-annotations/templates/general/screen-magnification/resize.html',
          description: 'How to support resizing of text for better readability.',
          content: 'Text must be resizable up to 200% without loss of content or functionality. Designers should use flexible layouts and relative units for text sizing to support resizing, and developers should ensure content remains accessible and usable when text is resized.',
          wcagCriteria: [
              { id: '1.4.4', description: 'Resize Text - Text can be resized up to 200% without loss of content or functionality.' }
          ]
        },
        {
          title: 'Reflow',
          url: '/a11y-annotations/templates/general/screen-magnification/reflow.html',
          description: 'Allow reflowing content to fit different screen sizes.',
          content: 'Content must reflow to fit within 320 CSS pixels wide and 256 CSS pixels tall, without requiring two-dimensional scrolling. Designers and developers must use responsive layouts and scalable units to ensure content adjusts dynamically to different screen sizes while retaining full functionality and meaning.',
          wcagCriteria: [
              { id: '1.4.10', description: 'Reflow - Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions.' }
          ]
        },
        {
          title: 'Text Spacing',
          url: '/a11y-annotations/templates/general/screen-magnification/text-spacing.html',
          description: 'Provide adjustable text spacing for better readability.',
          content: 'Ensure text spacing is flexible to accommodate adjustments in line height, paragraph spacing, letter spacing, and word spacing without loss of content or functionality. Designers and developers must ensure text remains readable and functional when spacing properties are increased for accessibility purposes.',
          wcagCriteria: [
              { id: '1.4.12', description: 'Text Spacing - Content must maintain functionality and readability when text spacing is adjusted by the user.' }
          ]
        },
        {
          "title": "Accordion",
          "url": "/a11y-annotations/templates/components/accordion.html",
          "description": "Accessible accordion components allow users to expand and collapse sections of content. Implementing a fully accessible accordion requires proper use of ARIA roles and properties, keyboard navigation support, and clear visual indicators for expanded and collapsed states.",
          "content": "Accordion components help organize content by allowing users to toggle the visibility of sections. Accessible accordions must be operable by keyboard, use ARIA roles and properties to indicate states, and provide clear visual feedback. Focus management and proper semantic labels ensure a smooth, accessible user experience."
        },
        {
          "title": "Alert",
          "url": "/a11y-annotations/templates/components/alert.html",
          "description": "Create accessible alerts for web content to notify users about important information. Alerts should be properly announced by assistive technologies and must be visually and programmatically distinct to ensure they capture user attention.",
          "content": "Accessible alert components use ARIA roles to ensure proper announcement by assistive technologies, notifying users of important messages. Alerts should use role='alert', be visible until dismissed, and maintain strong visual contrast to ensure readability. Developers must ensure alerts are dynamically injected and maintain keyboard accessibility for all interactive elements."
        },  
        {
          "title": "Breadcrumb",
          "url": "/a11y-annotations/templates/components/breadcrumb.html",
          "description": "Guide users with accessible breadcrumb navigation by using proper semantic structure, ensuring visual clarity, and providing programmatic indicators of the current page.",
          "content": "Accessible breadcrumb components help users understand their location within the website's hierarchy. Breadcrumb navigation should be contained within a <nav> or <div> with role='navigation' and structured using an ordered list. Ensure that the current page is programmatically identifiable with aria-current='page' and that the links are clearly distinguishable with proper contrast and interactive states."
        },
        {
          "title": "Button",
          "url": "/a11y-annotations/templates/components/button.html",
          "description": "Best practices for creating accessible buttons that are fully functional with keyboard and assistive technologies while ensuring clear visual indicators and proper contrast.",
          "content": "Accessible buttons must be interactive, clearly labeled, and fully operable by all users, including those using a keyboard or assistive technologies. Buttons should be implemented with <code>&lt;button&gt;</code> elements or other elements using role='button' and must have clear, descriptive text or labels. Ensure that button states, such as focus or disabled, are visually and programmatically distinguishable. Use ARIA attributes as needed for buttons with specific functions, such as aria-haspopup for dialog-opening buttons, and ensure sufficient contrast for all text and icons."
        },
        {
          "title": "Carousel",
          "url": "/a11y-annotations/templates/components/carousel.html",
          "description": "Learn how to build accessible carousels or explore alternative methods for presenting content commonly found in carousels.",
          "content": "Carousels are often problematic for accessibility, with issues such as inconsistent navigation, poor focus management, and timing constraints. For a more accessible approach, consider alternatives like static content displays, tabbed interfaces, or collapsible sections. If a carousel is required, ensure it is fully controllable with keyboard navigation, play/pause options, and proper ARIA attributes to convey the current state to assistive technologies."
        },
        {
          "title": "Combobox",
          "url": "/a11y-annotations/templates/components/combobox.html",
          "description": "Explore accessible combobox implementations, ensuring proper ARIA roles, keyboard navigation, and focus management for a seamless user experience.",
          "content": "Comboboxes are interactive widgets that allow users to select options from a dropdown list or provide input in an editable field. To ensure accessibility, comboboxes must use correct ARIA roles and attributes. The input element must have role=\"combobox\", aria-expanded should indicate whether the dropdown is open, and aria-controls must link the combobox to its associated options list. Individual options should have role=\"option\", and aria-labelledby should associate the combobox with its label. Keyboard navigation is essential: users must be able to navigate options using arrow keys, select with Enter, and close the dropdown with Escape. Focus management should seamlessly transition between the input and options list without disrupting workflow. Use aria-expanded to indicate the current state of the dropdown, ensuring programmatic and visual clarity. Examples include select-only comboboxes, editable comboboxes with various autocomplete behaviors, and more complex implementations such as date pickers. For comprehensive patterns and examples, refer to W3C APG Combo Box Patterns."
        },        
        {
          "title": "Data Chart",
          "url": "/a11y-annotations/templates/components/data-chart.html",
          "description": "Implement accessible data charts on your website.",
          "content": "Data charts visually represent data, and to ensure they are accessible, they must include clear labels, provide alternative text descriptions, and avoid relying solely on color. Charts should have sufficient color contrast, be keyboard accessible, and be designed to work across all devices. It is also beneficial to offer the data in supplemental formats, such as tables or lists, for users who may require additional accessibility options."
        },  
        {
          "title": "Data Visualization",
          "url": "/a11y-annotations/templates/components/data-visualization.html",
          "description": "Accessible data visualization techniques and best practices.",
          "content": "Accessible data visualizations ensure that all users, including those with disabilities, can interpret and interact with the visual data. This includes providing alternative text descriptions, using patterns and shapes in addition to color, ensuring sufficient color contrast, and making the visualizations keyboard accessible. Data visualizations should be responsive and adaptable to different screen sizes, and data should also be presented in supplemental formats such as tables or lists."
        },
        {
          "title": "Dialog",
          "url": "/a11y-annotations/templates/components/dialog.html",
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
          "url": "/a11y-annotations/templates/components/forms.html",
          "description": "Build accessible forms with proper field labels, clear instructions, and programmatically associated error messages.",
          "content": "Accessible forms must follow WCAG guidelines to ensure usability for all users, including those with disabilities. Each form field should have a descriptive, visible label, programmatically associated with the input using the <code>&lt;label&gt;</code> element or ARIA attributes such as aria-labelledby or aria-label for elements without visible labels. Placeholder text alone is insufficient because it disappears as users type. Required fields should be clearly indicated, and instructions for the form should explain the meaning of visual indicators like asterisks (*). Forms must provide real-time validation for required fields and specific format requirements, with error messages presented clearly next to the relevant field. These error messages should be associated with the field via aria-describedby and visible to screen readers. Form elements should be operable via keyboard, and custom controls must include ARIA roles and focus management. Success or error states should be communicated using ARIA live regions to ensure assistive technology users are notified of changes. Ensure contrast ratios meet WCAG standards, with a minimum contrast ratio of 4.5:1 for normal text and 3:1 for larger text. Additionally, HTML5 validation should be disabled in favor of custom validation techniques that allow for more accessible, user-friendly feedback. For complex inputs, provide examples of the expected format and ensure the logical order of fields follows a natural reading pattern. Consider grouping related form elements like radio buttons or checkboxes and providing additional instructions where necessary."
        },
        {
          "title": "Form Group",
          "url": "/a11y-annotations/templates/components/form-group.html",
          "description": "Group form elements for better accessibility, ensuring clear relationships and logical structure.",
          "content": "Form groups improve the accessibility and usability of forms by grouping related controls like checkboxes, radio buttons, or input fields. Grouping related elements with a <code>&lt;fieldset&gt;</code> and a descriptive <code>&lt;legend&gt;</code> makes it easier for users, particularly those using assistive technologies, to comprehend the form. These groupings provide clear relationships between form controls, allowing users to concentrate on smaller sections of the form. For form controls that aren't easily grouped with <code>&lt;fieldset&gt;</code> and <code>&lt;legend&gt;</code>, use <code>role='group'</code> with <code>aria-labelledby</code> to achieve similar functionality. The grouping should also ensure accessibility for keyboard navigation, with no interference to logical tab order. Common examples include grouping radio buttons for selecting options or checkboxes for multiple selections. Ensure form groups are marked with sufficient visual cues, such as color contrast and a logical reading order to maintain a smooth user experience."
        },     
        {
          "title": "Link",
          "url": "/a11y-annotations/templates/components/links.html",
          "description": "Create accessible links for easy navigation, ensuring clarity and proper functionality across devices.",
          "content": "Links are essential navigation elements that must be accessible for all users, including those with disabilities. A link (<code>&lt;a&gt;</code>) is typically used to navigate between webpages, resources, or locations within a page. Links must be styled and marked up properly to be distinguishable from other content. They must have accessible names that clearly indicate their purpose and destination. Links like 'Learn More' or 'Click Here' should provide additional context using aria-labels or visually hidden text to clarify their destination. Additionally, links should be usable with a keyboard alone and have a sufficient contrast ratio with surrounding text to ensure visibility. All links must be in focus order and accessible by assistive technologies to ensure that users understand where each link leads without relying on surrounding content or unclear descriptions."
        },
        {
          "title": "Listbox",
          "url": "/a11y-annotations/templates/components/listbox.html",
          "description": "Learn how to create accessible listboxes, ensuring proper ARIA roles, keyboard navigation, and focus management for usability and conformance.",
          "content": "Listboxes are interactive widgets that enable users to select one or more options from a list. To ensure accessibility, listboxes must adhere to WCAG requirements and utilize proper ARIA roles and attributes. The container must have role=\"listbox\", each list item should have role=\"option\", and aria-activedescendant must be used to manage focus on the currently selected item. Focus must be managed effectively to ensure it remains within the listbox, with the selected option clearly indicated both visually and programmatically. Listboxes should support robust keyboard navigation, allowing users to navigate options using arrow keys, select with Enter, and close the listbox (if applicable) using Escape. Use aria-labelledby to associate the listbox with its label, and aria-selected to denote the selected option. For collapsible listboxes, aria-expanded should be used to indicate their current state. Examples include scrollable listboxes, grouped options, and multi-select listboxes with rearrangeable options. For detailed patterns and implementations, refer to W3C APG Listbox Patterns."
        },        
        {
          "title": "Navigation",
          "url": "/a11y-annotations/templates/components/navigation.html",
          "description": "Best practices for accessible website navigation.",
          "content": "Navigation elements must be properly marked up and styled to ensure accessibility. All navigation bars should be contained within a <code>&lt;nav&gt;</code> element or a sectioning element with role=\"navigation\". When multiple navigation elements exist on the same page, each must have a unique aria-label to differentiate them for screen reader users. Navigation items should be presented in a list structure to reflect their relationships, using <code>&lt;ul&gt;</code> for unordered lists of links. Submenu disclosure buttons should be marked up with aria-expanded and aria-controls attributes, and should function equally with both mouse and keyboard interaction. For mobile navigation, buttons should have accessible names using aria-label or visually hidden text, and toggling states (expanded/collapsed) should be programmatically indicated. Links within navigation menus must be distinguishable from other content with appropriate visual cues and contrast ratios, and interactive elements should have clear focus indicators to ensure accessibility during keyboard navigation. All states (collapsed, expanded, current page, etc.) must be clearly communicated both visually and programmatically to assistive technologies."
        }, 
        {
          "title": "Pagination",
          "url": "/a11y-annotations/templates/components/pagination.html",
          "description": "Implement accessible pagination for web content.",
          "content": "Pagination helps users navigate through multiple pages of content. Accessible pagination must be operable via keyboard, and screen readers should be able to identify the current page. Ensure the active page is visually and programmatically indicated using aria-current=\"page.\" Disabled links should use aria-disabled=\"true\" and tabindex=\"-1\" to remove them from focus order. Include accessible names for pagination controls, and use aria-label or sr-only text to describe icons. Pagination should be structured in lists for better semantics and operability across devices."
        }, 
        {
          title: 'Progress',
          url: '/a11y-annotations/templates/components/progress.html',
          description: 'Accessible progress indicators for dynamic content.',
          content: 'Progress bars provide visual indicators of ongoing processes, such as loading or data uploads. To ensure accessibility, they must be designed with proper ARIA attributes to convey real-time status to assistive technologies, offer sufficient color contrast, and include accessible alternatives for all users.'
        },      
        {
          title: 'Table',
          url: '/a11y-annotations/templates/components/tables.html',
          description: 'Create accessible data tables for web content.',
          content: 'Tables must use semantic markup, with table headers (<th>) and data cells (<td>) appropriately defined. For accessible names, include a <caption> tag or aria-labelledby. In complex tables, use scope, ids, and headers attributes to ensure the relationship between data cells and headers is programmatically determined. Developers must ensure logical structure and use sufficient color contrast for better legibility.'
        },   
        {
          title: 'Tabs',
          url: '/a11y-annotations/templates/components/tabs.html',
          description: 'Build accessible tab interfaces for content sections.',
          content: 'Tabs must use the appropriate ARIA roles such as role="tablist" on the container, role="tab" on tab buttons, and role="tabpanel" on content panels. Keyboard navigation must be supported, including focus management and arrow key navigation. Use aria-controls to associate each tab with its corresponding content panel and aria-selected="true" to indicate the active tab. Ensure clear visual indicators for active/inactive tabs and follow consistent design patterns across views.'
        },  
        {
          title: 'Tooltip',
          url: '/a11y-annotations/templates/components/tooltip.html',
          description: 'Best practices for accessible tooltips.',
          content: 'Tooltips must display on both hover and focus events and be dismissible with the ESC key if covering other content. Use aria-describedby to associate the tooltip with the UI control it describes and aria-hidden="true" to manage visibility for assistive technologies. Ensure tooltips remain visible while hovered or focused, and provide sufficient color contrast for readability.'
        },   
        {
          title: 'Toggletip',
          url: '/a11y-annotations/templates/components/toggletip.html',
          description: 'Ensure accessibility for toggletip elements.',
          content: 'Toggletips must display on both click and keypress events and be dismissible with the ESC key if covering other content. Use aria-describedby to associate the toggletip with the UI control it describes and aria-hidden="true" to manage visibility for assistive technologies. Ensure toggletips remain visible while focused or clicked, and provide sufficient color contrast for readability.'
        }, 
        {
          title: 'Toggle Switch',
          url: '/a11y-annotations/templates/components/toggle-switch.html',
          description: 'Implement accessible toggle switches for user interaction.',
          content: 'Toggle switches must be operable with keyboard (Enter and Space keys) and mouse. Use aria-checked to indicate state, and provide a clear focus indicator. Ensure color contrast meets accessibility standards and that the switch has a minimum target size of 44x44 pixels for touch interactions.'
        },   
        {
          title: 'Video',
          url: '/a11y-annotations/templates/components/video.html',
          description: 'How to make video content accessible for all users.',
          content: 'Ensure video controls have sufficient contrast and provide clear focus indicators for keyboard navigation. Use captions, transcripts, and audio descriptions as necessary, and ensure videos are responsive across devices. Provide an accessible name for video iframes or custom elements.'
        },  
        {
          title: 'General Accessibility Resources',
          url: '/a11y-annotations/templates/resources/general-resources.html',
          description: 'Find general resources on accessibility best practices.',
          content: 'Access links to foundational accessibility resources, including WCAG, ARIA, WebAIM, and the A11Y Project. Resources are categorized by structure, text, landmarks, color, and more.'
        },     
        {
          title: 'Components Resources',
          url: '/a11y-annotations/templates/resources/components-resources.html',
          description: 'Resources for building accessible web components.',
          content: 'Find guides, best practices, and documentation for creating accessible web components such as accordions, alerts, buttons, modals, and more. Resources cover ARIA, inclusive design, and development tips.'
        },   
        {
          title: 'Designer Resources',
          url: '/a11y-annotations/templates/resources/design-resources.html',
          description: 'Accessibility resources specifically for designers.',
          content: 'Explore resources, tools, and articles aimed at helping designers incorporate accessibility into their design process. Includes color contrast tools, Figma plugins, and learning materials focused on accessible design principles.'
        },    
        {
          title: 'Developer Resources',
          url: '/a11y-annotations/templates/resources/development-resources.html',
          description: 'Resources for developers implementing accessible code.',
          content: 'Access tools, guides, and extensions designed for developers focused on building accessible websites. Includes browser extensions, automated testing tools, and comprehensive resources on accessibility implementation.'
        },  
        {
          title: 'Auditor & Testing Resources',
          url: '/a11y-annotations/templates/resources/auditor-resources.html',
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
// Code Snippet Copy Button insertion and Screen Reader Announcement
document.addEventListener('DOMContentLoaded', function () {
  // Check if any <pre><code> elements exist on the page
  if (document.querySelector('pre code')) {
    // Add Copy to Clipboard buttons to all <pre><code> snippets
    document.querySelectorAll('pre code').forEach((codeBlock) => {
      // Create container for pre and button
      const preElement = codeBlock.parentElement;

      // Create the button
      const button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.setAttribute('aria-label', 'Copy code snippet');
      button.setAttribute('name', 'copycode snippet');

      // Add SVG icon and visible label to button
      button.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 9h-4V5H9v4H5v10h14V9zm-8 0h2v2h-2zm0 4h2v2h-2zm4 0h2v2h-2zm-8 0h2v2H7zm0-4h2v2H7zm4 0h2v2h-2zm8-4v2h-4V5h2c1.1 0 2 .9 2 2z"></path>
        </svg>
        <span>Copy</span>
      `;

      // Insert the button above the pre element
      preElement.insertAdjacentElement('beforebegin', button);

      // Create the aria-live polite region
      const liveRegion = document.createElement('div');
      liveRegion.className = 'sr-only';
      liveRegion.setAttribute('aria-live', 'polite');
      preElement.insertAdjacentElement('afterend', liveRegion);

      // Handle button click
      button.addEventListener('click', () => {
        // Copy code to clipboard
        navigator.clipboard.writeText(codeBlock.textContent).then(() => {
          // Add announcement to live region
          liveRegion.textContent = 'Code snippet copied';
          setTimeout(() => {
            liveRegion.textContent = '';
          }, 1000);

          // Change icon to a check mark
          const originalIcon = button.querySelector('svg').outerHTML;
          button.querySelector('svg').innerHTML = `
            <path d="M9 11.5L4.5 7l-1.42 1.41L9 14.33 21 2.33 19.58 1z"></path>
          `;

          // Revert icon back to original after 1 second
          setTimeout(() => {
            button.querySelector('svg').innerHTML = `
              <path d="M19 9h-4V5H9v4H5v10h14V9zm-8 0h2v2h-2zm0 4h2v2h-2zm4 0h2v2h-2zm-8 0h2v2H7zm0-4h2v2H7zm4 0h2v2h-2zm8-4v2h-4V5h2c1.1 0 2 .9 2 2z"></path>
            `;
          }, 1000);
        });
      });

      // Make button keyboard accessible
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          button.click();
        }
      });
    });
  }
});
// Drag and Drop Pattern
const list = document.getElementById('draggable-list');
const liveRegion = document.getElementById('live-region');
let draggedItem = null;
let keyboardDragItem = null;

// Mouse / Pointer Drag Events
list.addEventListener('dragstart', (e) => {
  if (e.target && e.target.nodeName === 'LI') {
    draggedItem = e.target;
    e.target.classList.add('dragging');
    e.target.setAttribute('aria-grabbed', 'true');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.id);
  }
});

list.addEventListener('dragend', (e) => {
  if (draggedItem) {
    draggedItem.classList.remove('dragging');
    draggedItem.setAttribute('aria-grabbed', 'false');
    draggedItem = null;
  }
});

list.addEventListener('dragover', (e) => {
  e.preventDefault(); // Allow drop
  if (e.target && e.target.nodeName === 'LI') {
    e.target.classList.add('dragover');
  }
});

list.addEventListener('dragleave', (e) => {
  if (e.target && e.target.nodeName === 'LI') {
    e.target.classList.remove('dragover');
  }
});

list.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.target && e.target.nodeName === 'LI' && draggedItem) {
    e.target.classList.remove('dragover');
    const rect = e.target.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    if (offset > rect.height / 2) {
      e.target.parentNode.insertBefore(draggedItem, e.target.nextSibling);
    } else {
      e.target.parentNode.insertBefore(draggedItem, e.target);
    }
    liveRegion.textContent = `${draggedItem.textContent} moved.`;
  }
});

// Keyboard Interaction: Use Enter/Space to pick up/drop and Arrow Up/Down to move
list.addEventListener('keydown', (e) => {
  const currentItem = e.target;
  if (currentItem.nodeName !== 'LI') return;

  // Start or drop keyboard drag mode
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    // Toggle selection
    if (!keyboardDragItem) {
      // Pick up the item for keyboard dragging
      keyboardDragItem = currentItem;
      keyboardDragItem.classList.add('dragging');
      keyboardDragItem.setAttribute('aria-grabbed', 'true');
      liveRegion.textContent = `${keyboardDragItem.textContent} picked up. Use arrow keys to move.`;
    } else {
      // Drop the item
      keyboardDragItem.classList.remove('dragging');
      keyboardDragItem.setAttribute('aria-grabbed', 'false');
      liveRegion.textContent = `${keyboardDragItem.textContent} dropped.`;
      keyboardDragItem = null;
    }
  }

  // If in keyboard drag mode, use arrow keys to move the item
  if (keyboardDragItem) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextSibling = keyboardDragItem.nextElementSibling;
      if (nextSibling) {
        keyboardDragItem.parentNode.insertBefore(keyboardDragItem, nextSibling.nextElementSibling);
        keyboardDragItem.focus();
        liveRegion.textContent = `${keyboardDragItem.textContent} moved down.`;
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevSibling = keyboardDragItem.previousElementSibling;
      if (prevSibling) {
        keyboardDragItem.parentNode.insertBefore(keyboardDragItem, prevSibling);
        keyboardDragItem.focus();
        liveRegion.textContent = `${keyboardDragItem.textContent} moved up.`;
      }
    }
  }
});
