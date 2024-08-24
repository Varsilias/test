import { ConfigContext } from "@/contexts/config-context";
import React from "react";

class PreviewPage extends React.Component {
    render() {
        return (
            <ConfigContext.Consumer>
                {({ config }) => {
                    const showLogo = config.showCookieIcon && config.logo != ""
                    const logoElement = `<img src=${config.logo} alt="Logo Preview" height="40" style="margin-right: 20px" />`
                    const htmlContent = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Cookie Consent Page</title>
                            <link rel="stylesheet" href="https://consentprotect.com/plugin.css" />
                        </head>
                        <body>
                            <!-- Your provided code starts here -->
                            <div id="pushCookieConsent" class="light display-${
                                config.displayPosition
                            } full-width-${config.fullWidth}">
                                <div id="closeIcon">
                                ${
                                    !config.showCloseIcon
                                        ? ""
                                        : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>'
                                }
                                </div>
                                <div class="title-wrap">
                                ${
                                    !showLogo ? "" : logoElement
                                }
                                <h4>${config.title ? config.title : 'Banner Title'}</h4>
                                </div>
                                <div class="content-wrap">
                                <div class="msg-wrap">
                                    <p>
                                        ${config.description ? config.description : 'Description text'}
                                    <a style="color:${
                                        config.themeSettings.primaryBtnColor
                                    };" href="${config.moreInfoBtnLink}">${config.moreInfoBtnLabel}</a>
                                    </p>
                                    <div id="cookieSettings"></div>
                                    <div id="cookieTypes" style="display:${
                                        config.showSettingsBtn ? "" : "none"
                                    };">
                                    <h5>Select cookies to accept</h5>
                                    <ul>
                                        <li><input type="checkbox" name="gdprPrefItem" value="necessary" checked="checked" disabled="disabled" data-compulsory="on"> <label title="These cookies are necessary for the website to function and cannot be switched off in our systems.">Necessary</label></li>
                                        <!-- Other cookie types -->
                                        <li> <input type="checkbox" disabled="disabled" id="gdprPrefItempreferences" name="gdprPrefItem" value="preferences" data-compulsory="on"> <label for="gdprPrefItempreferences" title="Preference cookies enable a website to remember information that changes the way the website behaves or looks, like your preferred language or the region that you are in.">Preferences</label> </li>
                                        <li> <input type="checkbox" disabled="disabled" id="gdprPrefItemmarketing" name="gdprPrefItem" value="marketing" data-compulsory="on"> <label for="gdprPrefItemmarketing" title="Marketing cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.">Marketing</label> </li>
                                        <li> <input type="checkbox" disabled="disabled" id="gdprPrefItemanalytics" name="gdprPrefItem" value="analytics" data-compulsory="on"> <label for="gdprPrefItemanalytics" title="Analytics cookies allow us to count visits and traffic sources, so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.">Analytics</label> </li>
                                    </ul>
                                    </div>
                                </div>
                                <div class="btn-wrap">
                                    <button id="cookieAccept" style="color:${
                                        config.themeSettings.primaryTextColor
                                    };background:${
                        config.themeSettings.primaryBtnColor
                    };border: 1px solid ${
                        config.themeSettings.primaryBtnBorderColor
                    };" type="button">${config.acceptBtnLabel}</button>
                                    <button id="cookieAccept" style="color:${
                                        config.themeSettings.secondaryTextColor
                                    };background:${
                        config.themeSettings.secondaryBtnColor
                    };border: 1px solid ${
                        config.themeSettings.secondaryBtnBorderColor
                    };" type="button">${config.secondaryBtnLabel}</button>
                                    <button id="cookieReject" style="color:${
                                        config.themeSettings.declineTextColor
                                    };background:${
                                        config.themeSettings.declineBtnColor
                                    };border: 1px solid ${
                        config.themeSettings.declineBtnBorderColor 
                    };" type="button">${config.declineInfoBtnLabel}</button>
                                </div>
                                </div>
                            </div>
                            <!-- Your provided code ends here -->
                        </body>
                        </html>`;

                    return (
                        <div>
                            <iframe
                                title="Preview"
                                srcDoc={htmlContent}
                                style={{
                                    width: "100%",
                                    height: "670px",
                                    border: "none",
                                    backgroundColor: "GrayText"
                                }}
                            />
                        </div>
                    );
                }}
            </ConfigContext.Consumer>
        );
    }
}

export default PreviewPage;
