import { createContext, useState, useContext } from "react";

export const ConfigContext = createContext();

const defaultConfig = {
    themeSettings: {
        // primaryColor: "#09bf15", // Primary Color of Popup Banner
        primaryTextColor: "#ffffff",
        primaryBtnColor: "#09bf15",
        primaryBtnBorderColor: "#09bf15",
        secondaryTextColor: "#ffffff",
        secondaryBtnColor: "#1b70f5",
        secondaryBtnBorderColor: "#1b70f5",
        declineTextColor: "#09bf15",
        declineBtnColor: "#ffffff",
        declineBtnBorderColor: "#09bf15",
        darkColor: "#3b3e4a", // Dark Theme Color
        lightColor: "#ffffff", // Light Theme Color
        themeMode: "light", // Theme Mode (light|dark)
    },
    enableGoogleConsentMode: true, // Add support for Google consent mode v2 (https://cookiebannergenerator.com/implementing-google-consent-mode-v2-with-cookie-notice-pro-a-step-by-step-guide/)
    enableMinimize: true, // Enable minimized floating cookie icon to adjust preferences
    showCookieIcon: true, // Hide or show the cookie icon
    showSettingsBtn: true, // Hide or show the preference settings(true|false)
    showCloseIcon: false, // Hide or show the popup close icon(true|false)
    showDeclineBtn: true, // Hide or show the cookie decline button(true|false)
    fullWidth: false, // Full width popup works only when "displayPosition" is set to top/bottom
    allCheckboxesChecked: false, // The setting checkboxes should be checked by default initially or not(true|false)

    displayPosition: "bottom", // Where popup should appear(top|right|bottom|left)
    settingsBtnLabel: "Customize", // Text of settings button

    delay: 2000, // After how much time should popup appear(2000 is equal to 2 seconds)
    expires: 365, // Expiry date of cookie(365 is equal to 365 days)

    title: "Cookie Consent", // Title of popup bannner
    description:
        "This website uses cookie or similar technologies, to enhance your browsing experience and provide personalised recommendations. By continuing to use our website, you agree to our ", // Message
    acceptBtnLabel: "Accept All", // Accept cookie button text
    secondaryBtnLabel: "Accept Necessary",
    declineInfoBtnLabel: "Reject All", // Decline cookie button text
    moreInfoBtnLink: "/privacy-policy/", // Learn more link(default: privacy policy page)
    moreInfoBtnLabel: "Privacy Policy", // More info link text
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

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState(defaultConfig);
    const [saveState, setSaveState] = useState({
        displayPosition: 'bottom',
        showSettingsBtn: true,
        showCloseIcon: false,
        fullWidth: false,
        enableMinimize: true,
        primaryColor: '#09bf15'
    });

    const updatingConfig = (key, value, nestedKey) => {
        setConfig((prevConfig) => {
            // If nestedKey is provided, update the nested object
            if (nestedKey) {
                return {
                    ...prevConfig,
                    [nestedKey]: {
                        ...prevConfig[nestedKey],
                        [key]: value,
                    },
                };
            }
            // Otherwise, update the top-level object
            return {
                ...prevConfig,
                [key]: value,
            };
        });
    };

    const updatingSaveState = (key, value) => {
        setSaveState((prevConfig) => ({
            ...prevConfig,
            [key]: value,
        }));
    };

    const handleShowSettingsBtn = (newValue) => {
        updatingConfig("showSettingsBtn", newValue);
        updatingSaveState("showSettingsBtn", newValue);
    };
    const handleShowCloseIcon = (newValue) => {
        updatingConfig("showCloseIcon", newValue);
        updatingSaveState("showCloseIcon", newValue);
    };
    const handleFullWidth = (newValue) => {
        updatingConfig("fullWidth", newValue);
        updatingSaveState("fullWidth", newValue);
    };
    const handleEnableMinimize = (newValue) => {
        updatingConfig("enableMinimize", newValue);
        updatingSaveState("enableMinimize", newValue);
    };
    const handleDisplayPosition = (newValue) => {
        updatingConfig("displayPosition", newValue);
        updatingSaveState("displayPosition", newValue);
    };
    const handlePrimaryTextColor = (newValue) => {
        updatingConfig("primaryTextColor", newValue, "themeSettings");
        updatingSaveState("primaryTextColor", newValue);
    };
    const handlePrimaryBtnColor = (newValue) => {
        updatingConfig("primaryBtnColor", newValue, "themeSettings");
        updatingSaveState("primaryBtnColor", newValue);
    };
    const handlePrimaryBtnBorderColor = (newValue) => {
        updatingConfig("primaryBtnBorderColor", newValue, "themeSettings");
        updatingSaveState("primaryBtnBorderColor", newValue);
    };
    const handleDarkColor = (newValue) => {
        updatingConfig("darkColor", newValue);
        updatingSaveState("darkColor", newValue);
    };
    const handleLightColor = (newValue) => {
        updatingConfig("lightColor", newValue);
        updatingSaveState("lightColor", newValue);
    };
    const handleThemeMode = (newValue) => {
        updatingConfig("themeMode", newValue);
        updatingSaveState("themeMode", newValue);
    };

    const handleBannerTitle = (newValue) => {
        updatingConfig("title", newValue);
        updatingSaveState("bannerTitle", newValue);
    };
    const handleBannerDescription = (newValue) => {
        updatingConfig("description", newValue);
        updatingSaveState("bannerDescription", newValue);
    };
    const handleMoreInfoBtnLabel = (newValue) => {
        updatingConfig("moreInfoBtnLabel", newValue);
        updatingSaveState("moreInfoBtnLabel", newValue);
    };
    const handleMoreInfoBtnLink = (newValue) => {
        updatingConfig("moreInfoBtnLink", newValue);
        updatingSaveState("moreInfoBtnLink", newValue);
    };
    const handleShowBannerIcon = (newValue) => {
        updatingConfig("showCookieIcon", newValue);
        updatingSaveState("showBannerIcon", newValue);
    };
    const handleLogo = (newValue) => {
        updatingConfig("logo", newValue);
        updatingSaveState("logo", newValue);
    };

    const handleSecondaryTextColor = (newValue) => {
        updatingConfig("secondaryTextColor", newValue, "themeSettings");
        updatingSaveState("secondaryTextColor", newValue);
    };
    const handleSecondaryBtnColor = (newValue) => {
        updatingConfig("secondaryBtnColor", newValue, "themeSettings");
        updatingSaveState("secondaryBtnColor", newValue);
    };
    const handleSecondaryBtnBorderColor = (newValue) => {
        updatingConfig("secondaryBtnBorderColor", newValue, "themeSettings");
        updatingSaveState("secondaryBtnBorderColor", newValue);
    };
    const handleDeclineTextColor = (newValue) => {
        updatingConfig("declineTextColor", newValue, "themeSettings");
        updatingSaveState("declineTextColor", newValue);
    };
    const handleDeclineBtnColor = (newValue) => {
        updatingConfig("declineBtnColor", newValue, "themeSettings");
        updatingSaveState("declineBtnColor", newValue);
    };
    const handleDeclineBtnBorderColor = (newValue) => {
        updatingConfig("declineBtnBorderColor", newValue, "themeSettings");
        updatingSaveState("declineBtnBorderColor", newValue);
    };
    const handlePrimaryBtnLabel = (newValue) => {
        updatingConfig("acceptBtnLabel", newValue);
        updatingSaveState("primaryBtnLabel", newValue);
    };
    const handleDeclineInfoBtnLabel = (newValue) => {
        updatingConfig("declineInfoBtnLabel", newValue);
        updatingSaveState("declineInfoBtnLabel", newValue);
    };
    const handleSecondaryBtnLabel = (newValue) => {
        updatingConfig("secondaryBtnLabel", newValue);
        updatingSaveState("secondaryBtnLabel", newValue);
    };

    return (
        <ConfigContext.Provider
            value={{
                config,
                saveState,
                handleFullWidth,
                handleShowCloseIcon,
                handleEnableMinimize,
                handleShowSettingsBtn,
                handleDisplayPosition,
                handlePrimaryTextColor,
                handlePrimaryBtnColor,
                handlePrimaryBtnBorderColor,
                handleDarkColor,
                handleLightColor,
                handleThemeMode,
                handleBannerTitle,
                handleBannerDescription,
                handleMoreInfoBtnLabel,
                handleMoreInfoBtnLink,
                handleShowBannerIcon,
                handleLogo,
                handleSecondaryTextColor,
                handleSecondaryBtnColor,
                handleSecondaryBtnBorderColor,
                handleDeclineTextColor,
                handleDeclineBtnColor,
                handleDeclineBtnBorderColor,
                handlePrimaryBtnLabel,
                handleDeclineInfoBtnLabel,
                handleSecondaryBtnLabel,
            }}
        >
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);
