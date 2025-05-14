<!DOCTYPE html>
<html lang="en">

<!-- bagian head -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Form Prediksi Capaian RKT PBPH</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&amp;display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
  <link rel="stylesheet" href="../dashboardcs/styles.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<!-- bagian head selesai -->

<!-- bagian body -->
<body>
  <?php include '../assets/nav.php'; ?>

  <section>
    <div class="container-api container mt-4 p-4 bg-white rounded shadow-lg border border-3">
      <h2 class="fs-3 fw-bold">Prediksi Capaian RKT PBPH</h2>
      <form id="predictForm" novalidate>
        <fieldset>
          <legend>Data Tahun dan Target</legend>

          <label for="Tahun" title="Tahun data." class="form-label">Tahun:</label>
          <select name="Tahun" id="Tahun" class="form-select mb-3" required>
            <option value="" disabled selected>-- Pilih Tahun --</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>

          <fieldset class="mb-3">
            <legend>Jenis Hutan:</legend>
            <div class="form-check">
              <input type="radio" name="Jenis_Hutan" value="0" id="hutanAlam" class="form-check-input" required />
              <label for="hutanAlam" class="form-check-label">Hutan Alam</label>
            </div>
            <div class="form-check">
              <input type="radio" name="Jenis_Hutan" value="1" id="hutanTanaman" class="form-check-input" />
              <label for="hutanTanaman" class="form-check-label">Hutan Tanaman</label>
            </div>
          </fieldset>

          <label for="Luas_PBPH" title="Luas PBPH yang dicapai." class="form-label">Luas PBPH:</label>
          <input
            type="number"
            step="any"
            name="Luas_PBPH"
            id="Luas_PBPH"
            class="form-control mb-3"
            placeholder="Masukkan Luas PBPH"
            required
          />

          <label for="Target_Murni_Luas" title="Target luas murni area." class="form-label">Target Murni Luas:</label>
          <input
            type="number"
            step="any"
            name="Target_Murni_Luas"
            id="Target_Murni_Luas"
            class="form-control mb-3"
            placeholder="Masukkan Target Murni Luas"
            required
          />

          <label for="Target_Murni_Volume" title="Target volume murni." class="form-label">Target Murni Volume:</label>
          <input
            type="number"
            step="any"
            name="Target_Murni_Volume"
            id="Target_Murni_Volume"
            class="form-control mb-3"
            placeholder="Masukkan Target Murni Volume"
            required
          />

          <label for="Target_Carry_Luas" title="Target luas carry area." class="form-label">Target Carry Luas:</label>
          <input
            type="number"
            step="any"
            name="Target_Carry_Luas"
            id="Target_Carry_Luas"
            class="form-control mb-3"
            placeholder="Masukkan Target Carry Luas"
            required
          />

          <label for="Target_Carry_Volume" title="Target volume carry." class="form-label">Target Carry Volume:</label>
          <input
            type="number"
            step="any"
            name="Target_Carry_Volume"
            id="Target_Carry_Volume"
            class="form-control mb-3"
            placeholder="Masukkan Target Carry Volume"
            required
          />

          <label for="Target_Jumlah_Luas" title="Target jumlah luas area." class="form-label">Target Jumlah Luas:</label>
          <input
            type="number"
            step="any"
            name="Target_Jumlah_Luas"
            id="Target_Jumlah_Luas"
            class="form-control mb-3"
            placeholder="Masukkan Target Jumlah Luas"
            required
          />

          <label for="Realisasi_Alam" title="Realisasi alam yang dicapai." class="form-label">Realisasi Alam:</label>
          <input
            type="number"
            step="any"
            name="Realisasi_Alam"
            id="Realisasi_Alam"
            class="form-control mb-3"
            placeholder="Masukkan Realisasi Alam"
            required
          />

          <label for="Realisasi_Tanaman" title="Realisasi tanaman yang dicapai." class="form-label">Realisasi Tanaman:</label>
          <input
            type="number"
            step="any"
            name="Realisasi_Tanaman"
            id="Realisasi_Tanaman"
            class="form-control mb-3"
            placeholder="Masukkan Realisasi Tanaman"
            required
          />


          <label for="log_Realisasi_Produksi" title="Logaritma dari realisasi produksi." class="form-label">Log Realisasi Produksi:</label>
          <input
            type="number"
            step="any"
            name="log_Realisasi_Produksi"
            id="log_Realisasi_Produksi"
            class="form-control mb-3"
            placeholder="Masukkan Log Realisasi Produksi"
            required
          />

          <label for="Rasio_Realisasi" title="Rasio realisasi capaian." class="form-label">Rasio Realisasi:</label>
          <input
            type="number"
            step="any"
            name="Rasio_Realisasi"
            id="Rasio_Realisasi"
            class="form-control mb-3"
            placeholder="Masukkan Rasio Realisasi"
            required
          />

          <label for="Skala_PBPH" title="Skala PBPH yang digunakan." class="form-label">Skala PBPH:</label>
          <input
            type="number"
            step="any"
            name="Skala_PBPH"
            id="Skala_PBPH"
            class="form-control mb-3"
            placeholder="Masukkan Skala PBPH"
            required
          />
        </fieldset>

        <div class="d-flex justify-content-center gap-3 mb-4">
          <button type="submit" id="submitBtn" class="btn btn-primary btn-lg px-4">Prediksi</button>
          <button type="reset" id="resetBtn" class="btn btn-secondary btn-lg px-4">Reset</button>
        </div>
      </form>

      <h3 class="mb-3">Hasil:</h3>
      <pre id="result"></pre>
    </div>
  </section>

  <script src="script.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.min.js" integrity="sha384-RuyvpeZCxMJCqVUGFI0Do1mQrods/hhxYlcVfGPOfQtPJh0JCw12tUAZ/Mv10S7D" crossorigin="anonymous"></script>
  <?php include '../assets/footer.php'; ?>
</body>
<!-- bagian body selesai -->

</html>
