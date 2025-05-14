<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Visualisasi Data Kehutanan - Ikhtisar</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
  <!-- PapaParse for CSV parsing -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
  <!-- Custom CSS -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <?php include '../assets/nav.php'; ?>
  <section>
    <!-- Top Navigation Bar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-forest">
      <div class="container-fluid">
        <a class="navbar-brand" href="index.php">
          <i class="bi bi-tree-fill me-2"></i>
          Dashboard Kehutanan
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link active" href="index.php" aria-current="page">
                <i class="bi bi-house-door me-1"></i> Ikhtisar
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="yearly-trends.php">
                <i class="bi bi-graph-up me-1"></i> Tren Tahunan
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="comparisons.php">
                <i class="bi bi-bar-chart me-1"></i> Perbandingan
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="data-table.php">
                <i class="bi bi-table me-1"></i> Data Mentah
              </a>
            </li>
          </ul>
          <div class="d-flex">
            <div class="dropdown">
              <button class="btn btn-outline-light dropdown-toggle" type="button" id="filterDropdown" data-bs-toggle="dropdown">
                <i class="bi bi-funnel me-1"></i> Filter
              </button>
              <div class="dropdown-menu dropdown-menu-end p-3" style="width: 250px;">
                <h6 class="dropdown-header">Filter Data</h6>
                <div class="mb-3">
                  <label for="yearFilter" class="form-label">Tahun</label>
                  <select id="yearFilter" class="form-select form-select-sm">
                    <option value="all">Semua Tahun</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="forestTypeFilter" class="form-label">Jenis Hutan</label>
                  <select id="forestTypeFilter" class="form-select form-select-sm">
                    <option value="all">Semua Jenis</option>
                    <option value="0">Hutan Alam</option>
                    <option value="1">Hutan Tanaman</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="achievementFilter" class="form-label">Kategori Capaian</label>
                  <select id="achievementFilter" class="form-select form-select-sm">
                    <option value="all">Semua Kategori</option>
                    <option value="0">Tidak Ada Realisasi</option>
                    <option value="1">1-50%</option>
                    <option value="2">51-100%</option>
                    <option value="3">>100%</option>
                  </select>
                </div>
                <div class="d-grid">
                  <button id="applyFilters" class="btn btn-sm btn-success">Terapkan Filter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="container mt-4 border border-3 rounded shadow-lg ">
      <div class="container-fluid p-0">
    
        <!-- Main Content Area -->
        <div class="container-fluid px-4 py-3">
          <div class="row mb-4">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5 class="card-title"><i class="bi bi-info-circle me-2"></i>Informasi Dataset</h5>
                  <p class="mb-0">Dataset ini berisi data kehutanan Provinsi Kalimantan Timur yang mencakup informasi tentang realisasi produksi kehutanan.</p>
                  <div id="fileStatus" class="alert alert-info mt-2">
                    Mengambil data dari database...
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <div class="row mt-2">
            <div class="col-md-3 mb-4">
              <div class="card h-100 shadow-sm card-hover">
                <div class="card-body">
                  <h5 class="card-title text-muted">Total Data</h5>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-database-fill text-forest fs-1 me-3"></i>
                    <h2 class="display-6 fw-bold mb-0" id="totalData">-</h2>
                  </div>
                  <p class="text-muted mt-2">Jumlah catatan dalam dataset</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card h-100 shadow-sm card-hover">
                <div class="card-body">
                  <h5 class="card-title text-muted">Tahun</h5>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-calendar-range text-forest fs-1 me-3"></i>
                    <h2 class="display-6 fw-bold mb-0" id="totalYears">-</h2>
                  </div>
                  <p class="text-muted mt-2">Periode tahun dalam dataset</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card h-100 shadow-sm card-hover">
                <div class="card-body">
                  <h5 class="card-title text-muted">Rata-rata Rasio Realisasi</h5>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-percent text-forest fs-1 me-3"></i>
                    <h2 class="display-6 fw-bold mb-0" id="avgRatio">-</h2>
                  </div>
                  <p class="text-muted mt-2">Rata-rata rasio realisasi terhadap target</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 mb-4">
              <div class="card h-100 shadow-sm card-hover">
                <div class="card-body">
                  <h5 class="card-title text-muted">Rata-rata Luas PBPH</h5>
                  <div class="d-flex align-items-center">
                    <i class="bi bi-rulers text-forest fs-1 me-3"></i>
                    <h2 class="display-6 fw-bold mb-0" id="avgArea">-</h2>
                  </div>
                  <p class="text-muted mt-2">Rata-rata luas area PBPH (Ha)</p>
                </div>
              </div>
            </div>
          </div>
    
          <div class="row mt-2">
            <div class="col-md-6 mb-4">
              <div class="card shadow-sm h-100 card-hover">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">Distribusi Kategori Capaian</h5>
                </div>
                <div class="card-body">
                  <canvas id="achievementChart" height="250"></canvas>
                </div>
              </div>
            </div>
            <div class="col-md-6 mb-4">
              <div class="card shadow-sm h-100 card-hover">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">Distribusi Jenis Hutan</h5>
                </div>
                <div class="card-body">
                  <canvas id="forestTypeChart" height="250"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Toast Container for Notifications -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3"></div>

  <!-- Bootstrap Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Custom JS -->
  <script src="script.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Set active page in navbar
      setActivePage('index.php');
    });
  </script>
  <?php include '../assets/footer.php'; ?>
</body>
</html>
