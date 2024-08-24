import { createContext, useContext, useState, useEffect } from "react";

const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
    const [selectedWebsite, setSelectedWebsite] = useState(() => {
        const savedWebsite = localStorage.getItem('selectedWebsite');

        return savedWebsite != "undefined" ? JSON.parse(savedWebsite) : null;
    });
    const [showNewWebsiteDialog, setShowNewWebsiteDialog] = useState(false);
    const [showEditWebsiteDialog, setShowEditWebsiteDialog] = useState(false);
    const [showDeleteWebsiteDialog, setShowDeleteWebsiteDialog] = useState(false);
    const [allWebsites, setAllWebsites] = useState();

    useEffect(() => {
        localStorage.setItem('selectedWebsite', JSON.stringify(selectedWebsite));
    }, [selectedWebsite]);

    return (
        <WebsiteContext.Provider
            value={{
                allWebsites,
                setAllWebsites,
                selectedWebsite,
                setSelectedWebsite,
                showNewWebsiteDialog,
                setShowNewWebsiteDialog,
                showEditWebsiteDialog,
                setShowEditWebsiteDialog,
                showDeleteWebsiteDialog,
                setShowDeleteWebsiteDialog,
            }}
        >
            {children}
        </WebsiteContext.Provider>
    );
};

export const useWebsite = () => useContext(WebsiteContext);
