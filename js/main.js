var siteName, siteUrl, siteBtn, siteSearch;
var sites;
var updating = false;
var updatedSiteIndex;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  siteName = document.getElementById('name');
  siteUrl = document.getElementById('website');
  siteBtn = document.getElementById('site-btn');
  siteSearch = document.getElementById('site-search');

  if (localStorage.getItem('sites')) {
    sites = JSON.parse(localStorage.getItem('sites'));
    displayData(sites);
  } else {
    sites = [];
  }

  // Setup validation after elements are loaded
  setupURLValidation('website',
    '✓ Valid website URL',
    '✗ Please enter a valid URL (must start with http:// or https://)');

  setupNameValidation('name',
    '✓ Valid Name',
    '✗ Please enter a valid Name');

  // Only add form event listener if form exists
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Form submission prevented for demo purposes');
    });
  }
});

function addData() {
  if (updating) {
    addUpdatedItem(updatedSiteIndex);
  } else {
    if (siteName.value && myUrlRules(siteUrl.value)) {
      var site = {
        siteName: myTextRules(siteName.value),
        siteUrl: siteUrl.value,
      };

      sites.unshift(site);
      saveToLocalStorage('sites', sites);
      displayData(sites);
    } else {
      if (!myUrlRules(siteUrl.value)) {
        siteUrl.style.outline = 'red'
        alert('Please fill the required data');
      } else {
        alert('Please Fill All Needed Data');
      }
    }
  }
}

function displayData(displayList) {
  var data = '';

  for (let i = 0; i < displayList.length; i++) {
    data += `
    <tr>
      <td>${i + 1}</td>
      <td>${displayList[i].siteName}</td>
      <td>
        <a class="btn btn-primary mx-1" href="${displayList[i].siteUrl}" target="_blank">
          <i class="fas fa-eye"></i> Visit
        </a>
        <button class="btn btn-warning mx-1" onclick="updateItem(${i});">
          <i class="fas fa-edit"></i> Update
        </button>
      </td>
      <td>
        <button class="btn btn-danger mx-1" onclick="deleteItem(${i});">
          <i class="fas fa-trash-alt"></i> Delete
        </button>
      </td>
    </tr>
`;
  }

  document.getElementById('display-data').innerHTML = data;
  clearInputs();
}

// Enhanced clearInputs function that resets both values and validation states
function clearInputs() {
  // Clear input values
  siteName.value = '';
  siteUrl.value = '';
  
  // Reset validation states for name input
  resetInputValidation(siteName, 'name');
  
  // Reset validation states for URL input
  resetInputValidation(siteUrl, 'website');
}

// Helper function to reset validation state for any input
function resetInputValidation(inputElement, inputId) {
  if (inputElement) {
    // Remove all validation classes
    inputElement.classList.remove('blue-outline', 'is-valid', 'is-invalid', 'red-outline');
    
    // Clear error and success messages if they exist
    const errorEl = document.getElementById(inputId + '-error');
    const successEl = document.getElementById(inputId + '-success');
    
    if (errorEl) errorEl.textContent = '';
    if (successEl) successEl.textContent = '';
    
    // Reset any inline styles
    inputElement.style.outline = '';
  }
}

function updateItem(index) {
  updating = true;
  siteBtn.innerHTML = 'Update Bookmark';

  var updatedSite = sites.concat().splice(index, 1);

  siteName.value = updatedSite[0].siteName;
  siteUrl.value = updatedSite[0].siteUrl;

  updatedSiteIndex = index;
  
  // Trigger validation after setting values
  triggerValidation();
}

// Helper function to trigger validation after programmatically setting values
function triggerValidation() {
  // Trigger input events to activate validation
  if (siteName.value) {
    siteName.dispatchEvent(new Event('input'));
  }
  if (siteUrl.value) {
    siteUrl.dispatchEvent(new Event('input'));
  }
}

function addUpdatedItem(index) {
  if (siteName.value && myUrlRules(siteUrl.value)) {
    var updatedSite = {
      siteName: myTextRules(siteName.value),
      siteUrl: siteUrl.value,
    };

    sites.splice(index, 1, updatedSite);
    saveToLocalStorage('sites', sites);
    displayData(sites);

    updating = false;
    siteBtn.innerHTML = 'Add Bookmark';
  } else {
    alert('Please Fill All Needed Data');
  }
}

function deleteItem(index) {
  sites.splice(index, 1);
  saveToLocalStorage('sites', sites);
  displayData(sites);

  if (sites.length === 0) {
    localStorage.removeItem('sites');
  }

  updating = false;
  siteBtn.innerHTML = 'Add Bookmark';
}

