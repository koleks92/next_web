// ===== Hent elementer fra HTML =====
const form = document.getElementById("form");
const steps = document.querySelectorAll(".step");
const nextBtn = document.getElementById("next");
const backBtn = document.getElementById("back");
const actions = document.getElementById("actions");
const progress = document.getElementById("progress");
const letter = document.getElementById("letter");
const count = document.getElementById("count");
const summary = document.getElementById("summary");

// ===== Variabler =====
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
let currentStep = 0;

// ===== Lav fremdriftslisten =====
for (let i = 0; i < steps.length; i++) {
  const li = document.createElement("li");
  li.textContent = steps[i].dataset.title;
  progress.appendChild(li);
}

// ===== Vis et bestemt trin =====
function showStep(index) {
  currentStep = index;

  // Vis kun det aktive trin
  for (let i = 0; i < steps.length; i++) {
    if (i === index) {
      steps[i].classList.add("active");
    } else {
      steps[i].classList.remove("active");
    }
  }

  // Opdater fremdriftslisten
  const items = progress.children;
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("done", "current");
    if (i < index) {
      items[i].classList.add("done");
    } else if (i === index) {
      items[i].classList.add("current");
    }
  }

  // Skjul "Tilbage" på første trin
  if (index === 0) {
    backBtn.style.visibility = "hidden";
  } else {
    backBtn.style.visibility = "visible";
  }

  // Ændr tekst på knappen på trin 3
  if (index === 2) {
    nextBtn.textContent = "Send ansøgning";
    buildSummary();
  } else {
    nextBtn.textContent = "Næste";
  }

  // Skjul knapperne på takkesiden
  actions.hidden = index === 3;

  window.scrollTo({ top: 0 });
}

// ===== Find fejlbesked til et felt =====
function getErrorMessage(field) {
  const value = field.value.trim();

  // Fil-felt
  if (field.type === "file") {
    const file = field.files[0];
    if (!file) {
      return "Vælg en fil.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Filen er for stor (maks. 5 MB).";
    }
    return "";
  }

  // Tomme felter
  if (field.required && value === "") {
    return "Feltet skal udfyldes.";
  }

  // E-mail og telefon
  if (field.type === "email" && !field.checkValidity()) {
    return "Skriv en gyldig e-mailadresse.";
  }
  if (field.type === "tel" && !field.checkValidity()) {
    return "Skriv et gyldigt telefonnummer.";
  }

  // Ansøgningstekst
  if (field.id === "letter" && value.length < 50) {
    return "Skriv mindst 50 tegn.";
  }

  return ""; // ingen fejl
}

// ===== Valider alle felter i et trin =====
function validateStep(index) {
  const fields = steps[index].querySelectorAll("input, textarea");
  let isValid = true;
  let firstInvalid = null;

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const message = getErrorMessage(field);

    // Find fejl-paragraffen efter feltet
    let errorElement = field.nextElementSibling;
    while (errorElement && !errorElement.classList.contains("error")) {
      errorElement = errorElement.nextElementSibling;
    }
    if (errorElement) {
      errorElement.textContent = message;
    }

    if (message !== "") {
      field.classList.add("invalid");
      isValid = false;
      if (firstInvalid === null) {
        firstInvalid = field;
      }
    } else {
      field.classList.remove("invalid");
    }
  }

  // Sæt fokus på første felt med fejl
  if (firstInvalid) {
    firstInvalid.focus();
  }

  return isValid;
}

// ===== Byg oversigten på trin 3 =====
function buildSummary() {
  const data = new FormData(form);
  const cvFile = data.get("cv");

  const rows = [
    { label: "Navn", value: data.get("name") },
    { label: "E-mail", value: data.get("email") },
    { label: "Telefon", value: data.get("phone") },
    { label: "CV", value: cvFile ? cvFile.name : "" },
    { label: "Ansøgningstekst", value: data.get("letter") },
  ];

  summary.innerHTML = ""; // ryd gammel oversigt

  for (let i = 0; i < rows.length; i++) {
    const dt = document.createElement("dt");
    dt.textContent = rows[i].label;

    const dd = document.createElement("dd");
    dd.textContent = rows[i].value;

    summary.appendChild(dt);
    summary.appendChild(dd);
  }
}

// ===== Send ansøgningen =====
function submitForm() {
  nextBtn.disabled = true;
  nextBtn.textContent = "Sender...";

  // Her skal der senere være en rigtig fetch til serveren.
  // Lige nu simulerer vi bare, at det tager 0,6 sekunder.
  setTimeout(function () {
    nextBtn.disabled = false;
    showStep(3);
  }, 600);
}

// ===== Event listeners =====
nextBtn.addEventListener("click", function () {
  if (currentStep < 2) {
    // Trin 1 og 2: valider, og gå videre hvis alt er ok
    if (validateStep(currentStep)) {
      showStep(currentStep + 1);
    }
  } else {
    // Trin 3: send ansøgningen
    submitForm();
  }
});

backBtn.addEventListener("click", function () {
  showStep(currentStep - 1);
});

letter.addEventListener("input", function () {
  count.textContent = letter.value.length;
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
});

// ===== Start på første trin =====
showStep(0);