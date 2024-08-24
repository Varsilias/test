import React from "react";
import { ReportsTable } from "./reports-list";

export default function ReportsTab({ reports }) {
    return (
        <div className="mt-9">
            <div className="bg-slate-100 p-6 mb-9 rounded-lg ring-1">
                <p className="text-3xl mb-3">Reports</p>
                <p className="text-sm">
                    This section provides a comprehensive list of all scan
                    reports generated for your website, offering details about
                    the scanned domain, the number of tracker cookies detected.
                    Each report is a snapshot of your website's adherence to
                    data privacy regulations at the time of the scan. Use this
                    page to access your historical and most recent scan reports,
                    ensuring you stay informed and proactive about your
                    website's compliance.
                </p>
            </div>
            <div>
                <ReportsTable reports={reports} />
            </div>{" "}
        </div>
    );
}
