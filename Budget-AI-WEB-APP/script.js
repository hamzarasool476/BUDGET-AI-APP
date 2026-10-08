/* =========================================================
   BUDGET AI
   PROJECT BUDGET ESTIMATOR
========================================================= */

"use strict";

/* =========================================================
   DOM ELEMENTS
========================================================= */

const form = document.getElementById("budgetForm");
const resultCard = document.getElementById("resultCard");

/* =========================================================
   CURRENCY
========================================================= */

const rates = {
    PKR: 1,
    USD: 0.00357,
    GBP: 0.00264,
    AED: 0.0131,
    SAR: 0.0134,
    INR: 0.298
};

const currencySymbols = {
    PKR: "Rs.",
    USD: "$",
    GBP: "£",
    AED: "AED",
    SAR: "SAR",
    INR: "₹"
};

/* =========================================================
   PROJECT RATES
========================================================= */

const projectRates = {
    construction: {
        base: 350000,
        unit: "per unit"
    },

    renovation: {
        base: 180000,
        unit: "per unit"
    },

    website: {
        base: 90000,
        unit: "per project"
    },

    webapp: {
        base: 350000,
        unit: "per project"
    },

    mobile: {
        base: 450000,
        unit: "per project"
    },

    software: {
        base: 750000,
        unit: "per project"
    },

    ecommerce: {
        base: 250000,
        unit: "per project"
    },

    marketing: {
        base: 150000,
        unit: "per campaign"
    },

    event: {
        base: 200000,
        unit: "per event"
    },

    manufacturing: {
        base: 500000,
        unit: "per project"
    },

    education: {
        base: 120000,
        unit: "per project"
    },

    custom: {
        base: 200000,
        unit: "per project"
    }
};

/* =========================================================
   QUALITY
========================================================= */

const qualityMultipliers = {
    economy: 0.75,
    standard: 1,
    premium: 1.5
};

/* =========================================================
   SAFE ELEMENT VALUE
========================================================= */

function getValue(id, defaultValue) {
    const element = document.getElementById(id);

    if (!element) {
        return defaultValue;
    }

    return element.value;
}

/* =========================================================
   MONEY FORMAT
========================================================= */

function formatMoney(amount, currency) {
    const safeCurrency = rates[currency] ? currency : "PKR";

    const convertedAmount =
        Number(amount || 0) * rates[safeCurrency];

    return (
        currencySymbols[safeCurrency] +
        " " +
        convertedAmount.toLocaleString(undefined, {
            maximumFractionDigits: 0
        })
    );
}

/* =========================================================
   GET FORM DATA
========================================================= */

function getFormData() {
    return {
        name: String(
            getValue("projectName", "Untitled Project")
        ).trim(),

        type: getValue("projectType", ""),

        country: getValue("country", ""),

        currency: getValue("currency", "PKR"),

        quality: getValue("quality", "standard"),

        quantity: Math.max(
            1,
            Number(getValue("quantity", 1)) || 1
        ),

        duration: Math.max(
            1,
            Number(getValue("duration", 1)) || 1
        ),

        materials:
            Math.max(
                0,
                Number(getValue("materials", 0)) || 0
            ),

        labor:
            Math.max(
                0,
                Number(getValue("labor", 0)) || 0
            ),

        equipment:
            Math.max(
                0,
                Number(getValue("equipment", 0)) || 0
            ),

        requirements:
            String(
                getValue("requirements", "")
            ).trim(),

        tax:
            Math.max(
                0,
                Number(getValue("tax", 0)) || 0
            ),

        contingency:
            Math.max(
                0,
                Number(getValue("contingency", 0)) || 0
            )
    };
}

/* =========================================================
   REQUIREMENT ANALYSIS
========================================================= */

