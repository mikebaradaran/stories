lines = lines.split("\n");
let container = document.getElementById("content");

for (let line of lines) {
  if(line.trim() === "") continue; // Skip empty lines
  let div = document.createElement("div");
  div.innerHTML = line;
  container.appendChild(div);

  let btnRead = document.createElement("button");
  btnRead.innerHTML = "🗣️";
  div.appendChild(btnRead);
  btnRead.addEventListener("click", () => speak(line));
}
function speak(text) {
  text = text.split("<icon>")[0].trim();
  const speech = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(speech);
}

function speakWoman(text) {
  const utterance = new SpeechSynthesisUtterance(text);

  function setVoice() {
    const voices = speechSynthesis.getVoices();
    console.log(
      "Available voices:",
      voices.map((v) => v.name)
    ); // Debugging: Log all voices

    // Try to find a female voice
    const femaleVoice = voices.find(
      (voice) =>
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman") ||
        voice.name.toLowerCase().includes("samantha") // Common female voice in macOS
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else {
      console.warn("No female voice found, using default.");
    }

    speechSynthesis.speak(utterance);
  }
}
