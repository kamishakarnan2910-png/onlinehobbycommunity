const USER_ID = 134;

async function loadNotifications() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/notifications/" + USER_ID
        );

        if (!response.ok) {
            throw new Error("Unable to load notifications");
        }

        const notifications = await response.json();

        const container =
            document.querySelector(".notification-container");

        const emptyMessage =
            document.getElementById("emptyMessage");

        container.innerHTML = "";

        if (notifications.length === 0) {

            emptyMessage.style.display = "block";
            return;
        }

        emptyMessage.style.display = "none";

        notifications.forEach(function(notification) {

            const item = document.createElement("div");

            item.className = "notification";

            if (!notification.read) {
                item.classList.add("unread");
            }

            const icon = document.createElement("div");
            icon.className = "notification-icon purple";
            icon.textContent = "🔔";

            const content = document.createElement("div");
            content.className = "notification-content";

            const title = document.createElement("h3");
            title.textContent = "New Notification";

            const message = document.createElement("p");
            message.textContent = notification.message;

            const time = document.createElement("span");
            time.textContent =
                notification.createdAt
                    ? new Date(notification.createdAt)
                        .toLocaleString()
                    : "";

            content.appendChild(title);
            content.appendChild(message);
            content.appendChild(time);

            item.appendChild(icon);
            item.appendChild(content);

            if (!notification.read) {

                const dot = document.createElement("span");
                dot.className = "dot";

                item.appendChild(dot);
            }

            container.appendChild(item);
        });

    } catch (error) {

        console.error(
            "Notification loading error:",
            error
        );
    }
}


async function markAllRead() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/notifications/" + USER_ID
        );

        if (!response.ok) {
            throw new Error("Unable to load notifications");
        }

        const notifications = await response.json();

        for (const notification of notifications) {

            if (!notification.read) {

                await fetch(
                    "http://localhost:8080/api/notifications/"
                    + notification.id
                    + "/read",
                    {
                        method: "PUT"
                    }
                );
            }
        }

        await loadNotifications();

        alert("All notifications marked as read!");

    } catch (error) {

        console.error(
            "Mark all read error:",
            error
        );

        alert("Unable to connect to backend.");
    }
}


loadNotifications();