function analyzeRequirements(text) {
    const lowerText =
        String(text || "").toLowerCase();

    let multiplier = 1;

    const detected = [];

    const keywords = {
        database: 1.10,
        payment: 1.08,
        ecommerce: 1.12,
        dashboard: 1.08,
        admin: 1.05,
        api: 1.07,
        security: 1.10,
        authentication: 1.05,
        ai: 1.20,
        chatbot: 1.15,
        "machine learning": 1.25,
        automation: 1.12,
        "custom design": 1.08,
        premium: 1.20,
        furniture: 1.08,
        kitchen: 1.10,
        bathroom: 1.08,
        plumbing: 1.08,
        electrical: 1.07,
        roofing: 1.10,
        "social media": 1.08,
        video: 1.12,
        photography: 1.08,
        transport: 1.05
    };

    Object.keys(keywords).forEach(function (keyword) {
        if (lowerText.indexOf(keyword) !== -1) {
            multiplier *= keywords[keyword];
            detected.push(keyword);
        }
    });

    return {
        multiplier: multiplier,
        detected: detected
    };
}

/* =========================================================
   MATERIAL PERCENTAGE
========================================================= */

function getMaterialPercentage(type) {
    const values = {
        construction: 0.45,
        renovation: 0.40,
        website: 0.10,
        webapp: 0.08,
        mobile: 0.05,
        software: 0.04,
        ecommerce: 0.08,
        marketing: 0.10,
        event: 0.30,
        manufacturing: 0.50,
        education: 0.12,
        custom: 0.25
    };

    return values[type] || 0.25;
}

/* =========================================================
   LABOR PERCENTAGE
========================================================= */

function getLaborPercentage(type) {
    const values = {
        construction: 0.25,
        renovation: 0.30,
        website: 0.40,
        webapp: 0.50,
        mobile: 0.50,
        software: 0.55,
        ecommerce: 0.40,
        marketing: 0.45,
        event: 0.30,
        manufacturing: 0.25,
        education: 0.50,
        custom: 0.35
    };

    return values[type] || 0.35;
}

/* =========================================================
   EQUIPMENT PERCENTAGE
========================================================= */

function getEquipmentPercentage(type) {
    const values = {
        construction: 0.15,
        renovation: 0.10,
        website: 0.03,
        webapp: 0.02,
        mobile: 0.02,
        software: 0.01,
        ecommerce: 0.02,
        marketing: 0.03,
        event: 0.15,
        manufacturing: 0.20,
        education: 0.03,
        custom: 0.10
    };

    return values[type] || 0.10;
}

/* =========================================================
   CALCULATE BUDGET
========================================================= */

function calculateBudget(data) {
    const project = projectRates[data.type];

    if (!project) {
        throw new Error("Please select a valid project type.");
    }

    const qualityMultiplier =
        qualityMultipliers[data.quality] || 1;

    const analysis =
        analyzeRequirements(data.requirements);

    let baseCost =
        project.base *
        data.quantity *
        qualityMultiplier *
        analysis.multiplier;

    /* Duration adjustment */

    const durationFactor =
        1 + ((data.duration - 1) * 0.04);

    baseCost *= durationFactor;

    /* Materials */

    let materialCost;

    if (data.materials > 0) {
        materialCost =
            data.materials * data.quantity;
    } else {
        materialCost =
            baseCost *
            getMaterialPercentage(data.type);
    }

    /* Labor */

    let laborCost;

    if (data.labor > 0) {
        laborCost =
            data.labor * data.quantity;
    } else {
        laborCost =
            baseCost *
            getLaborPercentage(data.type);
    }

    /* Equipment */

    let equipmentCost;

    if (data.equipment > 0) {
        equipmentCost =
            data.equipment * data.quantity;
    } else {
        equipmentCost =
            baseCost *
            getEquipmentPercentage(data.type);
    }

    /* Additional costs */

    const componentTotal =
        materialCost +
        laborCost +
        equipmentCost;

    const designCost =
        baseCost * 0.08;

    const managementCost =
        baseCost * 0.07;

    const subtotal =
        Math.max(
            baseCost,
            componentTotal
        ) +
        designCost +
        managementCost;

    /* Tax */

    const taxAmount =
        subtotal *
        (data.tax / 100);

    /* Contingency */

    const contingencyAmount =
        subtotal *
        (data.contingency / 100);

    /* Final estimate */

    const expected =
        subtotal +
        taxAmount +
        contingencyAmount;

    const low =
        expected * 0.85;

    const high =
        expected * 1.20;

    return {
        low: low,
        expected: expected,
        high: high,

        materialCost: materialCost,
        laborCost: laborCost,
        equipmentCost: equipmentCost,

        designCost: designCost,
        managementCost: managementCost,

        taxAmount: taxAmount,
        contingencyAmount: contingencyAmount,

        subtotal: subtotal,

        detected: analysis.detected
    };
}

