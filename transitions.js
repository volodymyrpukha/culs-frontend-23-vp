// Simplified selectors
const selectors = {
  body: document.body,
  presentation: document.getElementById("presentation"),
  tools: document.getElementById("tools"),
  restart: document.getElementById("restart"),
  nextSlide: document.getElementById("nextSlide"),
  previousSlide: document.getElementById("previousSlide"),
  nextChapter: document.getElementById("nextChapter"),
  previousChapter: document.getElementById("previousChapter"),
  chapters: Array.from(document.getElementsByClassName("chapter")),
  titles: Array.from(document.getElementById("titles").children),
};

let state = {
  chapter: 0,
  slides: [],
  fadeToolsTimeoutId: null,
};

// Initialize the presentation
function init() {
  state.slides = selectors.chapters.map(() => 0);
  moveChapter(-state.chapter);
}

// Function to translate the presentation
function translatePresentation() {
  const { chapter, slides } = state;
  selectors.presentation.style.translate =
    (slides[chapter] * -100).toString() +
    "vw " +
    (chapter * -100).toString() +
    "vh";
}

// Function to handle slide movement
function moveSlide(increment) {
  let { chapter, slides } = state;
  let currentSlide = slides[chapter];
  let totalSlides = selectors.chapters[chapter].children.length;

  // Calculate the new slide number
  const newSlide = currentSlide + increment;
  if (newSlide < 0 || newSlide >= totalSlides) return;

  // Update state
  state.slides[chapter] = newSlide;

  // Update UI elements
  selectors.previousSlide.disabled = newSlide === 0;
  selectors.nextSlide.disabled = newSlide === totalSlides - 1;

  // Update title
  selectors.titles[chapter].querySelector(".position").textContent =
    newSlide + 1;

  // Translate the presentation to the new position
  translatePresentation();
}

// Function to handle chapter movement
function moveChapter(increment) {
  let { chapter } = state;
  const totalChapters = selectors.chapters.length;

  // Calculate the new chapter number
  const newChapter = chapter + increment;
  if (newChapter < 0 || newChapter >= totalChapters) return;

  // Update state
  state.chapter = newChapter;

  // Update UI elements
  selectors.titles.forEach((title) => (title.style.display = "none"));
  selectors.titles[newChapter].style.display = "inline";
  selectors.previousChapter.disabled = newChapter === 0;
  selectors.nextChapter.disabled = newChapter === totalChapters - 1;

  // Move to the initial slide of the new chapter
  moveSlide(0);

  // Manage tools fade effect
  unFadeTools();
  resetFadeToolsTimeout();

  // Translate the presentation to the new position
  translatePresentation();
}

// Keyboard event handler
function keyMove(e) {
  switch (e.key) {
    case " ":
      moveSlide(e.shiftKey ? -1 : 1);
      break;
    case "ArrowRight":
      moveSlide(1);
      break;
    case "ArrowLeft":
      moveSlide(-1);
      break;
    case "ArrowDown":
      moveChapter(1);
      break;
    case "ArrowUp":
      moveChapter(-1);
      break;
  }
}

// Reset timeout to fade tools
function resetFadeToolsTimeout() {
  clearTimeout(state.fadeToolsTimeoutId);
  state.fadeToolsTimeoutId = setTimeout(fadeTools, 2500);
}

// Function to fade tools
function fadeTools() {
  selectors.tools.style.opacity = 0.05;
}

// Function to unfade tools
function unFadeTools() {
  clearTimeout(state.fadeToolsTimeoutId);
  selectors.tools.style.opacity = 1;
}

// Event listeners
selectors.nextSlide.addEventListener("click", () => moveSlide(1));
selectors.previousSlide.addEventListener("click", () => moveSlide(-1));
selectors.nextChapter.addEventListener("click", () => moveChapter(1));
selectors.previousChapter.addEventListener("click", () => moveChapter(-1));
selectors.restart.addEventListener("click", init);
selectors.tools.addEventListener("mouseenter", unFadeTools);
selectors.tools.addEventListener("mouseleave", resetFadeToolsTimeout);
selectors.body.addEventListener("keyup", keyMove);

// Initial setup
init();