function saveToLocalStorage(myKey, myValue) {
  localStorage.setItem(`${myKey}`, JSON.stringify(myValue));
}

function myTextRules(text) {
  var out = `${text}`.trim().toLowerCase();
  return out.charAt(0).toUpperCase() + out.slice(1);
}

function myUrlRules(url) {
  var regex = new RegExp(
    '^(https?:\\/\\/)' +
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
    '((\\d{1,3}\\.){3}\\d{1,3}))' +
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
    '(\\?[;&a-z\\d%_.~+=-]*)?' +
    '(\\#[-a-z\\d_]*)?$',
    'i',
  );

  return regex.test(url);
}

function validateURL(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' ;
  } catch (e) {
    return false;
  }
}

function validateName(name) {
  try {
    // Check if it's a string and not empty/whitespace only
    if (typeof name === 'string' && name.trim().length > 3) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

function searchItems() {
  var searchItems = [];
  var searchValue = siteSearch.value.trim().toLowerCase();

  for (let i = 0; i < sites.length; i++) {
    if (sites[i].siteName.toLowerCase().includes(searchValue)) {
      searchItems.push(sites[i]);
    }
  }

  displayData(searchItems);
}

function applyRedOutline(input) {
  input.classList.remove('blue-outline', 'is-valid', 'is-invalid');
  input.classList.add('red-outline');
}

function applyBlueOutline(input) {
  input.classList.remove('red-outline', 'is-invalid');
  input.classList.add('blue-outline', 'is-valid');
}

function applyInvalidState(input) {
  input.classList.remove('blue-outline', 'is-valid');
  input.classList.add('red-outline', 'is-invalid');
}

function resetState(input) {
  input.classList.remove('blue-outline', 'is-valid', 'is-invalid');
  input.classList.add('red-outline');
}

function setupURLValidation(inputId, successMessage, errorMessage) {
  const input = document.getElementById(inputId);
  const errorEl = document.getElementById(inputId + '-error');
  const successEl = document.getElementById(inputId + '-success');

  // Check if elements exist before adding event listeners
  if (!input) {
    console.warn(`Input element with id '${inputId}' not found`);
    return;
  }

  // Handle focus - apply red outline
  input.addEventListener('focus', function () {
    if (!this.classList.contains('is-valid')) {
      applyRedOutline(this);
    }
  });

  // Handle input validation
  input.addEventListener('input', function () {
    const value = this.value.trim();

    if (value.length === 0) {
      resetState(this);
      if (errorEl) errorEl.textContent = '';
      if (successEl) successEl.textContent = '';
      return;
    }

    if (validateURL(value)) {
      applyBlueOutline(this);
      if (errorEl) errorEl.textContent = '';
      if (successEl) successEl.textContent = successMessage;
    } else {
      applyInvalidState(this);
      if (errorEl) errorEl.textContent = errorMessage;
      if (successEl) successEl.textContent = '';
    }
  });

  // Handle blur
  input.addEventListener('blur', function () {
    if (this.value.trim().length === 0) {
      resetState(this);
      if (errorEl) errorEl.textContent = '';
      if (successEl) successEl.textContent = '';
    }
  });
}

function setupNameValidation(inputId, successMessage, errorMessage) {
  const input = document.getElementById(inputId);
  const errorEl1 = document.getElementById(inputId + '-error');
  const successEl1 = document.getElementById(inputId + '-success');

  // Check if elements exist before adding event listeners
  if (!input) {
    console.warn(`Input element with id '${inputId}' not found`);
    return;
  }

  // Handle focus - apply red outline
  input.addEventListener('focus', function () {
    if (!this.classList.contains('is-valid')) {
      applyRedOutline(this);
    }
  });

  // Handle input validation
  input.addEventListener('input', function () {
    const value = this.value.trim();

    if (value.length === 0) {
      resetState(this);
      if (errorEl1) errorEl1.textContent = '';
      if (successEl1) successEl1.textContent = '';
      return;
    }

    if (validateName(value)) {
      applyBlueOutline(this);
      if (errorEl1) errorEl1.textContent = '';
      if (successEl1) successEl1.textContent = successMessage;
    } else {
      applyInvalidState(this);
      if (errorEl1) errorEl1.textContent = errorMessage;
      if (successEl1) successEl1.textContent = '';
    }
  });

  // Handle blur
  input.addEventListener('blur', function () {
    if (this.value.trim().length === 0) {
      resetState(this);
      if (errorEl1) errorEl1.textContent = '';
      if (successEl1) successEl1.textContent = '';
    }
  });
}