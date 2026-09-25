const reportsContainer =
    document.getElementById("reportsContainer");

const message =
    document.getElementById("message");

const statusFilter =
    document.getElementById("statusFilter");


// ===============================
// LOAD REPORTS
// ===============================

async function loadReports() {

    reportsContainer.innerHTML = "";

    try {

        let url =
            "http://localhost:8080/api/reports";

        if (
            statusFilter &&
            statusFilter.value !== "ALL"
        ) {

            url =
                "http://localhost:8080/api/reports/status/"
                + statusFilter.value;
        }

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Server error: " + response.status
            );
        }

        const reports =
            await response.json();

        message.textContent = "";


        if (
            !reports ||
            reports.length === 0
        ) {

            reportsContainer.innerHTML = `
                <div class="empty-message">
                    No reports found.
                </div>
            `;

            return;
        }


        reports
            .slice()
            .reverse()
            .forEach(function(report) {

                const card =
                    document.createElement("div");

                card.className =
                    "report-card";


                const status =
                    report.status || "PENDING";


                const createdAt =
                    report.createdAt
                        ? new Date(
                            report.createdAt
                        ).toLocaleString()
                        : "-";


                card.innerHTML = `

                    <div class="report-header">

                        <h2>
                            Report #${report.id}
                        </h2>

                        <span class="status ${status.toLowerCase()}">
                            ${escapeHtml(status)}
                        </span>

                    </div>


                    <div class="report-details">

                        <div class="detail">

                            <strong>
                                Reporter ID
                            </strong>

                            <span>
                                ${report.reporterId || "-"}
                            </span>

                        </div>


                        <div class="detail">

                            <strong>
                                Post ID
                            </strong>

                            <span>
                                ${report.postId || "-"}
                            </span>

                        </div>


                        <div class="detail">

                            <strong>
                                Reason
                            </strong>

                            <span>
                                ${escapeHtml(
                                    report.reason || "-"
                                )}
                            </span>

                        </div>


                        <div class="detail">

                            <strong>
                                Created At
                            </strong>

                            <span>
                                ${escapeHtml(
                                    createdAt
                                )}
                            </span>

                        </div>

                    </div>


                    <div class="description">

                        <strong>
                            Description:
                        </strong>

                        <p>
                            ${escapeHtml(
                                report.description || "-"
                            )}
                        </p>

                    </div>


                    <div class="actions">

                        <button
                            class="resolve-button"
                            onclick="updateStatus(
                                ${report.id},
                                'RESOLVED'
                            )">
                            Mark Resolved
                        </button>


                        <button
                            class="reject-button"
                            onclick="updateStatus(
                                ${report.id},
                                'REJECTED'
                            )">
                            Reject Report
                        </button>


                        <button
                            class="delete-report-button"
                            onclick="deleteReport(
                                ${report.id}
                            )">
                            Delete
                        </button>

                    </div>

                `;


                reportsContainer.appendChild(card);
            });


    } catch (error) {

        console.error(
            "Reports loading error:",
            error
        );

        reportsContainer.innerHTML = `
            <div class="empty-message">
                Unable to load reports.
            </div>
        `;
    }
}


// ===============================
// UPDATE STATUS
// ===============================

async function updateStatus(
    reportId,
    newStatus
) {

    try {

        const response =
            await fetch(
                "http://localhost:8080/api/reports/"
                + reportId
                + "/status?status="
                + newStatus,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Status update failed"
            );
        }


        await loadReports();


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(
            "Unable to update report."
        );
    }
}


// ===============================
// DELETE REPORT
// ===============================

async function deleteReport(reportId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this report?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/reports/"
                + reportId,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );
        }


        await loadReports();


    } catch (error) {

        console.error(
            "Report delete error:",
            error
        );

        alert(
            "Unable to delete the report."
        );
    }
}


// ===============================
// HTML SECURITY
// ===============================

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value == null
            ? ""
            : String(value);

    return div.innerHTML;
}


// ===============================
// STATUS FILTER
// ===============================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        loadReports
    );
}


// ===============================
// BACK BUTTON
// ===============================

const backButton =
    document.getElementById(
        "backButton"
    );


if (backButton) {

    backButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "../admin-dashboard/index.html";
        }
    );
}


// ===============================
// START
// ===============================

loadReports();