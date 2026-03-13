const conversationHistory = [
    {
        role: "system",
        content: `You are a friendly Study Buddy for Tech students.
        - Assume user knows NOTHING about the topic
        - Explain from zero to hero level step by step
        - Use simple real world analogies
        - Be friendly and encouraging throughout
        - Always use short paragraphs with line breaks between sections
        - Never write long walls of text
        - Keep each response concise and readable
        - and always ask if user has any doubts after explaining each topic, and clarify them before moving on to next topic
        - after explaining any topic, always end your explanation with "Want to test yourself on this topic? 🎯 Just say yes!"
        - When user agrees to quiz (says yes/yay/sure/let's go), generate exactly 15 multiple choice questions on the last topic
        - Ask questions ONE by ONE, wait for answer
        - After each answer tell user if correct or wrong and explain why
        - Keep score and show final result after all 15 questions
        - STRICTLY ask only ONE question at a time
        - NEVER show more than one question in a single response
        - You MUST wait for user to answer before showing next question`
    }
];
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
    cb.scrollTop = cb.scrollHeight;
    ui.value = "";

    let typing = document.createElement("div");
    typing.classList.add("message");
    typing.classList.add("bot");
    typing.textContent = "Typing...";
    cb.appendChild(typing);

    conversationHistory.push({
        role: "user",
        content: userText
    });

    const reply = await callAI(userText);

    cb.removeChild(typing);
    conversationHistory.push({
        role: "assistant",  
        content: reply
    });

    let div2 = document.createElement("div");
    div2.classList.add("message");
    div2.classList.add("bot");
    div2.textContent = reply;
    cb.appendChild(div2);
    cb.scrollTop = cb.scrollHeight;

};  

async function callAI(userText){
        const response = await fetch("https://chatbot-proxy.manogna255.workers.dev/",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"   
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: conversationHistory
            })  
        });
        const data = await response.json();
        return data.choices[0].message.content;
};


