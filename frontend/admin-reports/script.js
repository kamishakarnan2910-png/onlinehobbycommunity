const reportsContainer = document.getElementById("reportsContainer");
const message = document.getElementById("message");
const statusFilter = document.getElementById("statusFilter");

async function loadReports() {

    reportsContainer.innerHTML = "";

    try {

        let url = "http://localhost:8080/api/reports";

        if (statusFilter && statusFilter.value !== "ALL") {
            url =
                "http://localhost:8080/api/reports/status/"
                + statusFilter.value;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const reports = await response.json();

        message.textContent = "";

        if (reports.length === 0) {

            reportsContainer.innerHTML = `
                <div class="empty-message">
                    No reports found.
                </div>
            `;

            return;
        }

        reports.forEach(function(report) {

            const card = document.createElement("div");

            card.className = "report-card";

            const status =
                report.status || "PENDING";

            card.innerHTML = `
                <div class="report-header">

                    <h2>Report #${report.id}</h2>

                    <span class="status ${status.toLowerCase()}">
                        ${status}
                    </span>

                </div>

                <div class="report-details">

                    <div class="detail">
                        <strong>Reporter ID</strong>
                        <span>${report.reporterId || "-"}</span>
                    </div>

                    <div class="detail">
                        <strong>Post ID</strong>
                        <span>${report.postId || "-"}</span>
                    </div>

                    <div class="detail">
                        <strong>Reason</strong>
                        <span>${report.reason || "-"}</span>
                    </div>

                    <div class="detail">
                        <strong>Created At</strong>
                        <span>${report.createdAt || "-"}</span>
                    </div>

                </div>

                <div class="description">
                    <strong>Description:</strong>
                    <p>${report.description || "-"}</p>
                </div>

                <div class="actions">

                    <button
                        class="resolve-button"
                        onclick="updateStatus(${report.id}, 'RESOLVED')">
                        Mark Resolved
                    </button>

                    <button
                        class="reject-button"
                        onclick="updateStatus(${report.id}, 'REJECTED')">
                        Reject Report
                    </button>

                </div>
            `;

            reportsContainer.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        reportsContainer.innerHTML = `
            <div class="empty-message">
                Unable to load reports.
            </div>
        `;
    }
}


async function updateStatus(reportId, newStatus) {

    try {

        const response = await fetch(
            "http://localhost:8080/api/reports/"
            + reportId
            + "/status?status="
            + newStatus,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {
            throw new Error("Status update failed");
        }

        await loadReports();

    } catch (error) {

        console.error(error);

        alert("Unable to update report.");
    }
}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        loadReports
    );
}


const backButton =
    document.getElementById("backButton");

if (backButton) {

    backButton.addEventListener(
        "click",
        function() {

            window.location.href =
                "../admin-dashboard/index.html";
        }
    );
}


loadReports();