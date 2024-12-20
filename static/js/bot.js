function updateTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var timeString = hours + ':' + minutes;
    document.getElementById('clock').textContent = timeString;
}
setInterval(updateTime, 1000);

document.addEventListener('DOMContentLoaded', function() {
    const msgerForm = document.querySelector(".msger-inputarea");
    const msgerInput = document.querySelector(".msger-input");
    const msgerChat = document.querySelector(".msger-chat");

    const BOT_IMG = "static/img/mhcicon.png";
    const PERSON_IMG = "static/img/person.png";
    const BOT_NAME = "MediMind";
    const PERSON_NAME = "You";

    // Show initial welcome message
    appendMessage(BOT_NAME, BOT_IMG, "left", 
        "Welcome to MediMind! I'm here to support you. How are you feeling today?"
    );

    // Handle message submission
    msgerForm.addEventListener("submit", event => {
        event.preventDefault();

        const msgText = msgerInput.value;
        if (!msgText) return;

        appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
        msgerInput.value = "";

        // Show typing indicator
        appendMessage(BOT_NAME, BOT_IMG, "left", "...");

        // Get bot response
        $.get("/get", { msg: msgText })
            .done(function(data) {
                // Remove typing indicator
                msgerChat.lastElementChild.remove();
                // Add bot response
                appendMessage(BOT_NAME, BOT_IMG, "left", data);
                // Scroll to bottom
                msgerChat.scrollTop = msgerChat.scrollHeight;
            })
            .fail(function() {
                // Remove typing indicator
                msgerChat.lastElementChild.remove();
                // Add error message
                appendMessage(BOT_NAME, BOT_IMG, "left", 
                    "I'm having trouble connecting. Please try again."
                );
            });
    });

    function appendMessage(name, img, side, text) {
        const msgHTML = `
            <div class="msg ${side}-msg">
                <div class="msg-img" style="background-image: url(${img})"></div>
                <div class="msg-bubble">
                    <div class="msg-info">
                        <div class="msg-info-name">${name}</div>
                        <div class="msg-info-time">${formatDate(new Date())}</div>
                    </div>
                    <div class="msg-text">${text}</div>
                </div>
            </div>
        `;
        msgerChat.insertAdjacentHTML("beforeend", msgHTML);
        msgerChat.scrollTop = msgerChat.scrollHeight;
    }

    function formatDate(date) {
        const h = "0" + date.getHours();
        const m = "0" + date.getMinutes();
        return `${h.slice(-2)}:${m.slice(-2)}`;
    }
});
// Toggle chat window
document.getElementById("chatbot_toggle").onclick = function() {
    const chatbot = document.getElementById("chatbot");
    const toggleBtn = document.getElementById("chatbot_toggle");
    
    if (chatbot.classList.contains("collapsed")) {
        chatbot.classList.remove("collapsed");
        toggleBtn.children[0].style.display = "none";
        toggleBtn.children[1].style.display = "";
    } else {
        chatbot.classList.add("collapsed");
        toggleBtn.children[0].style.display = "";
        toggleBtn.children[1].style.display = "none";
    }
};

