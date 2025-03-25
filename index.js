lines = lines.split("\n");
let container = document.getElementById("content");

for (let line of lines) {
    let div = document.createElement("div");
    div.innerHTML = line;
    container.appendChild(div);

    let btnRead = document.createElement("button");
    btnRead.innerHTML = " 🔊";
    div.appendChild(btnRead);
    btnRead.addEventListener('click', () =>
        speak(line));
}
function speak(text) {
    text = text.split("<icon>")[0].trim();
    const speech = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(speech);
}