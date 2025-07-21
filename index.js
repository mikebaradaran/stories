// File: index.js
const storyBase = "/story_files/"
const story = document.getElementById("story");

readFile("titles.json", displayTitlesAsList);

function displayTitlesAsList(lines) {
  setupSpeech();
  lines = JSON.parse(lines);

  let selectTag = document.getElementById("titles");

  for (let line of lines) {
    let optionTag = document.createElement("option");
    optionTag.innerText = line.title;
    selectTag.appendChild(optionTag);
  }
  selectTag.onchange = () => { displayStory(lines[selectTag.selectedIndex].file); };
}

function displayStory(storyFile) {
  storyTitle = storyFile.split("~")[0];
  readFile(storyTitle, renderStory);

  // setup an event when any <span> is clicked on
  if (!story._listenerAttached) {   // avoid attaching every time a new story is loaded
    story.addEventListener("click", function (event) {
      if (event.target.tagName === "SPAN") {
        speak(event.target.innerText);
      }
    });
    story._listenerAttached = true;
  }
}

function readAll() {
  story.stopFunc = speakLines(story.rawData);
}

function stopReadAll() {
  showCurrentLine("");
  window.speechSynthesis.cancel();
  story.stopFunc();
}

function renderStory(data) {
  story.innerHTML = "";
  story.rawData = removeEmojisAndQuotes(data)

  let lines = data.split("\n");
  let linesForSpeech = story.rawData.split("\n");

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

    let button = `<span2 onclick="speak('${linesForSpeech[i].trim()}')"  aria-label="Read line aloud">🔊</span2>`;
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

function showCurrentLine(text) {
  document.getElementById("currentLineDiv").innerText = text;
}

// ------------------Speech -----------
let msg;

function setupSpeech() {
  msg = new SpeechSynthesisUtterance();

  window.speechSynthesis.onvoiceschanged = () => {
    const voices = speechSynthesis.getVoices();

    msg.voice = voices.find(voice =>
      voice.name.toLowerCase().includes("female") ||
      voice.name.toLowerCase().includes("woman") ||
      voice.name.toLowerCase().includes("samantha") ||
      voice.name.toLowerCase().includes("zira")
    );

    msg.pitch = 1.1;
    msg.rate = 0.9;
  };
}

function talk(text) {
  if (!msg)
    setupSpeech;
  msg.text = text;
  speechSynthesis.speak(msg);
}

function speakLines(text) {
  const lines = text.split("\n");
  let cancelled = false;

  function speakNext(i) {
    const delay = 500;
    if (cancelled || i >= lines.length) return;
    showCurrentLine(lines[i]);
    talk(lines[i]);
    msg.onend = () => {
      if (!cancelled)
        setTimeout(() => speakNext(i + 1), delay);
    };
  }
  speakNext(0);
  // Return a stop function
  return () => {
    cancelled = true;
    speechSynthesis.cancel(); // optional: stop current speech too
  };
}
