// File: index.js

fetch("titles.txt")
  .then((response) => response.text())
  .then((lines) => {
    displayTitles(lines);
  });

let container = document.getElementById("content");
let story = document.getElementById("story");

function displayTitles(lines) {
  lines = lines.split("\n");
  container.innerHTML = ""; // Clear previous content

  for (let index = 0; index < lines.length; index++) {
    line = lines[index].trim();
    if (line === "") continue; // Skip empty lines
    let a = document.createElement("a");
    let x = lines[index].split("~");
    a.innerText = x[1];
    a.href = `javascript:displayStory('${x[0]}')`;
    container.appendChild(a);
  }
}

function displayStory(storyFile) {
  story.innerHTML = ""; // Clear previous story content
  fetch(storyFile)
    .then((response) => response.text())
    .then((data) => {
      lines = data.split("\n");
      for (let line of lines) {
        let div = document.createElement("div");
        div.innerHTML = addIconTagaroundEmojis(line);
        story.appendChild(div);

        if (line.trim() === "") {
          div.style.height = "1em";
          continue; // Skip empty lines
        }
        let btnRead = document.createElement("button");
        btnRead.innerHTML = "🗣️";
        div.appendChild(btnRead);
        btnRead.addEventListener("click", () => speak(line));
      }
    });
}


function speak(text) {
  //text = text.split("<icon>")[0].trim();
  text = text.replace(/<icon>.*?<\/icon>/g, '').trim(); // Remove <icon> tags""
  text = removeEmojis(text)
  if (text === "") return; // Skip empty text
  talk(text);
}

function removeEmojis(str) {
  return str.replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '');
}

function addIconTagaroundEmojis(text) {
  return text.replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu, '<icon>$&</icon>');
}
function talk(text) {
  const msg = new SpeechSynthesisUtterance(text);

  // Get available voices
  const voices = speechSynthesis.getVoices();

  // Choose a female voice (you may want to fine-tune this)
  msg.voice = voices.find(voice =>
    voice.name.toLowerCase().includes("female") ||
    voice.name.toLowerCase().includes("woman") ||
    voice.name.toLowerCase().includes("samantha") ||  // Example: macOS
    voice.name.toLowerCase().includes("zira")         // Example: Windows
  );

  // Optional settings
  msg.pitch = 1.1;  // slightly higher pitch
  msg.rate = 1;     // speaking speed

  speechSynthesis.speak(msg);
}

// Voices may not be loaded immediately
window.speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();  // Trigger loading voices
};



