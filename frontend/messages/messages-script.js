const USER_ID = 134;
let currentReceiverId = 1;


async function loadMessages() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/messages/conversation/"
            + USER_ID
            + "/"
            + currentReceiverId
        );

        if (!response.ok) {
            throw new Error("Unable to load messages");
        }

        const messages = await response.json();

        const container =
            document.getElementById("messages");

        container.innerHTML = "";

        messages.forEach(function(message) {

            const messageDiv =
                document.createElement("div");

            if (message.senderId === USER_ID) {
                messageDiv.className = "message sent";
            } else {
                messageDiv.className = "message received";
            }

            const text =
                document.createElement("p");

            text.textContent = message.message;

            const time =
                document.createElement("span");

            if (message.createdAt) {
                time.textContent =
                    new Date(message.createdAt)
                        .toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        });
            }

            messageDiv.appendChild(text);
            messageDiv.appendChild(time);

            container.appendChild(messageDiv);
        });

    } catch (error) {

        console.error(
            "Message loading error:",
            error
        );
    }
}


async function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const messageText =
        input.value.trim();

    if (messageText === "") {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:8080/api/messages",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    senderId: USER_ID,
                    receiverId: currentReceiverId,
                    message: messageText,
                    read: false
                })
            }
        );

        if (!response.ok) {
            throw new Error("Unable to send message");
        }

        input.value = "";

        await loadMessages();

    } catch (error) {

        console.error(
            "Message sending error:",
            error
        );

        alert("Unable to connect to backend.");
    }
}


function handleEnter(event) {

    if (event.key === "Enter") {
        sendMessage();
    }
}


function openChat(name, emoji, status) {

    document.getElementById("chatName").textContent =
        name;

    document.getElementById("chatStatus").textContent =
        "🟢 " + status;

    loadMessages();
}


function searchChats() {

    const searchValue =
        document.getElementById("searchChat")
            .value
            .toLowerCase();

    const chats =
        document.querySelectorAll(".chat-item");

    chats.forEach(function(chat) {

        const name =
            chat.querySelector(".chat-info h3")
                .textContent
                .toLowerCase();

        if (name.includes(searchValue)) {
            chat.style.display = "flex";
        } else {
            chat.style.display = "none";
        }
    });
}


function newChat() {

    alert(
        "New chat feature will be connected with users later."
    );
}


loadMessages();