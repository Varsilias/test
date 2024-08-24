// Create a function to run when jQuery, push.script.js, and push.style.css are loaded
function runScriptsAfterLibrariesLoaded() {
  // Initialize function when document is ready
  $(document).ready(function () {
    updateConsentWidgetMounted()
      .then(response => console.log('Consent widget mounted status updated:', response))
      .catch(error => console.error('Error updating consent widget mounted status:', error));

    function cleanURL(url) {
      // Remove the protocol (http:// or https://)
      let cleanUrl = url.replace(/^https?:\/\//, '');
      
      // Remove 'www.' if it exists
      cleanUrl = cleanUrl.replace(/^www\./, '');
      
      // Remove trailing slash if it exists
      cleanUrl = cleanUrl.replace(/\/$/, '');
      
      return cleanUrl;
    }

    function isSubdomain(subdomain, domain) {
      // Ensure both domains are in lowercase to make the check case-insensitive
      subdomain = subdomain.toLowerCase();
      domain = domain.toLowerCase();
    
      // Check if the subdomain ends with the domain
      return subdomain === domain || subdomain.endsWith(`.${domain}`);
    }

    const registeredDomain = cleanURL(website)
    const domainName = window.location.hostname;

    // console.log('domain>>>', domainName, isSubdomain(domainName, registeredDomain), cookiesCount);
    if (cookiesCount == 0) {
      console.log('No registered cookies yet!!');
    }
    if (!isSubdomain(domainName, registeredDomain)) {
      console.log('Invalid implementation script!!');
    }
    if (uncategorizedCookiesCount > 0) {
      console.log(`You have ${uncategorizedCookiesCount} uncategorised cookies!!`);
    }

    if (uncategorizedCookiesCount == 0 && cookiesCount > 0 && isSubdomain(domainName, registeredDomain)) {
      pushCookieConsent.init();
    }
  });
}

// Check if the 'pcc_consent' cookie is set
// const hasGivenConsent = document.cookie.split(';').some((item) => item.trim().startsWith('pcc_consent='));

// Create the new script element with consent settings
var consentScriptTag = document.createElement("script");
consentScriptTag.text = `
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }

  // Set default consent based on the 'pcc_consent' cookie
  if (${!hasGivenConsent}) {
    gtag('consent', 'default', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  } else {
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  }
`;

// Append the new script tag to the head
document.head.appendChild(consentScriptTag);

// Create a script element for jQuery
var jqueryScriptTag = document.createElement("script");
jqueryScriptTag.src =
  "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";

// Append the jQuery script tag to the head
document.head.appendChild(jqueryScriptTag);

// Create a script element for push.script.js
var pushScriptTag = document.createElement("script");
pushScriptTag.src = "https://consentprotect.com/plugin.js";

// Create a link element for push.style.css
var pushStyleTag = document.createElement("link");
pushStyleTag.rel = "stylesheet";
pushStyleTag.href = "https://consentprotect.com/plugin.css";

// Function to handle loading of scripts and styles
function loadResource(resource, callback) {
  // For CSS files, we can't use onload event, so we check if the stylesheet has been loaded
  if (resource.tagName.toLowerCase() === "link") {
    // If the stylesheet has already been loaded, callback immediately
    if (document.querySelector('link[href="' + resource.href + '"]')) {
      callback();
    } else {
      // Otherwise, append the stylesheet and callback when it's loaded
      document.head.appendChild(resource);
      callback();
    }
  } else {
    // For script files, we use onload event
    resource.onload = callback;
    document.head.appendChild(resource);
  }
}

/**
 * Set Cookie
 * @param {string} name -  Cookie Name
 * @param {string} value - Cookie Value
 * @param {string} expiryDays - Expiry Date of cookie
 */
const createCookie = (name, value, options = {}) => {
  document.cookie = `${name}=${value}${Object.keys(options).reduce(
    (acc, key) => {
      return (
        acc +
        `;${key.replace(/([A-Z])/g, ($1) => "-" + $1.toLowerCase())}=${
          options[key]
        }`
      );
    },
    ""
  )}`;
};

/**
 * Converts Days Into UTC String
 * @param {number} days - Name of the cookie
 * @return {string} UTC date string
 */
const daysToUTC = (days) => {
  const newDate = new Date();
  newDate.setTime(newDate.getTime() + days * 24 * 60 * 60 * 1000);
  return newDate.toUTCString();
};

// Extend the cookie handling to delete cookies for unaccepted categories
function deleteCookiesByCategory(category) {
  // Fetch cookies from API that match the given category
  fetchAndHandleCookies([category]); // This will handle deletion as per the fetchAndHandleCookies logic
}

// Deleting cookies function
function deleteCookie(name, path = "/", domain = "") {
  // Delete the cookie for the original domain
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;

  // Delete the cookie for the prefixed domain
  if (domain) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.${domain}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=www.${domain}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=.www.${domain}`;
  }
}

// Helper function to delete a cookie 3 times
function deleteCookieMultipleTimes(name, path = "/", domain = "", retries = 3) {
  for (let i = 0; i < retries; i++) {
    setTimeout(() => {
        // document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
        deleteCookie(name, path, domain);
    }, 100 * i);
  }
}

// Function to get the value of a specific cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

// Function to parse JSON-safe cookie value
function parseCookieValue(value) {
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (e) {
    console.error("Error parsing cookie value: ", e);
    return [];
  }
}

// Function to check for 'pcc_prefs' cookie and handle cookies accordingly
function checkConsentAndHandleCookies() {
  const pccPrefs = getCookie('pcc_prefs');
  if (pccPrefs) {
    const acceptedCategories = parseCookieValue(pccPrefs);
    fetchAndHandleCookies(acceptedCategories);
  } else {
    console.warn("'pcc_prefs' cookie not found.");
    fetchAndHandleCookies([]);
  }
}

// Load jQuery first
loadResource(jqueryScriptTag, function () {
  // jQuery is loaded, now load push.script.js
  loadResource(pushScriptTag, function () {
    // push.script.js is loaded, now load push.style.css
    loadResource(pushStyleTag, function () {
      // All resources are loaded, run the function
      runScriptsAfterLibrariesLoaded();
    });
  });
});
