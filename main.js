const stories = {
  "2026-08-11": {
    category: "Launch",
    title: "Daily News Calendar begins",
    summary: "The calendar is ready for its first researched daily headline. Each new entry will preserve a concise neutral summary and a direct link to the original reporting.",
    source: "https://www.reuters.com/world/"
  }
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendar = document.querySelector("#calendar");
const monthLabel = document.querySelector("#month-title");
const monthSubtitle = document.querySelector("#month-subtitle");
const storyPanel = document.querySelector("#selected-story");
let selectedDate = Object.keys(stories).sort().at(-1);
let viewDate = new Date(selectedDate + "T12:00:00");

const keyFor = (year, month, day) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

function renderStory(key) {
  const story = stories[key];
  if (!story) return;
  selectedDate = key;
  storyPanel.innerHTML = `
    <p class="eyebrow">${story.category}</p>
    <h2>${story.title}</h2>
    <p>${story.summary}</p>
    <p class="story-meta">${new Intl.DateTimeFormat("en", { dateStyle: "full" }).format(new Date(key + "T12:00:00"))}</p>
    <a href="${story.source}" target="_blank" rel="noopener">Read the source <span aria-hidden="true">↗</span></a>`;
  document.querySelectorAll(".day.featured").forEach(day => day.classList.toggle("is-selected", day.dataset.date === key));
}

function renderCalendar() {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  monthLabel.textContent = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(viewDate);
  const count = new Date(year, month + 1, 0).getDate();
  const first = new Date(year, month, 1).getDay();
  const entries = Object.keys(stories).filter(key => key.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`));
  monthSubtitle.textContent = `${entries.length} story${entries.length === 1 ? "" : "ies"} archived`;
  calendar.innerHTML = days.map(day => `<div class="weekday">${day}</div>`).join("");
  for (let index = 0; index < first; index += 1) calendar.insertAdjacentHTML("beforeend", '<div class="day blank"></div>');
  for (let day = 1; day <= count; day += 1) {
    const key = keyFor(year, month, day);
    const story = stories[key];
    const article = story
      ? `<button class="day featured ${key === selectedDate ? "is-selected" : ""}" data-date="${key}" aria-label="Read story for ${key}"><span class="number">${day}</span><span class="headline">${story.title}</span><span class="tag">${story.category}</span></button>`
      : `<div class="day"><span class="number">${day}</span></div>`;
    calendar.insertAdjacentHTML("beforeend", article);
  }
  calendar.querySelectorAll(".featured").forEach(button => button.addEventListener("click", () => renderStory(button.dataset.date)));
}

document.querySelector("#previous-month").addEventListener("click", () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1); renderCalendar(); });
document.querySelector("#next-month").addEventListener("click", () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1); renderCalendar(); });
renderCalendar();
renderStory(selectedDate);