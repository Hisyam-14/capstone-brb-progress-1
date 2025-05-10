// Mendapatkan referensi elemen DOM
const form = document.getElementById("predictForm");
const result = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

/**
 * Menghapus semua pesan error dan style error pada input
 */
function clearErrors() {
  const errorMessages = form.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => msg.remove());
  const inputs = form.querySelectorAll("input[type='number'], input[type='radio']");
  inputs.forEach((input) => {
    input.style.borderColor = "";
    input.removeAttribute("aria-describedby");
  });
}

/**
 * Menampilkan pesan error di bawah input tertentu
 * @param {HTMLElement} input - elemen input yang error
 * @param {string} message - pesan error yang akan ditampilkan
 */
function showError(input, message) {
  if (!input) {
    console.warn("showError called with undefined input:", message);
    return;
  }
  input.style.borderColor = "#c0392b"; // warna merah untuk border error
  const error = document.createElement("div");
  error.className = "error-message";
  error.textContent = message;
  error.id = input.name + "-error";
  input.setAttribute("aria-describedby", error.id);
  if (input.type === "radio") {
    // Menyisipkan pesan error sebagai anak terakhir di dalam fieldset terdekat untuk grup radio button
    const fieldset = input.closest("fieldset");
    if (fieldset) {
      fieldset.appendChild(error);
    } else {
      // fallback jika fieldset tidak ditemukan, sisipkan setelah radio terakhir
      const radios = form.querySelectorAll(`input[name="${input.name}"]`);
      radios[radios.length - 1].insertAdjacentElement("afterend", error);
    }
  } else {
    input.insertAdjacentElement("afterend", error);
  }
}

/**
 * Validasi semua input form
 * Menandai input yang tidak valid dan menampilkan pesan error
 * @returns {boolean} true jika form valid, false jika ada error
 */
function validateForm() {
  clearErrors();
  let valid = true;
  let firstInvalidInput = null;

  // Validasi input tipe number
  const numberInputs = form.querySelectorAll("input[type='number']");
  numberInputs.forEach((input) => {
    const labelText = input.previousElementSibling.textContent.replace(":", "");
    if (input.value.trim() === "" || isNaN(input.value)) {
      showError(input, `Mohon isi field ${labelText} dengan benar.`);
      if (!firstInvalidInput) firstInvalidInput = input;
      valid = false;
    }
  });

  // Validasi grup radio button
  const radioGroups = ["Jenis_Hutan"];
  radioGroups.forEach((name) => {
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    if (!checked) {
      const radios = form.querySelectorAll(`input[name="${name}"]`);
      showError(radios[0], `Mohon pilih opsi untuk ${name.replace(/_/g, " ")}.`);
      if (!firstInvalidInput) firstInvalidInput = radios[0];
      valid = false;
    }
  });

  // Menampilkan pesan error umum jika ada error
  if (!valid) {
    result.textContent = "❌ Mohon perbaiki kesalahan pada form.";
    result.classList.add("error");
    result.setAttribute("aria-live", "assertive");
  } else {
    result.textContent = "";
    result.classList.remove("error");
    result.removeAttribute("aria-live");
  }

  return valid;
}

/**
 * Menampilkan atau menyembunyikan loading spinner saat proses prediksi
 * @param {boolean} show - true untuk tampilkan loading, false untuk sembunyikan
 */
function showLoading(show) {
  if (show) {
    result.innerHTML =
      '<div class="spinner" role="status" aria-live="polite" aria-label="Loading"></div>';
    result.classList.remove("error");
    submitBtn.disabled = true;
    resetBtn.disabled = true;
  } else {
    result.innerHTML = "";
    result.classList.remove("error");
    submitBtn.disabled = false;
    resetBtn.disabled = false;
    result.removeAttribute("aria-live");
  }
}

// Menangani submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  // Mengumpulkan data form menjadi objek JSON
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => (data[key] = isNaN(parseFloat(value)) ? value : parseFloat(value)));

  try {
    showLoading(true);
    const response = await fetch(
      "https://fast-api-dinas-kehutanan-provinsi-kalimantan-tim-production.up.railway.app/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    showLoading(false);

    if (!response.ok) throw new Error("Gagal melakukan prediksi.");

    const resultData = await response.json();
    result.textContent = `Kategori: ${resultData.Kategori} (${resultData.Capaian})`;
    result.classList.remove("error");
    result.setAttribute("aria-live", "polite");
  } catch (err) {
    showLoading(false);
    result.textContent = "❌ Terjadi kesalahan: " + err.message;
    result.classList.add("error");
    result.setAttribute("aria-live", "assertive");
  }
});

  
//  supaya ndak otomatis kebawah saat input field (ngeselin bjir)
const inputs = form.querySelectorAll("input[type='number'], input[type='radio']");
inputs.forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  });
  input.addEventListener("input", (e) => {
    e.stopPropagation();
  });
});

// Disable mouse wheel increment/decrement on number inputs
const numberInputs = form.querySelectorAll("input[type='number']");
numberInputs.forEach((input) => {
  input.addEventListener("wheel", (e) => {
    e.preventDefault();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
  });
});

let lastFocusedElement = null;
form.addEventListener("focusin", (e) => {
  if (lastFocusedElement && e.target !== lastFocusedElement) {
    if (!e.relatedTarget || !form.contains(e.relatedTarget)) {
      e.preventDefault();
      lastFocusedElement.focus();
    } else {
      lastFocusedElement = e.target;
    }
  } else {
    lastFocusedElement = e.target;
  }
});

// Menangani reset form
resetBtn.addEventListener("click", () => {
  form.reset();
  clearErrors();
  result.textContent = "";
  result.classList.remove("error");
  submitBtn.disabled = false;
  resetBtn.disabled = false;
  result.removeAttribute("aria-live");
});
