const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const predictBtn = document.getElementById("predictBtn");
const statusMessage = document.getElementById("statusMessage");
const resultBox = document.getElementById("resultBox");
const resultText = document.getElementById("resultText");

// paikallisen FastAPI-palvelimen endpoint
const API_URL = "http://127.0.0.1:8000/predict";

let selectedFile = null;

// kuvan valinta ja esikatselu
imageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  selectedFile = file;

  // luodaan esikatselukuva selaimen muistiin
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.style.display = "block";

  // aktivoidaan lähetyspainike ja nollataan vanhat tulokset
  predictBtn.disabled = false;
  resultBox.classList.add("hidden");
  statusMessage.textContent = "";
});

// kuvan lähetys backendille
predictBtn.addEventListener("click", async () => {
  if (!selectedFile) return;

  // luodaan moniosainen lomakedata (multipart/form-data)
  const formData = new FormData();
  formData.append("file", selectedFile);

  // asetetaan lataustila
  predictBtn.disabled = true;
  statusMessage.textContent = "Tunnistetaan kuvaa...";
  resultBox.classList.add("hidden");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Palvelinvirhe: ${response.status}`);
    }

    const data = await response.json();

    // näytetään tulos
    statusMessage.textContent = "";
    resultText.textContent = `${data.tag} (${data.probability} %)`;
    resultBox.classList.remove("hidden");
  } catch (error) {
    statusMessage.textContent =
      "Virhe tunnistuksessa. Varmista, että backend pyörii.";
    console.error("Virhe:", error);
  } finally {
    predictBtn.disabled = false;
  }
});
