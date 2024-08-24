import React, { createContext, useState, useContext } from "react";

// Creating the context
const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
    const [cookies, setCookies] = useState([]);
    const [showEditCookieDialog, setShowEditCookieDialog] = useState(false)
    const [showDeleteCookieDialog, setShowDeleteCookieDialog] = useState(false)

    return (
        <CookieContext.Provider
            value={{
                cookies,
                setCookies,
                showEditCookieDialog,
                setShowEditCookieDialog,
                showDeleteCookieDialog,
                setShowDeleteCookieDialog,
            }}
        >
            {children}
        </CookieContext.Provider>
    );
};

export const useCookies = () => useContext(CookieContext);
