<nav class="navbar navbar-expand-lg navbar-dark bg-forest" style="box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background-color 0.3s ease;">
    <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="https://dishut.kaltimprov.go.id" aria-label="Homepage">
            <img src="/assets/img/logo.png" alt="Logo" width="70" height="50" class="d-inline-block align-text-top me-2" style="border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <span class="fs-4 fw-bold">Dinas Kehutanan Provinsi Kalimantan Timur</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style="border-color: rgba(255,255,255,0.5);">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item mx-2">
                    <a class="nav-link fw-semibold text-white d-flex align-items-center" href="/index.php" style="transition: color 0.3s ease;">
                        <i class="bi bi-house me-2"></i>Home
                    </a>
                </li>
                <li class="nav-item mx-2">
                    <a class="nav-link fw-semibold text-white d-flex align-items-center" href="/dashboardcs/index.php" style="transition: color 0.3s ease;">
                        <i class="bi bi-speedometer2 me-2"></i>Dashboard
                    </a>
                </li>
                <li class="nav-item mx-2">
                    <a class="nav-link fw-semibold text-white d-flex align-items-center" href="/webapi/index.php" style="transition: color 0.3s ease;">
                        <i class="bi bi-rocket-takeoff me-2"></i>FastAPI
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const currentUrl = window.location.href.toLowerCase();
    console.log('Current URL:', currentUrl);

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
      const linkHref = link.href.toLowerCase();
      console.log('Link Href:', linkHref);

      if (currentUrl.includes(linkHref)) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  });
</script>
