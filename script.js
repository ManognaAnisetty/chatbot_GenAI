const conversationHistory = [];
let btn = document.querySelector("#send-btn");
let ui = document.querySelector("#user-input");
let cb = document.querySelector("#chat-box");
btn.addEventListener("click",sendMessage);
ui.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        sendMessage();
    }});
async function sendMessage(){
    if(!(ui.value)){
        alert("Please enter a message");
        return;
    }
    let userText = ui.value;
    let div = document.createElement("div");
    div.classList.add("message");
    div.classList.add("user");
    div.textContent = userText;
    cb.appendChild(div);
    ui.value = "";

    conversationHistory.push({
        role: "user",
        content: userText
    });

    const reply = await callAI(userText);

    conversationHistory.push({
        role: "assistant",  
        content: reply
    });

    let div2 = document.createElement("div");
    div2.classList.add("message");
    div2.classList.add("bot");
    div2.textContent = reply;
    cb.appendChild(div2);


};

async function callAI(userText){
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",   
                "Authorization": "Bearer gsk_API"   
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: conversationHistory
            })  
        });
        const data = await response.json();
        return data.choices[0].message.content;
};

