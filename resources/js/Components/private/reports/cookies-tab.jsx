import React from "react";
import { CookiesTable } from "./cookie-list";

export default function CookiesTab({ cookies }) {
    return (
        <div className="mt-9">
            <div className="bg-slate-100 p-6 mb-9 rounded-lg ring-1">
                <p className="text-3xl mb-3">Tracker Cookies</p>
                <p className="text-sm">
                    This is an overview of the tracker cookies that we have
                    discovered by scanning your domain(s). You can classify your
                    cookies and trackers by assigning a category and description
                    to each individual entry.
                </p>
            </div>
            <div>
                <CookiesTable cookies={cookies} />
            </div>{" "}
        </div>
    );
}
