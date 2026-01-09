import { Staff } from "@/types";

// Staff database - Geospatial and Data Management Division
export const staffDatabase: Staff[] = [
    // Geospatial and Data management Division
    { id: "1438", name: "Ahmad Aswadi Yusof", department: "Geospatial and Data management Division" },
    { id: "1059", name: "Zurul Az Zahra Zainud-din", department: "Geospatial and Data management Division" },

    // Geospatial Network Data Management and Coordination Department
    { id: "732", name: "Ts. Noraziah Suliman", department: "Geospatial Network Data Management and Coordination Department" },
    { id: "1033", name: "Saravanan a/l Sukumaran", department: "Geospatial Network Data Management and Coordination Department" },
    { id: "1318", name: "Ts. Md. Ali Imran Zakaria", department: "Geospatial Network Data Management and Coordination Department" },
    { id: "1691", name: "Hayves Yong Chung Han", department: "Geospatial Network Data Management and Coordination Department" },
    { id: "1917", name: "Muhammad Hafiiz Yahya", department: "Geospatial Network Data Management and Coordination Department" },
    { id: "1774", name: "Hazrul Nizam Ismail", department: "Geospatial Network Data Management and Coordination Department" },
    { id: "1625", name: "Nurin Farisa Radzy", department: "Geospatial Network Data Management and Coordination Department" },
    { id: "Intern", name: "Aina Nasuha Ismail Zakri", department: "Geospatial Network Data Management and Coordination Department" },

    // Geospatial Performance and Compliance Department
    { id: "766", name: "Mohammad Syazwan Mat Taib", department: "Geospatial Performance and Compliance Department" },
    { id: "1772", name: "Nur Afiqah Ahmad Bakhtiar", department: "Geospatial Performance and Compliance Department" },
    { id: "633", name: "Norhafiza Ali Hanafiah", department: "Geospatial Performance and Compliance Department" },
    { id: "1431", name: "Nurfarahin Mohamad Rosli", department: "Geospatial Performance and Compliance Department" },
    { id: "1540", name: "Mustaqim Hakimi Shamsudin", department: "Geospatial Performance and Compliance Department" },
    { id: "1803", name: "Hani Arinah Hairul Azam", department: "Geospatial Performance and Compliance Department" },

    // Geospatial Application Services and Analytics Department
    { id: "522", name: "Siti Rafidah Ahmad Fuad", department: "Geospatial Application Services and Analytics Department" },
    { id: "904", name: "Norshahaszalin Mansor", department: "Geospatial Application Services and Analytics Department" },
    { id: "N/A", name: "Nordziana Mohd Aripin", department: "Geospatial Application Services and Analytics Department" },
    { id: "1038", name: "Azira Hamdan", department: "Geospatial Application Services and Analytics Department" },
    { id: "1865", name: "Nur Alya Afiqah Mohd Rodzi", department: "Geospatial Application Services and Analytics Department" },
    { id: "1779", name: "Aina Sorfina Saiful Adli", department: "Geospatial Application Services and Analytics Department" },

    // National Address Management Department
    { id: "1730", name: "Nursyahril Norudin", department: "National Address Management Department" },
    { id: "1845", name: "Muhammad Faizal Hamzah", department: "National Address Management Department" },
    { id: "1833", name: "Syireen Haziqah Mohamed Saari", department: "National Address Management Department" },
    { id: "1352", name: "Nurul Fatin Haziqah Mohamed Iqbal", department: "National Address Management Department" },
    { id: "1776", name: "Abby Asyura Bahaman", department: "National Address Management Department" },

    // Digital Innovation and Solutions Department
    { id: "2214", name: "Mohd Dahri Hadri Zafari", department: "Digital Innovation and Solutions Department" },
    { id: "2245", name: "Muhammad Hafizuddin Iberahim", department: "Digital Innovation and Solutions Department" },
    { id: "2229", name: "Aliff Najmi Ismail", department: "Digital Innovation and Solutions Department" },
    { id: "1796", name: "Muhammad Adib Mohd Akbar", department: "Digital Innovation and Solutions Department" },
];

// Helper function to get staff by ID
export function getStaffById(id: string): Staff | undefined {
    return staffDatabase.find((staff) => staff.id === id);
}

// Helper function to get staff by department
export function getStaffByDepartment(department: string): Staff[] {
    return staffDatabase.filter((staff) => staff.department === department);
}
