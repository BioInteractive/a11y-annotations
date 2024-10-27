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
  