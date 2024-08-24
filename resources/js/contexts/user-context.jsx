import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [showNewUserDialog, setShowNewUserDialog] = useState(false);
    const [showUserFormDialog, setShowUserFormDialog] = useState(false);
    const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
    const [authUser, setAuthUser] = useState();

    return (
        <UserContext.Provider
            value={{
                authUser,
                setAuthUser,
                showNewUserDialog,
                setShowNewUserDialog,
                showUserFormDialog,
                setShowUserFormDialog,
                showDeleteUserDialog,
                setShowDeleteUserDialog,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
