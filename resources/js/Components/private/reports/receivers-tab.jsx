import React from "react";
import { ReportReceiversTable } from "./report-receivers-list";

export default function ReceiversTab({ report_receivers }) {
    return (
        <div className="mt-9">
            <div className="bg-slate-100 p-6 mb-9 rounded-lg ring-1">
                <p className="text-3xl mb-3">Scan report receivers</p>
                <p className="text-sm">
                    Here, you can easily add, edit, or remove recipients for
                    your website's scan reports. Keep your team informed by
                    designating one or multiple individuals to receive detailed
                    email reports directly. Below, you'll find a list of current
                    scan report recipients, along with options to modify
                    recipient details as needed for effective communication and
                    compliance management.
                </p>
            </div>
            <ReportReceiversTable report_receivers={report_receivers} />
        </div>
    );
}