/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   BREAKDOWN ROW
========================================================= */

function breakdownRow(label, value) {
    return (
        '<div class="breakdown-row">' +
            "<span>" +
                escapeHTML(label) +
            "</span>" +
            "<strong>" +
                value +
            "</strong>" +
        "</div>"
    );
}

/* =========================================================
   DISPLAY RESULT
========================================================= */

function displayResult(data, budget) {
    if (!resultCard) {
        return;
    }

    const currency =
        data.currency || "PKR";

    let detectedHTML = "";

    if (
        budget.detected &&
        budget.detected.length > 0
    ) {
        detectedHTML =
            '<div class="alert alert-info mt-3">' +
                "<strong>" +
                    '<i class="bi bi-stars"></i> ' +
                    "Requirements detected" +
                "</strong>" +
                "<br>" +
                escapeHTML(
                    budget.detected.join(", ")
                ) +
            "</div>";
    }

    resultCard.innerHTML =
        '<div class="result-header">' +

            "<small>" +
                escapeHTML(
                    data.type.toUpperCase()
                ) +
            "</small>" +

            "<h3>" +
                escapeHTML(
                    data.name || "Untitled Project"
                ) +
            "</h3>" +

            '<p class="mb-1">' +
                "Expected Project Budget" +
            "</p>" +

            '<div class="expected-budget">' +
                formatMoney(
                    budget.expected,
                    currency
                ) +
            "</div>" +

        "</div>" +

        '<div class="range-container">' +

            "<h5 class=\"mb-3\">" +
                "Budget Range" +
            "</h5>" +

            '<div class="range-box low">' +
                "<small>Minimum / Low</small>" +
                "<strong>" +
                    formatMoney(
                        budget.low,
                        currency
                    ) +
                "</strong>" +
            "</div>" +

            '<div class="range-box expected">' +
                "<small>Expected</small>" +
                "<strong>" +
                    formatMoney(
                        budget.expected,
                        currency
                    ) +
                "</strong>" +
            "</div>" +

            '<div class="range-box high">' +
                "<small>Maximum / High</small>" +
                "<strong>" +
                    formatMoney(
                        budget.high,
                        currency
                    ) +
                "</strong>" +
            "</div>" +

        "</div>" +

        '<div class="breakdown">' +

            "<h5 class=\"mb-3\">" +
                "Cost Breakdown" +
            "</h5>" +

            breakdownRow(
                "Materials",
                formatMoney(
                    budget.materialCost,
                    currency
                )
            ) +

            breakdownRow(
                "Labor",
                formatMoney(
                    budget.laborCost,
                    currency
                )
            ) +

            breakdownRow(
                "Equipment",
                formatMoney(
                    budget.equipmentCost,
                    currency
                )
            ) +

            breakdownRow(
                "Design",
                formatMoney(
                    budget.designCost,
                    currency
                )
            ) +

            breakdownRow(
                "Management",
                formatMoney(
                    budget.managementCost,
                    currency
                )
            ) +

            breakdownRow(
                "Tax",
                formatMoney(
                    budget.taxAmount,
                    currency
                )
            ) +

            breakdownRow(
                "Contingency",
                formatMoney(
                    budget.contingencyAmount,
                    currency
                )
            ) +

            breakdownRow(
                "Expected Total",
                formatMoney(
                    budget.expected,
                    currency
                )
            ) +

            detectedHTML +

            '<div class="d-grid gap-2 mt-4">' +

                '<button type="button" ' +
                    'class="btn btn-success" ' +
                    'id="saveProjectButton">' +
                    '<i class="bi bi-save"></i> ' +
                    "Save Project" +
                "</button>" +

                '<button type="button" ' +
                    'class="btn btn-outline-dark" ' +
                    'id="printReportButton">' +
                    '<i class="bi bi-printer"></i> ' +
                    "Print Report" +
                "</button>" +

            "</div>" +

        "</div>";

    window.currentProject = {
        data: data,
        budget: budget
    };

    const saveButton =
        document.getElementById(
            "saveProjectButton"
        );

    const printButton =
        document.getElementById(
            "printReportButton"
        );

    if (saveButton) {
        saveButton.addEventListener(
            "click",
            saveCurrentProject
        );
    }

    if (printButton) {
        printButton.addEventListener(
            "click",
            function () {
                window.print();
            }
        );
    }
}

