<?php

namespace App\Http\Controllers;

use App\Models\Cookie;
use App\Models\Website;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class CookieController extends Controller
{
    public function index()
    {
        return Cookie::all();
    }

    public function show($id)
    {
        return Cookie::findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'domain_id' => 'required',
            'name' => 'required',
            'provider' => 'required',
            'category' => 'nullable',
            'value' => 'required',
            'type' => 'required',
            'expiry' => 'required',
            'path' => 'required',
            'secure' => 'required',
            'http_only' => 'required',
        ]);

        $website = Website::getByUUID($request->domain_id);

        $new_cookie = new Cookie($request->all());
        $new_cookie->website_id = $website->id;
        $new_cookie->save();

        return Redirect::back()->with(['message' => 'Operation successfully']);
    }

    public function update(Request $request)
    {
        $request->validate([
            // 'domain_id' => 'required',
            'cookie_id' => 'required',
            'category' => 'required',
        ]);

        $cookie = Cookie::findOrFail($request->cookie_id);

        $cookie->update($request->all());

        return Redirect::back()->with(['message' => 'Operation successfully']);
    }

    public function destroy($id)
    {
        $cookie = Cookie::findOrFail($id);
        $cookie->delete();

        return Redirect::back()->with(['message' => 'Operation successfully']);
    }

    public function serveBanner(string $domainId)
    {
        $website = Website::getByUUID($domainId);
        $domain = $website->domain;

        if ($website === null) {
            Log::error("Website not found for UUID: $domainId");
            abort(404, 'Banner not found.');
        }

        // Checking if there are uncategorised cookies
        $uncategorizedCookiesCount = Cookie::where('website_id', $website->id)
                                            ->whereNull('category')
                                            ->count();

        // Checking if there are any cookies yet
        $cookiesCount = Cookie::where('website_id', $website->id)->count();

        $filePath = public_path("cb.js");

        // Define PHP variables with values to be used in JavaScript config
        $primaryColor = $website->primaryColor;
        $fullWidth = $website->fullWidth == 1 ? 'true' : 'false';
        $showCloseIcon = $website->showCloseIcon == 1 ? 'true' : 'false';
        $showSettingsBtn = $website->showSettingsBtn == 1 ? 'true' : 'false';
        $enableMinimize = $website->enableMinimize == 1 ? 'true' : 'false';
        $displayPosition = $website->displayPosition;

        $logo = $website->logo;
        $bannerTitle = $website->bannerTitle;
        $bannerDescription = $website->bannerDescription;
        $showBannerIcon = $website->showBannerIcon;
        $moreInfoBtnLink = $website->moreInfoBtnLink;
        $moreInfoBtnLabel = $website->moreInfoBtnLabel;

        $secondaryColor = $website->secondaryColor;
        $primaryTextColor = $website->primaryTextColor;
        $primaryBtnColor = $website->primaryBtnColor;
        $primaryBtnBorderColor = $website->primaryBtnBorderColor;
        $secondaryTextColor = $website->secondaryTextColor;
        $secondaryBtnColor = $website->secondaryBtnColor;
        $secondaryBtnBorderColor = $website->secondaryBtnBorderColor;
        $declineTextColor = $website->declineTextColor;
        $declineBtnColor = $website->declineBtnColor;
        $declineBtnBorderColor = $website->declineBtnBorderColor;
        $primaryBtnLabel = $website->primaryBtnLabel;
        $secondaryBtnLabel = $website->secondaryBtnLabel;
        $declineInfoBtnLabel = $website->declineInfoBtnLabel;

        // Read the content of the existing JavaScript file
        $fileContent = file_get_contents($filePath);

        // Append the JavaScript configuration string with values from PHP variables to the end of the file
        $javascriptCode = <<<EOD
                const config = {
                    logo: "{$logo}",
                    themeSettings: {
                    primaryColor: "{$primaryColor}", // Primary Color of Popup Banner and Accept all button
                    primaryTextColor: "{$primaryTextColor}",
                    primaryBtnColor: "{$primaryBtnColor}",
                    primaryBtnBorderColor: "{$primaryBtnBorderColor}",
                    secondaryTextColor: "{$secondaryTextColor}",
                    secondaryBtnColor: "{$secondaryBtnColor}",
                    secondaryBtnBorderColor: "{$secondaryBtnBorderColor}",
                    declineTextColor: "{$declineTextColor}",
                    declineBtnColor: "{$declineBtnColor}",
                    declineBtnBorderColor: "{$declineBtnBorderColor}",
                    secondaryColor: "{$secondaryColor}",
                    darkColor: "#3b3e4a", // Dark Theme Color
                    lightColor: "#ffffff", // Light Theme Color
                    themeMode: "light", // Theme Mode (light|dark)
                    },
                    enableGoogleConsentMode: true, // Add support for Google consent mode v2 (https://cookiebannergenerator.com/implementing-google-consent-mode-v2-with-cookie-notice-pro-a-step-by-step-guide/)
                    enableMinimize: {$enableMinimize}, // Enable minimized floating cookie icon to adjust preferences
                    showCookieIcon: {$showBannerIcon}, // Hide or show the cookie icon
                    showSettingsBtn: {$showSettingsBtn}, // Hide or show the preference settings(true|false)
                    showCloseIcon: {$showCloseIcon}, // Hide or show the popup close icon(true|false)
                    showDeclineBtn: true, // Hide or show the cookie decline button(true|false)
                    fullWidth: {$fullWidth}, // Full width popup works only when "displayPosition" is set to top/bottom
                    allCheckboxesChecked: false, // The setting checkboxes should be checked by default initially or not(true|false)

                    displayPosition: "{$displayPosition}", // Where popup should appear(top|right|bottom|left)
                    settingsBtnLabel: "Customize", // Text of settings button

                    delay: 2000, // After how much time should popup appear(2000 is equal to 2 seconds)
                    expires: 365, // Expiry date of cookie(365 is equal to 365 days)

                    title: "{$bannerTitle}", // Title of popup bannner
                    description: "{$bannerDescription}",
                    acceptBtnLabel: "{$primaryBtnLabel}", // Accept All cookie button text
                    secondaryBtnLabel: "{$secondaryBtnLabel}", // Accept Necessary cookie button text
                    declineInfoBtnLabel: "{$declineInfoBtnLabel}", // Decline cookie button text
                    moreInfoBtnLink: "{$moreInfoBtnLink}", // Learn more link(default: privacy policy page)
                    moreInfoBtnLabel: "{$moreInfoBtnLabel}", // More info link text
                    cookieTypesTitle: "Cookies overview", // Title of cookie preference options
                    necessaryCookieTypeLabel: "Necessary", // Label text of Necessary cookie item
                    floatingIconTooltip: "Adjust my preferences", // Tooltip of floating cookie icon (Minimized)
                    necessaryCookieTypeDesc:
                    "These cookies are necessary for the website to function and cannot be switched off in our systems.", // Hover text of necessary cookies
                    onConsentAccept: () => {
                    // It will inject scripts in head if cookie preferences menu(showSettingsBtn) is enabled
                    console.log("Consent accepted!");
                    },
                    onConsentReject: () => {
                    // This code will run on cookie reject/decline
                    console.log("Consent Rejected!");
                    },
                    cookieTypes: [
                    // Cookie types, value and description (Cookie Preferences Selection)
                    {
                        type: "Preferences",
                        value: "preferences",
                        description:
                        "Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.",
                    },
                    {
                        type: "Marketing",
                        value: "marketing",
                        description:
                        "Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.",
                    },
                    {
                        type: "Analytics",
                        value: "analytics",
                        description:
                        "Analytics cookies allow us to count visits and traffic sources, so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.",
                    },
                    ],
                };

                const uncategorizedCookiesCount = {$uncategorizedCookiesCount};
                const website = '{$domain}';
                const cookiesCount = {$cookiesCount};

                const injectScripts = () => {
                    // consent protect initial scan
                    if (localStorage.getItem('cpis') !== 'true') {
                        fetch("https://consentprotect.com/api/trigger/scan/{$domainId}", {
                            method: 'GET',
                            headers: {
                            'Content-Type': 'application/json'
                            }
                        })
                        .then(response => response.json())
                        .then(data => {
                            localStorage.setItem('cpis', 'true');
                            console.log('Success:', data);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                    }

                    //*******************************************************************//
                    updateConsentWidgetMounted()
                        .then(response => console.log('Consent widget mounted status updated:', response))
                        .catch(error => console.error('Error updating consent widget mounted status:', error));
                };

                // Function to fetch cookies by category and update the browser's cookies
                function fetchAndHandleCookies(acceptedCategories) {
                  const url = "https://consentprotect.com/api/cookies/client/{$domainId}"; // Set your API endpoint URL here
                  $.ajax({
                    url: url,
                    type: "GET",
                    data: JSON.stringify({ categories: acceptedCategories }),
                    contentType: "application/json",
                    success: function (data) {
                        // Helper function to check if a cookie exists
                        function cookieExists(name) {
                          return document.cookie.split(";").some((item) => item.trim().startsWith(name + "="));
                        }

                        // Assume data is an array of cookies as described
                        data.forEach((cookie) => {
                            if (acceptedCategories.includes(cookie.category)) {
                                if (!cookieExists(cookie.name)) {
                                    createCookie(cookie.name, cookie.value, {
                                    expires: daysToUTC(cookie.expiry),
                                    path: cookie.path,
                                    domain: cookie.provider,
                                    secure: cookie.secure,
                                    httpOnly: cookie.http_only,
                                    });
                                }
                            } else {
                                deleteCookieMultipleTimes(cookie.name, cookie.path, cookie.provider);
                            }
                        });
                    },
                    error: function (xhr, status, error) {
                      console.error("Error fetching cookies: ", status, error);
                    },
                  });
                }

                const hasGivenConsent = document.cookie.split(';').some((item) => item.trim().startsWith('pcc_consent='));

                async function updateField(endpoint, data) {
                    const response = await fetch(endpoint, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                
                    if (!response.ok) {
                        const error = await response.json();
                        console.error('Error:', error);
                        throw new Error('Network response was not ok');
                    }
                
                    return response.json();
                }

                async function updateConsentWidgetMounted() {
                    const endpoint = `https://consentprotect.com/api/websites/{$domainId}/consent-widget-mounted`;
                    const data = { consentWidgetMounted: true };
                    return updateField(endpoint, data);
                };
                
                // async function updateCookiesTableMounted() {
                //     const endpoint = `https://consentprotect.com/api/websites/{$domainId}/cookies-table-mounted`;
                //     const data = { cookiesTableMounted: true };
                //     return updateField(endpoint, data);
                // };
                
                // async function updateOpenGtagDefaults() {
                //     const endpoint = `https://consentprotect.com/api/websites/{$domainId}/open-gtag-defaults`;
                //     const data = { openGtagDefaults: true };
                //     return updateField(endpoint, data);
                // };
            EOD;

        // Return the modified content with JavaScript configuration as JavaScript response
        return response($javascriptCode . $fileContent)
            ->header('Content-Type', 'application/javascript');
    }

    function getCookiesByDomainId($domainId)
    {
        // $domainId = '0574e7f7-6410-4890-a774-011b92a28525';
        // Retrieve all websites with the given domain ID
        $website = Website::where('domain_id', $domainId)->first();

        $cookies = Cookie::where('website_id', $website->id)->get();

        return response()->json($cookies);
    }

    public function serveDeclaration(string $domainId)
    {
        $website = Website::getByUUID($domainId);
        $domain = $website->domain;
        // Checking if there are uncategorised cookies
        $uncategorizedCookiesCount = Cookie::where('website_id', $website->id)
                                            ->whereNull('category')
                                            ->count();

        // Checking if there are any cookies yet
        $cookiesCount = Cookie::where('website_id', $website->id)->count();


        $htmlCode = <<<EOD
                    <!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8" />
                            <title>Embeddable Widget</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 20px;
                                }

                                .table-container {
                                    overflow-x: auto;
                                }

                                table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    background-color: #fff;
                                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                                    margin-bottom: 20px;
                                }

                                table thead th {
                                    background-color: #060455;
                                    color: white;
                                    font-weight: normal;
                                    padding: 10px;
                                    text-align: left;
                                }

                                table tbody td {
                                    padding: 10px;
                                    border-bottom: 1px solid #ddd;
                                }

                                table tbody tr:nth-child(even) {
                                    background-color: #f2f2f2;
                                }
                            </style>
                            <script></script
                        </head>
                        <body>
                            <div id="widget-container">
                                <table id="apiDataTable">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Provider</th>
                                            <th>Category</th>
                                            <th>Expiry</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Data will be inserted here by JavaScript -->
                                    </tbody>
                                </table>
                            </div>

                            <script>
                                const apiURL =
                                    "https://consentprotect.com/api/cookies/client/{$domainId}";

                                async function fetchAndPopulateTable() {
                                    try {
                                        const response = await fetch(apiURL);
                                        const data = await response.json();
                                        populateTable(data);
                                    } catch (error) {
                                        console.error("Failed to fetch data: ", error);
                                    }
                                }

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
                                function makeInvisible() {
                                    const body = document.body;
                                    body.style.display = "none";
                                }

                                function populateTable(data) {
                                    const uncategorizedCookiesCount = {$uncategorizedCookiesCount};
                                    const website = '{$domain}';
                                    const cookiesCount = {$cookiesCount};

                                    const registeredDomain = cleanURL(website)
                                    const domainName = window.location.hostname;

                                    // console.log(registeredDomain)
                                    // console.log(domainName, '>>>')

                                    // console.log(!isSubdomain(domainName, registeredDomain))
                                    // console.log(uncategorizedCookiesCount > 0)
                                    // console.log(cookiesCount == 0)
                                    // console.log(!isSubdomain(domainName, registeredDomain) || uncategorizedCookiesCount > 0 || cookiesCount == 0)
                                    
                                    if (uncategorizedCookiesCount > 0 || cookiesCount == 0) {
                                        makeInvisible();
                                    }
                                    const tableBody = document
                                        .getElementById("apiDataTable")
                                        .getElementsByTagName("tbody")[0];
                                
                                    data.forEach((item) => {
                                        const row = tableBody.insertRow();
                                        const columns = ["name", "provider", "category", "expiry"]; // Columns to display
                                
                                        columns.forEach((column) => {
                                            const cell = row.insertCell();
                                            
                                            // Convert expiry from Unix timestamp to days
                                            if (column === "expiry") {
                                                const expiryTimestamp = item[column];
                                                const minutesInADay = 1440;
                                                const daysSinceEpoch = Math.floor(expiryTimestamp / minutesInADay);
                                                cell.textContent = daysSinceEpoch + " " + "days";
                                            } else {
                                                cell.textContent = item[column];
                                            }
                                        });
                                    });
                                }

                                fetchAndPopulateTable();
                            </script>
                        </body>
                    </html>
                EOD;

        return response($htmlCode)->header('Content-Type', 'text/html');
    }

    /**
     * Store a batch of new cookies in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeBatch(Request $request)
    {
        Cookie::create([
            'website_id' => 2,
            "name" => "session_cookie",
            "provider" => "MySite",
            "value" => "xyz123",
            "type" => "session",
            "expiry" => 1440,
            "path" => "/",
            "secure" => true,
            "http_only" => true
        ]);

        // // Get domain_id from the request and find the corresponding website
        // $domainId = $request->input('domain_id');
        // $website = Website::getByUUID($domainId); // Adjust this method according to your Website model and actual database column

        // // Check if website is found
        // if (!$website) {
        //     return response()->json(['error' => 'Website not found'], 404);
        // }

        // // Retrieve cookies data from the request
        // $cookiesData = $request->input('cookies');

        // // Define validation rules for cookies
        // $rules = [
        //     'name' => 'required|string|max:255',
        //     'value' => 'required',
        //     'provider' => 'nullable',
        //     'type' => 'required|string|max:255',
        //     'expiry' => 'required|integer',
        //     'path' => 'required|string|max:255',
        //     'secure' => 'required|boolean',
        //     'http_only' => 'required|boolean',
        // ];

        // foreach ($cookiesData as $key => $value) {
        //     // Validate each cookie data
        //     $validator = Validator::make($value, $rules);

        //     if ($validator->fails()) {
        //         // Return the first validation failure
        //         return response()->json(['error' => $validator->errors()], 422);
        //     }

        //     // Create cookie with the retrieved website_id
        //     Cookie::create(array_merge($validator->validated(), ['website_id' => $website->id]));
        // }

        // Return success response
        return response()->json(['message' => 'Cookies saved successfully!'], 200);
    }

    /**
     * Check if all cookies of a website have been categorized.
     *
     * @param int $domainId
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkCookiesCategorized($domainId)
    {
        $website = Website::getByUUID($domainId);

        // Query to check if there are any cookies with null category for the given website
        $totalCookiesCount = Cookie::where('website_id', $website->id)->count();
        $uncategorizedCookiesCount = Cookie::where('website_id', $website->id)
                                            ->whereNull('category')
                                            ->count();

        // If no cookies are found for the website
        if ($totalCookiesCount == 0) {
            return response()->json([
                'categorized' => false,
                'message' => 'No cookies found for this website.'
            ]);
        }

        if ($uncategorizedCookiesCount > 0) {
            return response()->json([
                'categorized' => false,
                'message' => 'Not all cookies have been categorized.',
                'uncategorized_cookies_count' => $uncategorizedCookiesCount
            ]);
        }

        return response()->json([
            'categorized' => true,
            'message' => 'All cookies have been categorized.'
        ]);
    }
}
