"use strict";

const STORAGE_KEY = "tech-with-tam.pmp-renewal-tracker.v1";
const PDU_FIELDS = ["waysOfWorking", "powerSkills", "businessAcumen"];
const REQUIREMENTS = [
  ["Total PDUs", 60],
  ["Education PDUs", 35],
  ["Ways of Working", 8],
  ["Power Skills", 8],
  ["Business Acumen", 8],
  ["Giving Back", 25],
];
const STATUS_LABELS = {
  planned: "Planned",
  completed: "Awaiting PMI",
  posted: "Posted",
};
const EMPTY_STATE = { format: "pmp-tracker-backup-v1", cycle: null, activities: [] };
const byId = (id) => document.getElementById(id);
const cyclePanel = byId("cycle-panel");
const cycleForm = byId("cycle-form");
const activityDialog = byId("activity-dialog");
const activityForm = byId("activity-form");
const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeZone: "UTC" });

let state = EMPTY_STATE;
let savedValue = null;
let editingId = null;
let noticeTimer;

function showMessage(id, text = "") {
  const message = byId(id);
  message.textContent = text;
  message.hidden = !text;
}

function notify(text) {
  clearTimeout(noticeTimer);
  showMessage("action-error");
  showMessage("notice", text);
  noticeTimer = setTimeout(() => showMessage("notice"), 5000);
}

function showActionError(error) {
  showMessage("notice");
  showMessage("action-error", error.message);
}

function localDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatDate(value) {
  return dateFormat.format(new Date(value));
}

function readDate(value, label, optional = false) {
  if (optional && (value === "" || value === undefined)) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && value >= "0001-01-01") {
      return value;
    }
  }
  throw new Error(`Enter a valid ${label}.`);
}

function credit(value, limit = 999) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > limit) {
    throw new Error(`Enter PDU amounts between 0 and ${limit}.`);
  }
  if (Math.abs(value * 100 - Math.round(value * 100)) > 1e-8) {
    throw new Error("Use at most two decimal places for PDU amounts.");
  }
  return value;
}

function readCredits(data) {
  return Object.fromEntries(PDU_FIELDS.map((field) => [field, credit(data[field])]));
}

function asHundredths(value) {
  return Math.round(value * 100);
}

function educationTotal(record) {
  return PDU_FIELDS.reduce((sum, field) => sum + asHundredths(record[field]), 0);
}

function readText(value, label, limit, required = false) {
  if (value === undefined && !required) return "";
  if (typeof value === "string" && value.length <= limit && (!required || value.trim())) {
    return value.trim();
  }
  throw new Error(`Enter valid text for ${label}, up to ${limit} characters.`);
}

function readUrl(value) {
  const text = readText(value, "the source link", 2000);
  if (!text) return "";
  let url;
  try {
    url = new URL(text);
  } catch {
    throw new Error("Enter a complete source link starting with https:// or http://.");
  }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("Use a public web link for the source.");
  }
  return url.href;
}

function readCycle(data) {
  if (!data || typeof data !== "object") throw new Error("The renewal cycle is missing.");
  const start = readDate(data.start, "cycle start date");
  const end = readDate(data.end, "renewal date");
  if (start >= end) throw new Error("The renewal date must be after the cycle start.");
  return { start, end, ...readCredits(data), givingBack: credit(data.givingBack, 25) };
}

function readActivity(data, cycle, id, watchlistOnly = false) {
  if (!data || typeof data !== "object") throw new Error("The activity is missing.");
  const title = readText(data.title, "the activity title", 300, true);
  const url = readUrl(data.url);
  if (watchlistOnly && !url) throw new Error("Include a source link for each imported webinar.");
  const credits = readCredits(data);
  if (!educationTotal(credits)) throw new Error("Enter at least one positive Education PDU amount.");

  const plannedDate = readDate(data.plannedDate, "planned date", true);
  const completedDate = watchlistOnly ? "" : readDate(data.completedDate, "completed date", true);
  const postedDate = watchlistOnly ? "" : readDate(data.postedDate, "posted date", true);
  if ([plannedDate, completedDate].some((date) => date && (date < cycle.start || date > cycle.end))) {
    throw new Error("The planned and completed dates must fall within your renewal cycle.");
  }
  if (completedDate > localDate() || postedDate > localDate()) {
    throw new Error("Use today or an earlier date for completion and posting.");
  }
  if (postedDate && (!completedDate || postedDate < completedDate)) {
    throw new Error("Record the completed date before entering a posted date. Posting must be on or after completion.");
  }

  return {
    id,
    title,
    url,
    ...credits,
    plannedDate,
    completedDate,
    postedDate,
    application: readText(data.application, "how you'll use the activity", 500),
    notes: watchlistOnly ? "" : readText(data.notes, "notes", 5000),
  };
}

