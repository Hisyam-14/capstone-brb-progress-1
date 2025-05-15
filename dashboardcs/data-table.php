<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Visualisasi Data Kehutanan - Data Mentah</title>
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
              <a class="nav-link" href="index.php">
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
              <a class="nav-link active" href="data-table.php" aria-current="page">
                <i class="bi bi-table me-1"></i> Data Mentah
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-4 border border-3 rounded shadow-lg ">
      <div class="container-fluid p-0">
    
        <div class="container-fluid px-4 py-3">
          <div class="row mb-4">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-body">
                  <h5 class="card-title"><i class="bi bi-table me-2"></i>Data Mentah Kehutanan</h5>
                  <p class="mb-0">Tampilan data lengkap dari dataset kehutanan dalam bentuk tabel.</p>
                  <div id="fileStatus" class="alert alert-info mt-2">
                    Mengambil data dari database...
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <div class="row mt-2">
            <div class="col-12">
              <div class="card shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 class="card-title mb-0">Data Mentah</h5>
                </div>
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table table-striped table-hover" id="dataTable">
                      <thead>
                        <tr id="tableHeader">
                        </tr>
                      </thead>
                      <tbody id="tableBody">
                      </tbody>
                    </table>
                  </div>
                  <div id="tablePagination" class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <span id="tableInfo">Menampilkan 0 dari 0 data</span>
                    </div>
                    <nav>
                      <ul class="pagination pagination-sm" id="paginationControls">
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="toast-container position-fixed bottom-0 end-0 p-3"></div>

  <!-- Bootstrap Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Custom JS -->
  <script src="script.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Set active page in navbar
      setActivePage('data-table.php');
      
      document.getElementById("tableSearch").addEventListener("input", function() {
        currentPage = 1;
        filterTable();
      });
      
      // Set up export button
      document.getElementById("exportBtn").addEventListener("click", exportTableToCSV);
    });
  </script>
  <?php include '../assets/footer.php'; ?>
</body>
</html>
