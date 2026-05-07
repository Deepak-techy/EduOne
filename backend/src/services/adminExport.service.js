import { USER_EXPORT_FIELDS } from "../admin.constants.js";

// Generate CSV string from users array
export const generateUsersCSV = (users) => {
    if (!users || users.length === 0) {
        return "";
    }

    // CSV header row
    const headers = USER_EXPORT_FIELDS.join(",");

    // CSV data rows
    const rows = users.map((user) => {
        return USER_EXPORT_FIELDS.map((field) => {
            let value = user[field];

            // format dates
            if (value instanceof Date) {
                value = value.toISOString();
            }

            // handle null/undefined
            if (value === null || value === undefined) {
                value = "";
            }

            // escape commas and quotes in string values
            if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
                value = `"${value.replace(/"/g, '""')}"`;
            }

            return value;
        }).join(",");
    });

    return [headers, ...rows].join("\n");
};