function readBackup(data) {
  if (data?.format !== EMPTY_STATE.format || !Array.isArray(data.activities)) {
    throw new Error("Choose a backup downloaded from this tracker.");
  }
  const cycle = data.cycle === null ? null : readCycle(data.cycle);
  if (!cycle && data.activities.length) throw new Error("This backup has activities without a renewal cycle.");
  const usedIds = new Set();
  const activities = data.activities.map((activity) => {
    const id = activity?.id;
    if (!Number.isSafeInteger(id) || id < 1 || id >= Number.MAX_SAFE_INTEGER || usedIds.has(id)) {
      throw new Error("This backup has an invalid or repeated activity ID.");
    }
    usedIds.add(id);
    return readActivity(activity, cycle, id);
  });
  return { ...EMPTY_STATE, cycle, activities };
}

function readStoredValue() {
  return localStorage.getItem(STORAGE_KEY);
}

function save(nextState) {
  let currentValue;
  try {
    currentValue = readStoredValue();
  } catch {
    throw new Error("This browser blocked storage. Open the tracker in a browser that allows local storage.");
  }
  if (currentValue !== savedValue) {
    throw new Error("Your tracker changed in another tab. Reload this tab before saving.");
  }
  const nextValue = JSON.stringify(nextState);
  try {
    localStorage.setItem(STORAGE_KEY, nextValue);
  } catch {
    throw new Error("The browser couldn't save your changes. Your previous records are still in the tracker.");
  }
  savedValue = nextValue;
  state = nextState;
  showMessage("storage-error");
  render();
}

function nextActivityId() {
  return state.activities.reduce((largest, activity) => Math.max(largest, activity.id), 0) + 1;
}

function fieldValues(form) {
  const data = Object.fromEntries(new FormData(form));
  for (const name of [...PDU_FIELDS, "givingBack"]) {
    if (form.elements.namedItem(name)) data[name] = form.elements.namedItem(name).valueAsNumber;
  }
  return data;
}

function loadFields(form, values) {
  form.reset();
  for (const [key, value] of Object.entries(values ?? {})) {
    const field = form.elements.namedItem(key);
    if (field) field.value = value;
  }
}

function statusOf(activity) {
  if (activity.postedDate) return "posted";
  if (activity.completedDate) return "completed";
  return "planned";
}

function pduText(amount) {
  return numberFormat.format(amount / 100);
}

function creditLabel(amount) {
  return `${pduText(amount)} ${amount === 100 ? "PDU" : "PDUs"}`;
}

