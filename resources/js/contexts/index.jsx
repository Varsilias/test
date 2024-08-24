import { ToastProvider } from "@/Components/ui/toast";
import { ConfigProvider } from "./config-context";
import { WebsiteProvider } from "./website-context";
import { CookieProvider } from "./cookie-context";
import { UserProvider } from "./user-context";
import { OnboardingProvider } from "./onboarding-context";

const RootProvider = ({ children }) => {
    return (
        <ConfigProvider>
            <WebsiteProvider>
                <CookieProvider>
                    <UserProvider>
                        <OnboardingProvider>{children}</OnboardingProvider>
                    </UserProvider>
                </CookieProvider>
            </WebsiteProvider>
        </ConfigProvider>
    );
};

export default RootProvider;
