// -------- Hent elementer fra HTML --------
const form = document.querySelector("#form");
const steps = document.querySelectorAll(".step");
const nextBtn = document.querySelector("#next");
const backBtn = document.querySelector("#back");
const actions = document.querySelector("#actions");
const progress = document.querySelector("#progress");
const letter = document.querySelector("#letter");
const count = document.querySelector("#count");
const summary = document.querySelector("#summary");


// -------- Variabler --------
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
let currentStep = 0;

// -------- til næste step --------
for (let i = 0; i < steps.length; i++) {
  const li = document.createElement("li");
  li.textContent = steps[i].dataset.title;
  progress.appendChild(li);
}
function showStep(index) {
  currentStep = index;

  // viser kun det aktive step
  for (let i = 0; i < steps.length; i++) {
    if (i === index) {
      steps[i].classList.add("active");
    } else {
      steps[i].classList.remove("active");
    }
  }
  // tjekker næste step 
  const items = progress.children;
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("done", "current");
    if (i < index) {
      items[i].classList.add("done");
    } else if (i === index) {
      items[i].classList.add("current");
    }
  }


  // Skjul Tilbage på første trin
  if (index === 0) {
    backBtn.style.visibility = "hidden";
  } else {
    backBtn.style.visibility = "visible";
  }


  // laver knappen om til sidst 
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



// -------- fejlbesked --------
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







// -------- Valider --------
function validateStep(index) {
  const fields = steps[index].querySelectorAll("input, textarea");
  let isValid = true;
  let firstInvalid = null;

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const message = getErrorMessage(field);

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

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return isValid;
}



// -------- oversigten --------
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

  summary.innerHTML = "";

  for (let i = 0; i < rows.length; i++) {
    const dt = document.createElement("dt");
    dt.textContent = rows[i].label;

    const dd = document.createElement("dd");
    dd.textContent = rows[i].value;

    summary.appendChild(dt);
    summary.appendChild(dd);
  }
}



// -------- Send ansøgningen --------
function submitForm() {
  nextBtn.disabled = true;
  nextBtn.textContent = "Sender...";

  const data = new FormData(form);
  const cvFile = data.get("cv");

  // Filen kan ikke gemmes direkte som tekst, så vi gemmer kun filens metadata
  const application = {
    name: data.get("name"),
    email: data.get("email"),
    phone: data.get("phone"),
    letter: data.get("letter"),
    cv: cvFile ? { name: cvFile.name, size: cvFile.size, type: cvFile.type } : null,
    submittedAt: new Date().toISOString(),
  };

  try {
    const saved = JSON.parse(localStorage.getItem("applications") || "[]");
    saved.push(application);
    localStorage.setItem("applications", JSON.stringify(saved));

    // Behold lidt "sender"-følelse, så brugeren når at se feedback
    setTimeout(function () {
      nextBtn.disabled = false;
      showStep(3);
    }, 600);
  } catch (error) {
    console.error("Kunne ikke gemme ansøgningen:", error);
    nextBtn.disabled = false;
    nextBtn.textContent = "Send ansøgning";
    alert("Noget gik galt, og ansøgningen blev ikke gemt.");
  }
}






nextBtn.addEventListener("click", function () {
  if (currentStep < 2) {
    if (validateStep(currentStep)) {
      showStep(currentStep + 1);
    }
  } else {
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

const applications = JSON.parse(localStorage.getItem("applications") || "[]");
console.log(applications);

// -------- Start på første step --------
showStep(0);