function renderProgress() {
  const { cycle, activities } = state;
  byId("progress").hidden = !cycle;
  if (!cycle) return;

  const posted = Object.fromEntries(PDU_FIELDS.map((field) => [field, asHundredths(cycle[field])]));
  let pending = 0;
  for (const activity of activities) {
    if (activity.postedDate) {
      for (const field of PDU_FIELDS) posted[field] += asHundredths(activity[field]);
    } else if (activity.completedDate) {
      pending += educationTotal(activity);
    }
  }

  const education = Object.values(posted).reduce((sum, amount) => sum + amount, 0);
  const givingBack = asHundredths(cycle.givingBack);
  const amounts = [education + givingBack, education, ...PDU_FIELDS.map((field) => posted[field]), givingBack];
  const rows = REQUIREMENTS.map(([label, target], index) => {
    const row = document.createElement("tr");
    const heading = document.createElement("th");
    heading.scope = "row";
    heading.textContent = label;
    row.append(heading);
    const optional = label === "Giving Back";
    const targetText = optional ? `Up to ${target}` : target;
    const gap = optional ? "Optional" : pduText(Math.max(0, target * 100 - amounts[index]));
    for (const value of [pduText(amounts[index]), targetText, gap]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    return row;
  });
  byId("progress-rows").replaceChildren(...rows);
  showMessage("progress-note", pending
    ? `You have ${creditLabel(pending)} awaiting confirmation in CCRS.`
    : "");
}

function renderActivities() {
  const filter = byId("status-filter").value;
  const activities = state.activities.filter((activity) => filter === "all" || statusOf(activity) === filter);
  byId("watchlist-controls").hidden = !state.activities.length;
  showMessage("empty-watchlist", activities.length || !state.cycle ? "" : state.activities.length
    ? "No activities match this status."
    : "Your watchlist is empty.");
  const template = byId("activity-template");
  const cards = activities.map((activity) => {
    const status = statusOf(activity);
    const card = template.content.cloneNode(true);
    card.querySelector("h3").textContent = activity.title;
    const meta = [`${creditLabel(educationTotal(activity))}.`];
    if (activity.plannedDate) meta.push(`Planned for ${formatDate(activity.plannedDate)}.`);
    if (activity.completedDate) meta.push(`Completed ${formatDate(activity.completedDate)}.`);
    if (activity.postedDate) meta.push(`Posted ${formatDate(activity.postedDate)}.`);
    card.querySelector(".activity-meta").textContent = meta.join(" ");
    const application = card.querySelector(".application");
    application.hidden = !activity.application;
    application.textContent = activity.application;
    const sourceLink = card.querySelector(".source-link");
    if (activity.url) {
      sourceLink.href = activity.url;
      sourceLink.hidden = false;
      sourceLink.setAttribute("aria-label", `Open source for ${activity.title}`);
    }
    const badge = card.querySelector(".activity-status");
    badge.dataset.status = status;
    badge.textContent = STATUS_LABELS[status];
    const editButton = card.querySelector("button");
    editButton.dataset.activityId = activity.id;
    editButton.setAttribute("aria-label", `Edit ${activity.title}`);
    return card;
  });
  byId("activities").replaceChildren(...cards);
}

function render() {
  const { cycle } = state;
  for (const id of ["add-activity", "import-plan", "download-backup", "new-cycle"]) {
    byId(id).disabled = !cycle;
  }
  byId("cycle-range").textContent = cycle ? `${formatDate(cycle.start)} to ${formatDate(cycle.end)}` : "";
  byId("watchlist-help").textContent = cycle
    ? "Import a JSON watchlist from your AI assistant. The tracker keeps progress for activities you've already added."
    : "Save your renewal dates to start adding activities.";
  renderProgress();
  renderActivities();
}

function editActivity(activity) {
  editingId = activity?.id ?? null;
  byId("activity-heading").textContent = editingId ? "Edit activity" : "Add activity";
  byId("remove-activity").hidden = editingId === null;
  showMessage("activity-error");
  loadFields(activityForm, activity);
  for (const name of ["plannedDate", "completedDate"]) {
    const field = activityForm.elements.namedItem(name);
    field.min = state.cycle.start;
    field.max = name === "completedDate" && localDate() < state.cycle.end ? localDate() : state.cycle.end;
  }
  activityForm.elements.namedItem("postedDate").max = localDate();
  activityDialog.showModal();
}

function closeActivity() {
  activityDialog.close();
  const edit = byId("activities").querySelector(`[data-activity-id="${editingId}"]`);
  (edit ?? byId("add-activity")).focus();
}

function sameActivity(first, second) {
  if (first.url && second.url) return first.url === second.url;
  return first.title.toLowerCase() === second.title.toLowerCase();
}

function importWatchlist(data) {
  if (data?.format !== "pmp-watchlist-v1" || !Array.isArray(data.activities) || !data.activities.length) {
    throw new Error("Choose a JSON watchlist made with the PMP renewal tracker instructions.");
  }
  const activities = [...state.activities];
  let id = nextActivityId();
  let added = 0;
  for (const [index, entry] of data.activities.entries()) {
    try {
      const activity = readActivity(entry, state.cycle, id, true);
      if (activities.some((existing) => sameActivity(existing, activity))) continue;
      activities.push(activity);
      id += 1;
      added += 1;
    } catch (error) {
      throw new Error(`Watchlist entry ${index + 1}: ${error.message}`);
    }
  }
  if (added) {
    byId("status-filter").value = "all";
    save({ ...state, activities });
  }
  const skipped = data.activities.length - added;
  notify(`Imported ${added} ${added === 1 ? "activity" : "activities"}.${skipped ? ` Skipped ${skipped} ${skipped === 1 ? "duplicate" : "duplicates"}.` : ""}`);
}

function chooseJson(buttonId, inputId, handle) {
  const input = byId(inputId);
  byId(buttonId).addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    const file = input.files[0];
    input.value = "";
    if (!file) return;
    try {
      if (file.size > 5_000_000) throw new Error("Choose a JSON file smaller than 5 MB.");
      const text = await file.text();
      let data;
      try {
        data = JSON.parse(text.replace(/^\uFEFF/, ""));
      } catch {
        throw new Error("This file isn't valid JSON. Check the file and try again.");
      }
      handle(data);
    } catch (error) {
      showActionError(error);
    }
  });
}

cycleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showMessage("cycle-error");
  try {
    const cycle = readCycle(fieldValues(cycleForm));
    for (const activity of state.activities) readActivity(activity, cycle, activity.id);
    save({ ...state, cycle });
    cyclePanel.open = false;
    cyclePanel.querySelector("summary").focus();
    notify("Renewal cycle saved.");
  } catch (error) {
    showMessage("cycle-error", error.message);
  }
});

activityForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showMessage("activity-error");
  try {
    const activity = readActivity(fieldValues(activityForm), state.cycle, editingId ?? nextActivityId());
    if (state.activities.some((existing) => existing.id !== editingId && sameActivity(existing, activity))) {
      throw new Error("This activity is already in your watchlist.");
    }
    const activities = editingId === null
      ? [...state.activities, activity]
      : state.activities.map((existing) => existing.id === editingId ? activity : existing);
    save({ ...state, activities });
    closeActivity();
    notify("Activity saved.");
  } catch (error) {
    showMessage("activity-error", error.message);
  }
});

byId("add-activity").addEventListener("click", () => editActivity());
byId("cancel-activity").addEventListener("click", closeActivity);
byId("remove-activity").addEventListener("click", () => {
  if (!window.confirm("Remove this activity from the watchlist and your renewal totals?")) return;
  try {
    save({ ...state, activities: state.activities.filter((activity) => activity.id !== editingId) });
    closeActivity();
    notify("Activity removed.");
  } catch (error) {
    showMessage("activity-error", error.message);
  }
});
byId("activities").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-activity-id]");
  if (button) editActivity(state.activities.find((activity) => activity.id === Number(button.dataset.activityId)));
});
byId("status-filter").addEventListener("change", renderActivities);

byId("download-backup").addEventListener("click", () => {
  const file = new Blob([JSON.stringify(state, null, 2) + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pmp-tracker-backup-${state.cycle.end}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify("Backup downloaded.");
});

chooseJson("import-plan", "watchlist-file", importWatchlist);
chooseJson("restore-backup", "backup-file", (data) => {
  const backup = readBackup(data);
  if (state.cycle && !window.confirm("Replace the current dates, balances, and activities with the backup?")) return;
  save(backup);
  byId("status-filter").value = "all";
  loadFields(cycleForm, state.cycle);
  cyclePanel.open = !state.cycle;
  renderActivities();
  notify("Backup restored.");
});
byId("new-cycle").addEventListener("click", () => {
  if (!window.confirm("Clear the current dates, balances, and activities? Download a backup first if you want to keep them.")) return;
  try {
    save(EMPTY_STATE);
    byId("status-filter").value = "all";
    loadFields(cycleForm);
    cyclePanel.open = true;
    cycleForm.elements.namedItem("start").focus();
    notify("Enter the dates and posted credits for your new cycle.");
  } catch (error) {
    showActionError(error);
  }
});

try {
  savedValue = readStoredValue();
  if (savedValue !== null) state = readBackup(JSON.parse(savedValue));
} catch {
  showMessage("storage-error", "The tracker couldn't read its saved records. Restore a backup if you have one.");
}
loadFields(cycleForm, state.cycle);
cyclePanel.open = !state.cycle;
render();
