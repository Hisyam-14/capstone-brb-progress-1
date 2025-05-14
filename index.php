<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dinas Kehutanan</title>
    <link rel="stylesheet" href="assets/style/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4Q6Gf2aSP4eDXB8Miphtr37CMZZQ5oXLH2yaXMJ2w8e2ZtHTl7GptT4jmndRuHDT" crossorigin="anonymous">
    <link rel="stylesheet" href="dashboardcs/styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>

<body>
    <?php include 'assets/nav.php'; ?>
    <main>
        <div id="Autoplaying" class="carousel slide shadow-sm rounded" data-bs-ride="carousel" data-bs-interval="3000">
            <div class="carousel-inner rounded shadow-sm">
                <div class="carousel-item active">
                    <img src="assets/img/slide1.jpg" class="d-block w-100 carousel-img rounded" alt="Slide 1">
                </div>
                <div class="carousel-item">
                    <img src="assets/img/slide2.jpg" class="d-block w-100 carousel-img rounded" alt="Slide 2">
                </div>
                <div class="carousel-item">
                    <img src="assets/img/slide3.jpg" class="d-block w-100 carousel-img rounded" alt="Slide 3">
                </div>
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#Autoplaying" data-bs-slide="prev">
                <span class="carousel-control-prev-icon rounded-circle bg-dark bg-opacity-50" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#Autoplaying" data-bs-slide="next">
                <span class="carousel-control-next-icon rounded-circle bg-dark bg-opacity-50" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        <section>
            <div class="container mt-4">
                <div class="row align-items-center" style="min-height: 400px;">
                    <div class="col-md-6 d-flex justify-content-center align-items-center">
                        <img src="assets/img/logo.png" alt="" class="img-tentang">
                    </div>
                    <div class="col-md-6 d-flex justify-content-center align-items-center">
                        <div>
                            <h2 class="display-6 fw-bold"><b>Tentang</b></h2>
                            <p style="text-align: justify;">Dinas Kehutanan Provinsi Kalimantan Timur merupakan lembaga pemerintah yang bertugas mengelola hutan secara berkelanjutan. Berdiri sejak 1964, lembaga ini terus berkembang, dan kini mengacu pada Peraturan Gubernur Kaltim Nomor 43 Tahun 2023.</p>
                            <p style="text-align: justify;">Fungsi utama Dinas Kehutanan meliputi kebijakan teknis, perlindungan dan konservasi sumber daya alam, pengelolaan daerah aliran sungai (DAS), rehabilitasi hutan, serta penyuluhan dan pemberdayaan masyarakat.</p>
                            <p style="text-align: justify;">Dinas ini membawahi beberapa Unit Pelaksana Teknis Daerah (UPTD) seperti KPHP Berau Barat, KPHP Bengalon, KPHP Santan, dan KPHL Balikpapan, serta Taman Hutan Raya Bukit Soeharto. Komitmen utama Dinas Kehutanan adalah menjaga kelestarian hutan Kalimantan Timur untuk generasi mendatang.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section>
            <div class="container mt-4">
                <div class="row align-items-center" style="min-height: 400px;">
                    <div class="col-md-6 d-flex justify-content-center align-items-center">
                        <div>
                            <h2 class="display-6 fw-bold">Dashboard</h2>
                            <p style="text-align: justify;">Dashboard untuk visualisasi data yang informatif dan mudah dipahami oleh pengguna. Tampilan dashboard interaktif dibuat agar informasi ditunjukkan dengan cara yang mudah dipahami dan mudah diakses oleh pengguna. Ini memungkinkan pengguna melihat tren kinerja secara visual. Oleh karena itu, dashboard ini berfungsi sebagai alat bantu untuk memantau dan membuat keputusan tentang kebijakan kehutanan yang berkelanjutan.</p>
                            <a class="btn btn-primary" href="/dashboardcs/index.php" role="button">Selengkapnya</a>
                        </div>
                    </div>
                    <div class="col-md-6 d-flex justify-content-center align-items-center">
                        <img src="assets/img/dashboard.png" alt="" class="img-tentang">
                    </div>
                </div>
            </div>
        </section>
        <section>
            <div class="container mt-4">
                <div class="row align-items-center" style="min-height: 400px;">
                    <div class="col-md-6 d-flex justify-content-center align-items-center">
                        <img src="assets/img/FastAPI.svg" alt="" class="img-tentang">
                    </div>
                    <div class="col-md-6 d-flex justify-content-center align-items-center">
                        <div>
                            <h2 class="display-6 fw-bold">FastAPI</h2>
                            <p style="text-align: justify;">FastAPI untuk menyediakan akses prediktif secara terprogram. API ini digunakan untuk memprediksi Kategori Capaian Realisasi RKT PBPH berdasarkan fitur-fitur input yang diberikan.</p>
                            <a class="btn btn-primary" href="/webapi/index.php" role="button">Selengkapnya</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <?php include 'assets/footer.php'; ?>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.min.js" integrity="sha384-RuyvpeZCxMJCqVUGFI0Do1mQrods/hhxYlcVfGPOfQtPJh0JCw12tUAZ/Mv10S7D" crossorigin="anonymous"></script>
</body>

</html>