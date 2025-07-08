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
    console.log(x);
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
        div.innerHTML = line;
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
  text = text.split("<icon>")[0].trim();
  const speech = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(speech);
}

