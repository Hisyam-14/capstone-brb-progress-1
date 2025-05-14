<footer class="footer mt-5 py-5 bg-forest text-white" style="box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-4 d-flex align-items-center mb-3 mb-md-0">
                <img src="/assets/img/logo.png" alt="Logo" style="height: 80px; margin-right: 15px;">
                <div>
                    <h5>Dinas Kehutanan Provinsi Kalimantan Timur</h5>
                    <p class="mb-0" style="font-size: 0.9rem;">Lembaga pemerintah yang mengelola hutan secara berkelanjutan sejak 1964.</p>
                </div>
            </div>
            <div class="col-md-4">
                <h5>Quick Links</h5>
                <ul class="list-unstyled">
                    <li><a href="/index.php" class="text-white text-decoration-none footer-link"><i class="bi bi-house me-2"></i>Home</a></li>
                    <li><a href="/dashboardcs/index.php" class="text-white text-decoration-none footer-link"><i class="bi bi-speedometer2 me-2"></i>Dashboard</a></li>
                    <li><a href="/webapi/index.php" class="text-white text-decoration-none footer-link"><i class="bi bi-rocket-takeoff me-2"></i>FastAPI</a></li>
                </ul>
            </div>
            <div class="col-md-4">
                <h5>Contact Us</h5>
                <ul class="list-unstyled">
                    <li><i class="bi bi-geo-alt me-2"></i>Jl. Kesuma Bangsa, Sungai Pinang Luar, Kec. Samarinda</li>
                    <li><i class=""></i>Ulu, Kota Samarinda, Kalimantan Timur 75124</li>
                    <li><i class="bi bi-envelope me-2"></i>dishut@kaltimprov.go.id</li>
                </ul>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-12 text-center">
                <hr class="border-light">
                <p class="mb-0">&copy; <?php echo date('Y'); ?> Dinas Kehutanan Provinsi Kalimantan Timur. All Rights Reserved.</p>
            </div>
        </div>
    </div>
</footer>
<style>
.footer-link {
    transition: color 0.3s ease;
    position: relative;
    padding-bottom: 2px;
}
.footer-link::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: white;
    transition: width 0.3s;
}
.footer-link:hover::after {
    width: 100%;
}
</style>