/* =========================================================
   FORM SUBMIT
========================================================= */

function handleFormSubmit(event) {
    event.preventDefault();

    try {
        const data = getFormData();

        if (!data.type) {
            alert(
                "Please select a project type."
            );
            return;
        }

        const budget =
            calculateBudget(data);

        displayResult(
            data,
            budget
        );

        updateDashboardPreview();

    } catch (error) {
        console.error(
            "Budget calculation error:",
            error
        );

        alert(
            "Something went wrong while calculating the budget."
        );
    }
}

if (form) {
    form.addEventListener(
        "submit",
        handleFormSubmit
    );
}

/* =========================================================
   SAVE PROJECT
========================================================= */

function saveCurrentProject() {
    if (!window.currentProject) {
        alert(
            "Generate an estimate first."
        );
        return;
    }

    let projects = [];

    try {
        projects =
            JSON.parse(
                localStorage.getItem(
                    "budgetAIProjects"
                )
            ) || [];
    } catch (error) {
        projects = [];
    }

    const current =
        window.currentProject;

    projects.push({
        id: Date.now(),

        name:
            current.data.name ||
            "Untitled Project",

        type:
            current.data.type,

        quality:
            current.data.quality,

        currency:
            current.data.currency,

        expected:
            current.budget.expected,

        low:
            current.budget.low,

        high:
            current.budget.high,

        date:
            new Date().toLocaleDateString()
    });

    localStorage.setItem(
        "budgetAIProjects",
        JSON.stringify(projects)
    );

    loadProjects();
    updateDashboard();

    alert(
        "Project saved successfully."
    );
}

/* =========================================================
   GET SAVED PROJECTS
========================================================= */

function getSavedProjects() {
    try {
        return (
            JSON.parse(
                localStorage.getItem(
                    "budgetAIProjects"
                )
            ) || []
        );
    } catch (error) {
        return [];
    }
}

/* =========================================================
   LOAD PROJECTS
========================================================= */

