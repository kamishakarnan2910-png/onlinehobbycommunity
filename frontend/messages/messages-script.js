const USER_ID = localStorage.getItem("userId");

let currentReceiverId = null;

let chatUsers = [];

let refreshTimer = null;


if (!USER_ID) {

    alert("Please login first.");

    window.location.href =
        "../login/login.html";
}


/* ==============================
   LOAD CHAT USERS
============================== */

async function loadChatUsers() {

    const chatList =
        document.getElementById("chatList");

    try {

        chatList.innerHTML = `
            <div class="empty-chats">
                <h3>Loading users...</h3>
                <p>Please wait.</p>
            </div>
        `;


        const response =
            await fetch(
                "http://localhost:8080/api/users/chat-users/"
                + USER_ID
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load users"
            );
        }


        chatUsers =
            await response.json();


        displayChatUsers();


    } catch (error) {

        console.error(
            "Chat users loading error:",
            error
        );


        chatList.innerHTML = `
            <div class="empty-chats">
                <h3>Unable to load users</h3>
                <p>Please make sure the backend is running.</p>
            </div>
        `;
    }
}


/* ==============================
   DISPLAY CHAT USERS
============================== */

function displayChatUsers() {

    const chatList =
        document.getElementById("chatList");


    chatList.innerHTML = "";


    if (
        !chatUsers ||
        chatUsers.length === 0
    ) {

        chatList.innerHTML = `
            <div class="empty-chats">
                <h3>No users available</h3>
                <p>There are no other users to chat with.</p>
            </div>
        `;

        return;
    }


    chatUsers.forEach(function(user) {

        const chatItem =
            document.createElement("div");


        chatItem.className =
            "chat-item";


        chatItem.dataset.userId =
            user.id;


        const name =
            user.name ||
            "User";


        const firstLetter =
            name
                .charAt(0)
                .toUpperCase();


        chatItem.innerHTML = `

            <div class="avatar purple">
                ${firstLetter}
            </div>

            <div class="chat-info">

                <h3>
                    ${name}
                </h3>

                <p>
                    Start a conversation
                </p>

            </div>

            <span class="chat-time">
                --
            </span>
        `;


        chatItem.addEventListener(
            "click",
            function() {

                openChat(
                    user.id,
                    user.name,
                    "Available"
                );


                document
                    .querySelectorAll(".chat-item")
                    .forEach(function(item) {

                        item.classList.remove(
                            "active-chat"
                        );

                    });


                chatItem.classList.add(
                    "active-chat"
                );
            }
        );


        chatList.appendChild(
            chatItem
        );

    });
}


/* ==============================
   LOAD MESSAGES
============================== */

async function loadMessages() {

    if (!currentReceiverId) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/messages/conversation/"
                + USER_ID
                + "/"
                + currentReceiverId
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load messages"
            );
        }


        const messages =
            await response.json();


        const container =
            document.getElementById(
                "messages"
            );


        container.innerHTML = "";


        if (
            !messages ||
            messages.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-messages">

                    <h3>
                        No messages yet
                    </h3>

                    <p>
                        Start the conversation.
                    </p>

                </div>
            `;

            return;
        }


        messages.forEach(
            function(message) {

                const messageDiv =
                    document.createElement(
                        "div"
                    );


                if (
                    String(message.senderId) ===
                    String(USER_ID)
                ) {

                    messageDiv.className =
                        "message sent";

                } else {

                    messageDiv.className =
                        "message received";
                }


                const text =
                    document.createElement(
                        "p"
                    );


                text.textContent =
                    message.message;


                const time =
                    document.createElement(
                        "span"
                    );


                if (message.createdAt) {

                    time.textContent =
                        new Date(
                            message.createdAt
                        ).toLocaleTimeString(
                            [],
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        );
                }


                messageDiv.appendChild(
                    text
                );


                messageDiv.appendChild(
                    time
                );


                container.appendChild(
                    messageDiv
                );

            }
        );


        container.scrollTop =
            container.scrollHeight;


    } catch (error) {

        console.error(
            "Message loading error:",
            error
        );
    }
}


/* ==============================
   SEND MESSAGE
============================== */

async function sendMessage() {

    if (!currentReceiverId) {

        alert(
            "Please select a user first."
        );

        return;
    }


    const input =
        document.getElementById(
            "messageInput"
        );


    const messageText =
        input.value.trim();


    if (messageText === "") {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:8080/api/messages",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        senderId:
                            Number(USER_ID),

                        receiverId:
                            Number(
                                currentReceiverId
                            ),

                        message:
                            messageText,

                        read:
                            false
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to send message"
            );
        }


        input.value = "";


        await loadMessages();


    } catch (error) {

        console.error(
            "Message sending error:",
            error
        );


        alert(
            "Unable to send message. Please try again."
        );
    }
}


/* ==============================
   OPEN CHAT
============================== */

function openChat(
    receiverId,
    name,
    status
) {

    currentReceiverId =
        receiverId;


    document.getElementById(
        "chatName"
    ).textContent =
        name;


    document.getElementById(
        "chatStatus"
    ).textContent =
        "🟢 " + status;


    const avatar =
        document.getElementById(
            "chatAvatar"
        );


    if (avatar) {

        avatar.textContent =
            (name || "U")
                .charAt(0)
                .toUpperCase();
    }


    const input =
        document.getElementById(
            "messageInput"
        );


    const sendButton =
        document.getElementById(
            "sendButton"
        );


    if (input) {
        input.disabled = false;
    }


    if (sendButton) {
        sendButton.disabled = false;
    }


    loadMessages();


    startMessageRefresh();
}


/* ==============================
   SEARCH CHATS
============================== */

function searchChats() {

    const searchInput =
        document.getElementById(
            "searchChat"
        );


    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    const chats =
        document.querySelectorAll(
            ".chat-item"
        );


    chats.forEach(
        function(chat) {

            const nameElement =
                chat.querySelector(
                    ".chat-info h3"
                );


            if (!nameElement) {
                return;
            }


            const name =
                nameElement.textContent
                    .toLowerCase();


            if (
                name.includes(
                    searchValue
                )
            ) {

                chat.style.display =
                    "flex";

            } else {

                chat.style.display =
                    "none";
            }

        }
    );
}


/* ==============================
   NEW CHAT
============================== */

function newChat() {

    const searchInput =
        document.getElementById(
            "searchChat"
        );


    if (searchInput) {

        searchInput.focus();

        searchInput.value = "";

        searchChats();
    }
}


/* ==============================
   ENTER TO SEND
============================== */

function handleEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendMessage();
    }
}


/* ==============================
   AUTO REFRESH
============================== */

function startMessageRefresh() {

    if (refreshTimer) {

        clearInterval(
            refreshTimer
        );
    }


    refreshTimer =
        setInterval(
            function() {

                if (currentReceiverId) {

                    loadMessages();
                }

            },
            3000
        );
}


/* ==============================
   START
============================== */

document
    .getElementById("messageInput")
    ?.addEventListener(
        "keydown",
        handleEnter
    );


loadChatUsers();