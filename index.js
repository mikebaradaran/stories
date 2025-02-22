lines = lines.split("\n");
let container = document.getElementById("content");

for (let line of lines) {
    let div = document.createElement("div");
    div.innerHTML = line;
    container.appendChild(div);
}