function loadProjects() {
    const projects =
        getSavedProjects();

    const table =
        document.getElementById(
            "projectsTable"
        );

    if (!table) {
        return;
    }

    if (projects.length === 0) {
        table.innerHTML =
            '<tr>' +
                '<td colspan="6" ' +
                    'class="text-center text-muted py-5">' +
                    "No saved projects" +
                "</td>" +
            "</tr>";

        return;
    }

    let html = "";

    projects
        .slice()
        .reverse()
        .forEach(function (project) {
            html +=
                "<tr>" +

                    "<td>" +
                        "<strong>" +
                            escapeHTML(
                                project.name
                            ) +
                        "</strong>" +
                    "</td>" +

                    "<td>" +
                        '<span class="type-badge">' +
                            escapeHTML(
                                project.type
                            ) +
                        "</span>" +
                    "</td>" +

                    "<td>" +
                        escapeHTML(
                            project.quality
                        ) +
                    "</td>" +

                    "<td>" +
                        "<strong>" +
                            formatMoney(
                                project.expected,
                                project.currency
                            ) +
                        "</strong>" +
                    "</td>" +

                    "<td>" +
                        escapeHTML(
                            project.date
                        ) +
                    "</td>" +

                    "<td>" +
                        '<button type="button" ' +
                            'class="btn btn-sm btn-outline-danger delete-project" ' +
                            'data-id="' +
                                project.id +
                            '">' +
                            '<i class="bi bi-trash"></i>' +
                        "</button>" +
                    "</td>" +

                "</tr>";
        });

    table.innerHTML = html;

    const deleteButtons =
        table.querySelectorAll(
            ".delete-project"
        );

    deleteButtons.forEach(
        function (button) {
            button.addEventListener(
                "click",
                function () {
                    const id =
                        Number(
                            button.getAttribute(
                                "data-id"
                            )
                        );

                    deleteProject(id);
                }
            );
        }
    );
}

/* =========================================================
   DELETE PROJECT
========================================================= */

function deleteProject(id) {
    let projects =
        getSavedProjects();

    projects =
        projects.filter(
            function (project) {
                return project.id !== id;
            }
        );

    localStorage.setItem(
        "budgetAIProjects",
        JSON.stringify(projects)
    );

    loadProjects();
    updateDashboard();
}

/* =========================================================
   CLEAR PROJECTS
========================================================= */

function clearProjects() {
    const projects =
        getSavedProjects();

    if (projects.length === 0) {
        alert(
            "There are no saved projects."
        );
        return;
    }

    const confirmed =
        window.confirm(
            "Delete all saved projects?"
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        "budgetAIProjects"
    );

    loadProjects();
    updateDashboard();
}

/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {
    const projects =
        getSavedProjects();

    const totalProjectsElement =
        document.getElementById(
            "totalProjects"
        );

    const totalBudgetElement =
        document.getElementById(
            "totalBudget"
        );

    const averageBudgetElement =
        document.getElementById(
            "averageBudget"
        );

    const lastEstimateElement =
        document.getElementById(
            "lastEstimate"
        );

    if (totalProjectsElement) {
        totalProjectsElement.textContent =
            projects.length;
    }

    if (projects.length === 0) {
        if (totalBudgetElement) {
            totalBudgetElement.textContent =
                "Rs. 0";
        }

        if (averageBudgetElement) {
            averageBudgetElement.textContent =
                "Rs. 0";
        }

        if (lastEstimateElement) {
            lastEstimateElement.textContent =
                "—";
        }

        return;
    }

    let totalPKR = 0;

    projects.forEach(
        function (project) {
            const currencyRate =
                rates[project.currency] || 1;

            totalPKR +=
                Number(
                    project.expected
                ) *
                currencyRate;
        }
    );

    const averagePKR =
        totalPKR / projects.length;

    if (totalBudgetElement) {
        totalBudgetElement.textContent =
            "Rs. " +
            Math.round(
                totalPKR
            ).toLocaleString();
    }

    if (averageBudgetElement) {
        averageBudgetElement.textContent =
            "Rs. " +
            Math.round(
                averagePKR
            ).toLocaleString();
    }

    if (lastEstimateElement) {
        lastEstimateElement.textContent =
            projects[
                projects.length - 1
            ].date;
    }
}

/* =========================================================
   DASHBOARD PREVIEW
========================================================= */

function updateDashboardPreview() {
    if (!window.currentProject) {
        return;
    }

    const element =
        document.getElementById(
            "lastEstimate"
        );

    if (!element) {
        return;
    }

    element.textContent =
        formatMoney(
            window.currentProject.budget.expected,
            window.currentProject.data.currency
        );
}

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        loadProjects();
        updateDashboard();
    }
);