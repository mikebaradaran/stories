// File: index.js
const storyBase = "/story_files/"

const container = document.getElementById("content");
const story = document.getElementById("story");

readFile("titles.txt", displayTitles);

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
  readFile(storyFile, renderStory);

  // setup an event when any <span> is clicked on
  if (!story.eventsApplied) {
    story.addEventListener("click", function (event) {
      if (event.target.tagName === "SPAN") {
        speak(event.target.innerText);
      }
    });
    story.eventsApplied = true;
  }
}

//let linesForSpeech = "";

function readAll() {
  for (let line of story.linesForSpeech)
    talk(line);
}
function renderStory(data) {
  story.linesForSpeech = removeEmojisAndQuotes(data).split("\n");
  let lines = data.split("\n");
  let btn = `<span2 onclick="readAll()">Read all lines</span2>`; // Clear previous story
  story.innerHTML = btn; // Clear previous story

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let div = document.createElement("div");
    story.appendChild(div);

    if (line.trim() === "") {
      div.innerHTML = "<hr />";
      continue; // Skip empty lines
    }

    line = makeEachWordIntoSpan(line);
    line = addIconTagAroundEmojis(line);

    let button = `<span2 onclick="speak('${story.linesForSpeech[i].trim()}')">🔊</span2>`;
    div.innerHTML = `${button} ${line}`;
  }
}

//----------------------------------------------------------------------
function makeEachWordIntoSpan(line) {
  line = line.split(' ').map(word => `<span>${word} </span>`).join("");
  return line;
}

function speak(text) {
  if (text === "") return; // Skip empty text
  window.speechSynthesis.cancel();

  talk(text);
}

function removeEmojisAndQuotes(str) {
  str = str.replace(/"/g, '');
  return str.replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '');
}

function addIconTagAroundEmojis(text) {
  return text.replace(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu, '<icon>$&</icon>');
}

function readFile(filename, callbackFunc) {
  fetch(storyBase + filename)
    .then((response) => response.text())
    .then((data) => {
      callbackFunc(data);
    });
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
  msg.rate = 0.9;     // speaking speed

  speechSynthesis.speak(msg);
}

// Voices may not be loaded immediately
window.speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();  // Trigger loading voices
};

