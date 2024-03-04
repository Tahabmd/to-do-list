document.cookie = "key=value; HttpOnly";
setInterval(levels, 10);
let button = document.querySelector("button");
let article = document.querySelector("#article-input");
let addingArticle = document.querySelector("#adding-list");
let rightPanelDiv = document.querySelector(".right-panel-div");
let main = document.querySelector("main");
let panelBtn = document.querySelector("#info-panel-button");
let panelDiv = document.getElementById("panel");
let mainTasks, rightPanelTasks;
if (localStorage.getItem("userTask")) {
  mainTasks = loadTaskFromMain();
} else {
  mainTasks = [];
}
if (localStorage.getItem("taskDone")) {
  rightPanelTasks = loadTaskFromRightPanel();
} else {
  rightPanelTasks = [];
}
panelBtn.addEventListener("click", () => {
  if (panelDiv.style.maxHeight) {
    panelDiv.style.maxHeight = null;
  } else {
    panelDiv.style.maxHeight = panelDiv.scrollHeight + 50 + "px";
  }
  panelDiv.classList.toggle("show-the-div-panel");
});
button.addEventListener("click", addToList);
rightPanelDiv.addEventListener("dblclick", (e) => {
  if (e.target.localName === "section") {
    let targetedSection = e.target;
    addingArticle.appendChild(targetedSection);
    let taskToRemove = targetedSection.firstElementChild.innerHTML;
    let indexOfTask = rightPanelTasks.indexOf(taskToRemove);
    removeTaskFromRightPanel(indexOfTask);
    saveTasksFromMain(taskToRemove);
  }
});
main.addEventListener("dblclick", (e) => {
  // adding dblclick to remove the section to the right panel
  if (e.target.localName === "section") {
    let targetedSection = e.target;
    rightPanelDiv.appendChild(targetedSection);
    let task = targetedSection.firstElementChild.innerHTML;
    let indexOfTask = mainTasks.indexOf(task);
    removeTaskFromMain(indexOfTask);
    saveTasksFromRightPanel(task);
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addToList(); // even works with pressing enter
  }
});

window.addEventListener("click", (e) => {
  if (e.target.localName === "i") {
    let parent = e.target.parentNode; //parent node of the icon for deletion
    let taskToRemove = e.target.previousElementSibling.innerHTML;
    let mainTaskIndex = mainTasks.indexOf(taskToRemove);
    let rightPanelTaskIndex = rightPanelTasks.indexOf(taskToRemove);
    removeTaskFromMain(mainTaskIndex);
    removeTaskFromRightPanel(rightPanelTaskIndex);
    parent.outerHTML = "";
  }
});
document.addEventListener("DOMContentLoaded", () => {
  for (const task of mainTasks) {
    let section = document.createElement("section");
    section.innerHTML = `
    <h3>${encodeHTML(task)}</h3>
    <i class="fa-solid fa-trash-can"></i>`;
    addingArticle.appendChild(section);
  }
  for (const task of rightPanelTasks) {
    let section = document.createElement("section");
    section.innerHTML = `
    <h3>${encodeHTML(task)}</h3>
    <i class="fa-solid fa-trash-can"></i>`;
    rightPanelDiv.appendChild(section);
  }
});

function addToList() {
  //creates the section that contains the title of the todo
  let input = document.querySelector("input[type=text]");
  let section = document.createElement("section");
  try {
    if (input.value.trim() === "") throw "Enter your title...";
    section.innerHTML = `
    <h3>${encodeHTML(input.value)}</h3>
    <i class="fa-solid fa-trash-can"></i>`;
    addingArticle.appendChild(section);
    saveTasksFromMain(input.value);
    input.value = "";
  } catch (err) {
    alert(err);
  }
}
function encodeHTML(str) {
  // this encode prevent the xss attack
  return str.replace(/[&<>"'`=\/]/g, function (char) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    }[char];
  });
}

function levels() {
  // level of tasks
  let lvl = {
    0: "you've done nothing...",
    1: "Here we go!",
    2: "keep going",
    3: "the day is yours",
    4: "Great!",
    5: "Good job!",
    6: "you killing it",
    7: "Fantastic!",
    8: "be proud of yourself",
  };
  let count = rightPanelDiv.childElementCount;
  let h2 = rightPanelDiv.previousElementSibling;

  for (let number in lvl) {
    if (count == number) {
      h2.innerHTML = lvl[number];
    }
  }
  if (count > 8) {
    h2.innerHTML = lvl[8];
  }
}
function saveTasksFromMain(input) {
  mainTasks.push(input);
  localStorage.setItem("userTask", mainTasks);
}
function loadTaskFromMain() {
  return localStorage.getItem("userTask").split(",");
}
function removeTaskFromMain(taskIndex) {
  if (taskIndex !== -1) {
    mainTasks.splice(taskIndex, 1);
    localStorage.setItem("userTask", mainTasks);
  }
}
function saveTasksFromRightPanel(input) {
  rightPanelTasks.push(input);
  localStorage.setItem("taskDone", rightPanelTasks);
}
function loadTaskFromRightPanel() {
  return localStorage.getItem("taskDone").split(",");
}
function removeTaskFromRightPanel(taskIndex) {
  if (taskIndex !== -1) {
    rightPanelTasks.splice(taskIndex, 1);
    localStorage.setItem("taskDone", rightPanelTasks);
  }
}

// Register the service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(function (registration) {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch(function (error) {
      console.log("Service Worker registration failed:", error);
    });
}
