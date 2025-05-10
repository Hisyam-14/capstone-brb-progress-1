
// Global variables
let forestryData = []
let filteredForestryData = []
let currentPage = 1
const rowsPerPage = 10
const charts = {}

// PHP endpoint URL
const PHP_ENDPOINT = "get_capstone_data.php"

// Chart colors
const chartColors = {
  primary: "#2e7d32",
  secondary: "#4caf50",
  accent: "#81c784",
  light: "#a5d6a7",
  muted: "#e8f5e9",
  categories: ["#ef5350", "#ff9800", "#2196f3", "#4caf50"],
  forestTypes: ["#2e7d32", "#81c784"],
}

// Get chart colors
function getChartColors() {
  return chartColors
}

// Document ready
document.addEventListener("DOMContentLoaded", () => {
  // Load data from PHP endpoint
  loadDataFromDatabase()

  // Set up file input listener if it exists
  const fileInput = document.getElementById("csvFile")
  if (fileInput) {
    fileInput.addEventListener("change", handleFileUpload)
  }

  const uploadBtn = document.getElementById("uploadBtn")
  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      const fileInput = document.getElementById("csvFile")
      if (fileInput && fileInput.files.length > 0) {
        handleFileUpload({ target: fileInput })
      } else {
        alert("Please select a file first.")
      }
    })
  }

  // Set up chart type toggle buttons
  document.querySelectorAll("[data-chart-type]").forEach((button) => {
    button.addEventListener("click", function () {
      const chartType = this.getAttribute("data-chart-type")
      const targetChart = this.getAttribute("data-target")

      // Update active state of buttons in this group
      this.closest(".btn-group")
        .querySelectorAll(".btn")
        .forEach((btn) => {
          btn.classList.remove("active")
        })
      this.classList.add("active")

      // Update chart type
      updateChartType(targetChart, chartType)
    })
  })

  // Set up filter controls
  const applyFiltersBtn = document.getElementById("applyFilters")
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", applyFilters)
  }

  // Add interactive hover effects to cards
  document.querySelectorAll(".card-hover").forEach((card) => {
    card.classList.add("interactive-element")
  })
})

// Set active page in navbar
function setActivePage(pageName) {
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    if (link.getAttribute("href") === pageName) {
      link.classList.add("active")
      link.setAttribute("aria-current", "page")
    } else {
      link.classList.remove("active")
      link.removeAttribute("aria-current")
    }
  })
}

// Get current page name
function getCurrentPage() {
  const path = window.location.pathname
  const page = path.split("/").pop()
  return page || "index.php"
}

// Load data from PHP endpoint
function loadDataFromDatabase() {
  const fileStatus = document.getElementById("fileStatus")
  if (!fileStatus) return

  fileStatus.textContent = "Mengambil data dari database..."
  fileStatus.className = "alert alert-info mt-2"

  // Fetch data from PHP endpoint
  fetch(PHP_ENDPOINT)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.text()
    })
    .then((csvText) => {
      console.log("Data fetched successfully. First 100 chars:", csvText.substring(0, 100))
      parseCSV(csvText)
      fileStatus.textContent = "Data berhasil dimuat dari database!"
      fileStatus.className = "alert alert-success mt-2"

      // Add animation to success message
      fileStatus.classList.add("fade-in")
      setTimeout(() => fileStatus.classList.remove("fade-in"), 500)
    })
    .catch((error) => {
      console.error("Error loading data from database:", error)
      if (fileStatus) {
        fileStatus.textContent = "Error saat mengambil data dari database. Silakan upload file manual."
        fileStatus.className = "alert alert-danger mt-2"
      }

      // Attempt to load embedded CSV data as fallback
      loadEmbeddedCSV()
    })
}

// Load embedded CSV as fallback
function loadEmbeddedCSV() {
  const fileStatus = document.getElementById("fileStatus")
  if (!fileStatus) return

  fileStatus.textContent = "Menggunakan data dari fallback..."

  // Create a new XMLHttpRequest
  const xhr = new XMLHttpRequest()
  xhr.open("GET", "df_model_final.csv", true)
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        parseCSV(xhr.responseText)
        fileStatus.textContent = "Data fallback berhasil dimuat!"
        fileStatus.className = "alert alert-success mt-2"
      } else {
        fileStatus.textContent = "Gagal memuat data fallback. Silakan upload file CSV."
        fileStatus.className = "alert alert-warning mt-2"
      }
    }
  }
  xhr.send()
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0]
  const fileStatus = document.getElementById("fileStatus")
  if (!fileStatus) return

  if (file) {
    fileStatus.textContent = "Memproses file..."
    fileStatus.className = "alert alert-info mt-2"

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        parseCSV(e.target.result)
        fileStatus.textContent = "File CSV berhasil dimuat!"
        fileStatus.className = "alert alert-success mt-2"

        // Add animation to success message
        fileStatus.classList.add("fade-in")
        setTimeout(() => fileStatus.classList.remove("fade-in"), 500)
      } catch (error) {
        console.error("Error parsing CSV:", error)
        fileStatus.textContent = "Error saat memproses file CSV."
        fileStatus.className = "alert alert-danger mt-2"
      }
    }

    reader.readAsText(file)
  }
}

// Parse CSV data using PapaParse
function parseCSV(csvText) {
  // Make sure Papa is defined
  const Papa = window.Papa
  if (typeof Papa === "undefined") {
    console.error("PapaParse library is not loaded.")
    alert("PapaParse library is not loaded. Please include it in your HTML.")
    return
  }

  Papa.parse(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      console.log("CSV parsing complete. Rows:", results.data.length)
      console.log("Sample row:", results.data[0])

      if (results.errors && results.errors.length > 0) {
        console.warn("CSV parsing had errors:", results.errors)
      }

      forestryData = results.data
      filteredForestryData = [...forestryData]

      // Process and display the data
      processData()
      populateFilterOptions()

      // Determine which page we're on and render appropriate content
      const currentPage = getCurrentPage()

      if (currentPage === "index.php" || currentPage === "") {
        renderOverviewCharts()
      } else if (currentPage === "yearly-trends.php") {
        renderYearlyTrendsCharts()
      } else if (currentPage === "comparisons.php") {
        renderComparisonCharts()
      } else if (currentPage === "data-table.php") {
        renderTable()
      }

      // Show success toast
      showToast(`${forestryData.length} data berhasil dimuat`)
    },
    error: (error) => {
      console.error("Error parsing CSV:", error)
      alert("Error saat memproses file CSV: " + error.message)
    },
  })
}

// Populate filter dropdown options
function populateFilterOptions() {
  // Populate year filter
  const yearFilter = document.getElementById("yearFilter")
  if (!yearFilter) return

  yearFilter.innerHTML = '<option value="all">Semua Tahun</option>'

  const years = [...new Set(forestryData.map((item) => item.Tahun))].sort()
  years.forEach((year) => {
    const option = document.createElement("option")
    option.value = year
    option.textContent = year
    yearFilter.appendChild(option)
  })
}

// Apply filters to data
function applyFilters() {
  const yearFilter = document.getElementById("yearFilter").value
  const forestTypeFilter = document.getElementById("forestTypeFilter").value
  const achievementFilter = document.getElementById("achievementFilter").value

  filteredForestryData = forestryData.filter((item) => {
    // Apply year filter
    if (yearFilter !== "all" && item.Tahun != yearFilter) return false

    // Apply forest type filter
    if (forestTypeFilter !== "all" && item["Jenis Hutan"] != forestTypeFilter) return false

    // Apply achievement filter
    if (achievementFilter !== "all" && item["Kategori Capaian"] != achievementFilter) return false

    return true
  })

  // Update UI with filtered data
  processData()

  // Determine which page we're on and render appropriate content
  const currentPage = getCurrentPage()

  if (currentPage === "index.php" || currentPage === "") {
    renderOverviewCharts()
  } else if (currentPage === "yearly-trends.php") {
    renderYearlyTrendsCharts()
  } else if (currentPage === "comparisons.php") {
    renderComparisonCharts()
  } else if (currentPage === "data-table.php") {
    renderTable()
  }

  // Show toast notification
  showToast(`Filter diterapkan: ${filteredForestryData.length} data ditampilkan`)
}

// Show toast notification
function showToast(message) {
  // Create toast element if it doesn't exist
  let toastContainer = document.querySelector(".toast-container")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3"
    document.body.appendChild(toastContainer)
  }

  const toastId = "toast-" + Date.now()
  const toastHTML = `
    <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <i class="bi bi-info-circle text-forest me-2"></i>
        <strong class="me-auto">Notifikasi</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    </div>
  `

  toastContainer.insertAdjacentHTML("beforeend", toastHTML)
  const toastElement = document.getElementById(toastId)
  const bootstrap = window.bootstrap
  const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 })
  toast.show()

  // Remove toast after it's hidden
  toastElement.addEventListener("hidden.bs.toast", () => {
    toastElement.remove()
  })
}

// Process the data for visualization
function processData() {
  const data = filteredForestryData

  // Update summary cards if they exist
  const totalDataElement = document.getElementById("totalData")
  if (totalDataElement) {
    totalDataElement.textContent = data.length
  }

  // Get unique years
  const years = [...new Set(data.map((item) => item.Tahun))]
  const totalYearsElement = document.getElementById("totalYears")
  if (totalYearsElement) {
    totalYearsElement.textContent = years.length
  }

  // Calculate average ratio
  const avgRatio = data.reduce((sum, item) => sum + (item["Rasio Realisasi"] || 0), 0) / data.length
  const avgRatioElement = document.getElementById("avgRatio")
  if (avgRatioElement) {
    avgRatioElement.textContent = avgRatio.toFixed(2)
  }

  // Calculate average area
  const avgArea = data.reduce((sum, item) => sum + (item["Luas PBPH"] || 0), 0) / data.length
  const avgAreaElement = document.getElementById("avgArea")
  if (avgAreaElement) {
    avgAreaElement.textContent = (avgArea / 1000).toFixed(1) + "k"
  }

  // Add animation to the cards
  document.querySelectorAll(".card-hover").forEach((card) => {
    card.classList.add("fade-in")
    setTimeout(() => card.classList.remove("fade-in"), 500)
  })
}

// Render overview charts (for index.php)
function renderOverviewCharts() {
  // Destroy existing charts to prevent duplicates
  Object.values(charts).forEach((chart) => {
    if (chart) chart.destroy()
  })

  // Only render charts if we have data
  if (filteredForestryData.length === 0) {
    console.warn("No data available to render charts")
    return
  }

  // Render achievement chart
  renderAchievementChart()

  // Render forest type chart
  renderForestTypeChart()
}

// Render yearly trends charts (for yearly-trends.php)
function renderYearlyTrendsCharts() {
  // Destroy existing charts to prevent duplicates
  Object.values(charts).forEach((chart) => {
    if (chart) chart.destroy()
  })

  // Only render charts if we have data
  if (filteredForestryData.length === 0) {
    console.warn("No data available to render charts")
    return
  }

  // Render target vs realization chart
  renderTargetVsRealizationChart()

  // Render yearly achievement chart
  renderYearlyAchievementChart()
}

// Render comparison charts (for comparisons.php)
function renderComparisonCharts() {
  // Destroy existing charts to prevent duplicates
  Object.values(charts).forEach((chart) => {
    if (chart) chart.destroy()
  })

  // Only render charts if we have data
  if (filteredForestryData.length === 0) {
    console.warn("No data available to render charts")
    return
  }

  // Render forest comparison chart
  renderForestComparisonChart()

  // Render scatter chart
  renderScatterChart()
}

// Render the data table
function renderTable() {
  const tableHeader = document.getElementById("tableHeader")
  const tableBody = document.getElementById("tableBody")

  if (!tableHeader || !tableBody) return

  // Clear existing content
  tableHeader.innerHTML = ""
  tableBody.innerHTML = ""

  // Get column headers from the first data item
  if (forestryData.length > 0) {
    const headers = Object.keys(forestryData[0])

    // Create table headers
    headers.forEach((header) => {
      const th = document.createElement("th")
      th.textContent = header
      th.style.cursor = "pointer"
      th.addEventListener("click", () => sortTable(header))
      tableHeader.appendChild(th)
    })

    // Filter and paginate data
    filterTable()
  } else {
    console.warn("No data available to render table")
    const tr = document.createElement("tr")
    const td = document.createElement("td")
    td.colSpan = 5
    td.textContent = "Tidak ada data tersedia"
    td.className = "text-center py-3"
    tr.appendChild(td)
    tableBody.appendChild(tr)
  }
}

// Sort table by column
let currentSortColumn = ""
let currentSortDirection = "asc"

function sortTable(column) {
  // Toggle sort direction if clicking the same column
  if (column === currentSortColumn) {
    currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc"
  } else {
    currentSortColumn = column
    currentSortDirection = "asc"
  }

  // Sort the filtered data
  filteredForestryData.sort((a, b) => {
    const valueA = a[column]
    const valueB = b[column]

    // Handle null values
    if (valueA === null) return currentSortDirection === "asc" ? -1 : 1
    if (valueB === null) return currentSortDirection === "asc" ? 1 : -1

    // Compare based on data type
    if (typeof valueA === "string") {
      return currentSortDirection === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    } else {
      return currentSortDirection === "asc" ? valueA - valueB : valueB - valueA
    }
  })

  // Update table headers to show sort direction
  const headers = document.querySelectorAll("#tableHeader th")
  headers.forEach((th) => {
    if (th.textContent === column) {
      th.innerHTML = `${column} <i class="bi bi-arrow-${currentSortDirection === "asc" ? "up" : "down"}"></i>`
    } else {
      th.textContent = th.textContent.replace(/ <i.*<\/i>/, "")
    }
  })

  // Re-render table with sorted data
  currentPage = 1
  renderTablePage()

  // Show toast notification
  showToast(`Data diurutkan berdasarkan ${column} (${currentSortDirection === "asc" ? "naik" : "turun"})`)
}

// Filter table based on search term
function filterTable() {
  const searchTerm = document.getElementById("tableSearch")?.value.toLowerCase() || ""

  if (searchTerm) {
    filteredForestryData = forestryData.filter((item) =>
      Object.values(item).some((value) => value !== null && value.toString().toLowerCase().includes(searchTerm)),
    )
  } else {
    filteredForestryData = [...forestryData]
  }

  // Apply any active filters
  const yearFilter = document.getElementById("yearFilter")?.value || "all"
  const forestTypeFilter = document.getElementById("forestTypeFilter")?.value || "all"
  const achievementFilter = document.getElementById("achievementFilter")?.value || "all"

  if (yearFilter !== "all" || forestTypeFilter !== "all" || achievementFilter !== "all") {
    applyFilters()
  } else {
    // Update pagination
    updatePagination()

    // Render the current page
    renderTablePage()
  }
}

// Render the current page of the table
function renderTablePage() {
  const tableBody = document.getElementById("tableBody")
  if (!tableBody) return

  tableBody.innerHTML = ""

  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = Math.min(startIndex + rowsPerPage, filteredForestryData.length)
  const pageData = filteredForestryData.slice(startIndex, endIndex)

  if (pageData.length === 0) {
    const tr = document.createElement("tr")
    const td = document.createElement("td")
    td.colSpan = Object.keys(forestryData[0] || {}).length
    td.textContent = "Tidak ada data yang sesuai dengan pencarian"
    td.className = "text-center py-3"
    tr.appendChild(td)
    tableBody.appendChild(tr)
  } else {
    pageData.forEach((item) => {
      const tr = document.createElement("tr")

      Object.entries(item).forEach(([key, value]) => {
        const td = document.createElement("td")
        td.textContent = value !== null ? value : ""

        // Highlight search term if present
        const searchTerm = document.getElementById("tableSearch")?.value.toLowerCase() || ""
        if (searchTerm && value !== null && value.toString().toLowerCase().includes(searchTerm)) {
          const text = td.textContent
          const index = text.toLowerCase().indexOf(searchTerm)
          if (index >= 0) {
            td.innerHTML =
              text.substring(0, index) +
              '<span class="highlight">' +
              text.substring(index, index + searchTerm.length) +
              "</span>" +
              text.substring(index + searchTerm.length)
          }
        }

        tr.appendChild(td)
      })

      // Add row click event for details
      tr.style.cursor = "pointer"
      tr.addEventListener("click", () => {
        showRowDetails(item)
      })

      tableBody.appendChild(tr)
    })
  }

  // Update table info
  const tableInfo = document.getElementById("tableInfo")
  if (tableInfo) {
    tableInfo.textContent = `Menampilkan ${Math.min(filteredForestryData.length, startIndex + 1)}-${endIndex} dari ${filteredForestryData.length} data`
  }
}

// Show row details in a modal
function showRowDetails(rowData) {
  // Create modal if it doesn't exist
  let detailsModal = document.getElementById("rowDetailsModal")
  if (!detailsModal) {
    const modalHTML = `
      <div class="modal fade" id="rowDetailsModal" tabindex="-1" aria-labelledby="rowDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="rowDetailsModalLabel">Detail Data</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" id="rowDetailsContent">
              <!-- Details will be inserted here -->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
            </div>
          </div>
        </div>
      </div>
    `
    document.body.insertAdjacentHTML("beforeend", modalHTML)
    detailsModal = document.getElementById("rowDetailsModal")
  }

  // Populate modal with row data
  const modalContent = document.getElementById("rowDetailsContent")
  modalContent.innerHTML = ""

  // Create a table for the details
  const detailsTable = document.createElement("table")
  detailsTable.className = "table table-striped"

  Object.entries(rowData).forEach(([key, value]) => {
    const row = document.createElement("tr")

    const keyCell = document.createElement("th")
    keyCell.textContent = key
    keyCell.style.width = "40%"

    const valueCell = document.createElement("td")
    valueCell.textContent = value !== null ? value : "-"

    row.appendChild(keyCell)
    row.appendChild(valueCell)
    detailsTable.appendChild(row)
  })

  modalContent.appendChild(detailsTable)

  // Show the modal
  const bootstrap = window.bootstrap
  const modal = new bootstrap.Modal(detailsModal)
  modal.show()
}

// Update pagination controls
function updatePagination() {
  const paginationControls = document.getElementById("paginationControls")
  if (!paginationControls) return

  paginationControls.innerHTML = ""

  const totalPages = Math.ceil(filteredForestryData.length / rowsPerPage)

  // Previous button
  const prevLi = document.createElement("li")
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`
  const prevLink = document.createElement("a")
  prevLink.className = "page-link"
  prevLink.href = "#"
  prevLink.innerHTML = "&laquo;"
  prevLink.addEventListener("click", (e) => {
    e.preventDefault()
    if (currentPage > 1) {
      currentPage--
      renderTablePage()
      updatePagination()
    }
  })
  prevLi.appendChild(prevLink)
  paginationControls.appendChild(prevLi)

  // Page numbers
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageLi = document.createElement("li")
    pageLi.className = `page-item ${i === currentPage ? "active" : ""}`
    const pageLink = document.createElement("a")
    pageLink.className = "page-link"
    pageLink.href = "#"
    pageLink.textContent = i
    pageLink.addEventListener("click", (e) => {
      e.preventDefault()
      currentPage = i
      renderTablePage()
      updatePagination()
    })
    pageLi.appendChild(pageLink)
    paginationControls.appendChild(pageLi)
  }

  // Next button
  const nextLi = document.createElement("li")
  nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`
  const nextLink = document.createElement("a")
  nextLink.className = "page-link"
  nextLink.href = "#"
  nextLink.innerHTML = "&raquo;"
  nextLink.addEventListener("click", (e) => {
    e.preventDefault()
    if (currentPage < totalPages) {
      currentPage++
      renderTablePage()
      updatePagination()
    }
  })
  nextLi.appendChild(nextLink)
  paginationControls.appendChild(nextLi)
}

// Export table to CSV
function exportTableToCSV() {
  if (filteredForestryData.length === 0) {
    alert("Tidak ada data untuk diekspor")
    return
  }

  const headers = Object.keys(filteredForestryData[0])
  let csvContent = headers.join(",") + "\n"

  filteredForestryData.forEach((item) => {
    const row = headers.map((header) => {
      const value = item[header]
      // Handle values with commas by wrapping in quotes
      return value !== null && typeof value === "string" && value.includes(",")
        ? `"${value}"`
        : value !== null
          ? value
          : ""
    })
    csvContent += row.join(",") + "\n"
  })

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "forestry_data_export.csv")
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Show success message
  showToast("Data berhasil diekspor ke CSV")
}

// Update chart type
function updateChartType(chartId, newType) {
  if (!charts[chartId]) return

  const chartData = charts[chartId].data
  const chartOptions = charts[chartId].options

  // Destroy existing chart
  charts[chartId].destroy()

  // Create new chart with the same data but different type
  const ctx = document.getElementById(chartId).getContext("2d")
  charts[chartId] = new Chart(ctx, {
    type: newType,
    data: chartData,
    options: chartOptions,
  })

  // Show toast notification
  showToast(
    `Tipe grafik diubah ke ${newType === "bar" ? "Bar Chart" : newType === "line" ? "Line Chart" : newType === "pie" ? "Pie Chart" : "Doughnut Chart"}`,
  )
}

// Render achievement distribution chart
function renderAchievementChart() {
  const ctx = document.getElementById("achievementChart")
  if (!ctx) return

  const colors = getChartColors()

  // Count categories
  const categoryCounts = {
    "Tidak Ada Realisasi": 0,
    "1-50%": 0,
    "51-100%": 0,
    ">100%": 0,
  }

  filteredForestryData.forEach((item) => {
    const category = getCategoryLabel(item["Kategori Capaian"])
    categoryCounts[category]++
  })

  // Get chart type from active button
  const chartTypeBtn = document.querySelector('[data-target="achievementChart"].active')
  const chartType = chartTypeBtn ? chartTypeBtn.getAttribute("data-chart-type") : "doughnut"

  charts.achievementChart = new Chart(ctx.getContext("2d"), {
    type: chartType,
    data: {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          data: Object.values(categoryCounts),
          backgroundColor: colors.categories,
          borderWidth: 1,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ""
              const value = context.raw || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((value / total) * 100)
              return `${label}: ${value} (${percentage}%)`
            },
          },
        },
      },
      scales:
        chartType === "bar"
          ? {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: "#333",
                },
              },
              x: {
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: "#333",
                },
              },
            }
          : {},
    },
  })

  // Add click event for more details
  ctx.onclick = (evt) => {
    const points = charts.achievementChart.getElementsAtEventForMode(evt, "nearest", { intersect: true }, true)

    if (points.length) {
      const firstPoint = points[0]
      const label = charts.achievementChart.data.labels[firstPoint.index]
      const value = charts.achievementChart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index]
      const total = charts.achievementChart.data.datasets[firstPoint.datasetIndex].data.reduce((a, b) => a + b, 0)
      const percentage = ((value / total) * 100).toFixed(1)

      showToast(`${label}: ${value} dari ${total} data (${percentage}%)`)
    }
  }
}

// Render forest type distribution chart
function renderForestTypeChart() {
  const ctx = document.getElementById("forestTypeChart")
  if (!ctx) return

  const colors = getChartColors()

  // Count forest types
  const forestTypeCounts = {
    "Hutan Alam": 0,
    "Hutan Tanaman": 0,
  }

  filteredForestryData.forEach((item) => {
    const forestType = item["Jenis Hutan"] === 0 ? "Hutan Alam" : "Hutan Tanaman"
    forestTypeCounts[forestType]++
  })

  // Get chart type from active button
  const chartTypeBtn = document.querySelector('[data-target="forestTypeChart"].active')
  const chartType = chartTypeBtn ? chartTypeBtn.getAttribute("data-chart-type") : "pie"

  charts.forestType = new Chart(ctx.getContext("2d"), {
    type: chartType,
    data: {
      labels: Object.keys(forestTypeCounts),
      datasets: [
        {
          data: Object.values(forestTypeCounts),
          backgroundColor: colors.forestTypes,
          borderWidth: 1,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ""
              const value = context.raw || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = Math.round((value / total) * 100)
              return `${label}: ${value} (${percentage}%)`
            },
          },
        },
      },
      scales:
        chartType === "bar"
          ? {
              y: {
                beginAtZero: true,
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: "#333",
                },
              },
              x: {
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
                ticks: {
                  color: "#333",
                },
              },
            }
          : {},
    },
  })

  // Add click event for more details
  ctx.onclick = (evt) => {
    const points = charts.forestType.getElementsAtEventForMode(evt, "nearest", { intersect: true }, true)

    if (points.length) {
      const firstPoint = points[0]
      const label = charts.forestType.data.labels[firstPoint.index]
      const value = charts.forestType.data.datasets[firstPoint.datasetIndex].data[firstPoint.index]

      // Calculate average area for this forest type
      const forestTypeData = filteredForestryData.filter(
        (item) =>
          (label === "Hutan Alam" && item["Jenis Hutan"] === 0) ||
          (label === "Hutan Tanaman" && item["Jenis Hutan"] === 1),
      )

      const avgArea = forestTypeData.reduce((sum, item) => sum + (item["Luas PBPH"] || 0), 0) / forestTypeData.length
      const avgRatio =
        forestTypeData.reduce((sum, item) => sum + (item["Rasio Realisasi"] || 0), 0) / forestTypeData.length

      showToast(
        `${label}: ${value} PBPH, Rata-rata luas: ${(avgArea / 1000).toFixed(1)}k Ha, Rata-rata rasio: ${avgRatio.toFixed(2)}`,
      )
    }
  }
}

// Render target vs realization chart
function renderTargetVsRealizationChart() {
  const ctx = document.getElementById("targetVsRealizationChart")
  if (!ctx) return

  const colors = getChartColors()

  // Get unique years
  const years = [...new Set(filteredForestryData.map((item) => item.Tahun))].sort()

  // Calculate yearly totals
  const yearlyData = years.map((year) => {
    const yearData = filteredForestryData.filter((item) => item.Tahun === year)

    const totalTarget = yearData.reduce((sum, item) => {
      return sum + Number.parseFloat(item["Target Produksi RKTPH Murni Volume (M3)"] || 0)
    }, 0)

    const totalRealization = yearData.reduce((sum, item) => {
      // Use log value if available, otherwise calculate from ratio
      if (item["log_Realisasi Produksi RKTPH Jumlah Volume (M3)"] !== undefined) {
        return sum + (Math.exp(item["log_Realisasi Produksi RKTPH Jumlah Volume (M3)"]) - 1)
      } else {
        return (
          sum + Number.parseFloat(item["Target Produksi RKTPH Murni Volume (M3)"] || 0) * (item["Rasio Realisasi"] || 0)
        )
      }
    }, 0)

    return {
      year,
      target: totalTarget,
      realization: totalRealization,
    }
  })

  // Get chart type from active button
  const chartTypeBtn = document.querySelector('[data-target="targetVsRealizationChart"].active')
  const chartType = chartTypeBtn ? chartTypeBtn.getAttribute("data-chart-type") : "bar"

  charts.targetVsRealization = new Chart(ctx.getContext("2d"), {
    type: chartType,
    data: {
      labels: years,
      datasets: [
        {
          label: "Target Produksi (M3)",
          data: yearlyData.map((item) => item.target),
          backgroundColor: "#3b82f6",
          borderColor: "#3b82f6",
          borderWidth: chartType === "line" ? 3 : 1,
          fill: chartType === "line" ? false : true,
          tension: 0.1,
        },
        {
          label: "Realisasi Produksi (M3)",
          data: yearlyData.map((item) => item.realization),
          backgroundColor: "#22c55e",
          borderColor: "#22c55e",
          borderWidth: chartType === "line" ? 3 : 1,
          fill: chartType === "line" ? false : true,
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Volume (M3)",
            color: "#333",
          },
          ticks: {
            callback: (value) => (value / 1000).toFixed(0) + "k",
            color: "#333",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Tahun",
            color: "#333",
          },
          ticks: {
            color: "#333",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || ""
              const value = context.raw || 0
              return `${label}: ${(value / 1000).toFixed(1)}k M3`
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  })

  // Add click event for more details
  ctx.onclick = (evt) => {
    const points = charts.targetVsRealization.getElementsAtEventForMode(evt, "nearest", { intersect: true }, true)

    if (points.length) {
      const firstPoint = points[0]
      const year = charts.targetVsRealization.data.labels[firstPoint.index]
      const dataset = charts.targetVsRealization.data.datasets[firstPoint.datasetIndex]
      const value = dataset.data[firstPoint.index]
      const label = dataset.label

      // Get data for this year
      const yearData = filteredForestryData.filter((item) => item.Tahun == year)
      const count = yearData.length

      showToast(`${year}: ${label} ${(value / 1000).toFixed(1)}k M3 (${count} PBPH)`)
    }
  }
}

// Render yearly achievement trend chart
function renderYearlyAchievementChart() {
  const ctx = document.getElementById("yearlyAchievementChart")
  if (!ctx) return

  const colors = getChartColors()

  // Get unique years
  const years = [...new Set(filteredForestryData.map((item) => item.Tahun))].sort()

  // Calculate yearly category percentages
  const yearlyData = years.map((year) => {
    const yearData = filteredForestryData.filter((item) => item.Tahun === year)
    const totalEntries = yearData.length

    const noRealization = yearData.filter((item) => item["Kategori Capaian"] === 0).length
    const low = yearData.filter((item) => item["Kategori Capaian"] === 1).length
    const medium = yearData.filter((item) => item["Kategori Capaian"] === 2).length
    const high = yearData.filter((item) => item["Kategori Capaian"] === 3).length

    return {
      year,
      "Tidak Ada Realisasi": (noRealization / totalEntries) * 100,
      "1-50%": (low / totalEntries) * 100,
      "51-100%": (medium / totalEntries) * 100,
      ">100%": (high / totalEntries) * 100,
    }
  })

  // Get chart type from active button
  const chartTypeBtn = document.querySelector('[data-target="yearlyAchievementChart"].active')
  const chartType = chartTypeBtn ? chartTypeBtn.getAttribute("data-chart-type") : "line"

  charts.yearlyAchievement = new Chart(ctx.getContext("2d"), {
    type: chartType,
    data: {
      labels: years,
      datasets: [
        {
          label: "Tidak Ada Realisasi",
          data: yearlyData.map((item) => item["Tidak Ada Realisasi"]),
          borderColor: colors.categories[0],
          backgroundColor: chartType === "line" ? colors.categories[0] + "33" : colors.categories[0],
          fill: chartType === "line",
          tension: 0.1,
        },
        {
          label: "1-50%",
          data: yearlyData.map((item) => item["1-50%"]),
          borderColor: colors.categories[1],
          backgroundColor: chartType === "line" ? colors.categories[1] + "33" : colors.categories[1],
          fill: chartType === "line",
          tension: 0.1,
        },
        {
          label: "51-100%",
          data: yearlyData.map((item) => item["51-100%"]),
          borderColor: colors.categories[2],
          backgroundColor: chartType === "line" ? colors.categories[2] + "33" : colors.categories[2],
          fill: chartType === "line",
          tension: 0.1,
        },
        {
          label: ">100%",
          data: yearlyData.map((item) => item[">100%"]),
          borderColor: colors.categories[3],
          backgroundColor: chartType === "line" ? colors.categories[3] + "33" : colors.categories[3],
          fill: chartType === "line",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Persentase (%)",
            color: "#333",
          },
          max: 100,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            color: "#333",
          },
        },
        x: {
          title: {
            display: true,
            text: "Tahun",
            color: "#333",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            color: "#333",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || ""
              const value = context.raw || 0
              return `${label}: ${value.toFixed(1)}%`
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  })
}

// Render forest comparison chart
function renderForestComparisonChart() {
  const ctx = document.getElementById("forestComparisonChart")
  if (!ctx) return

  const colors = getChartColors()

  // Prepare data for forest type comparison
  const forestTypes = ["Hutan Alam", "Hutan Tanaman"]
  const categories = ["Tidak Ada Realisasi", "1-50%", "51-100%", ">100%"]

  const forestData = forestTypes.map((forestType) => {
    const typeData = filteredForestryData.filter(
      (item) =>
        (forestType === "Hutan Alam" && item["Jenis Hutan"] === 0) ||
        (forestType === "Hutan Tanaman" && item["Jenis Hutan"] === 1),
    )

    const totalEntries = typeData.length
    if (totalEntries === 0) return { forestType, "Tidak Ada Realisasi": 0, "1-50%": 0, "51-100%": 0, ">100%": 0 }

    return {
      forestType,
      "Tidak Ada Realisasi": (typeData.filter((item) => item["Kategori Capaian"] === 0).length / totalEntries) * 100,
      "1-50%": (typeData.filter((item) => item["Kategori Capaian"] === 1).length / totalEntries) * 100,
      "51-100%": (typeData.filter((item) => item["Kategori Capaian"] === 2).length / totalEntries) * 100,
      ">100%": (typeData.filter((item) => item["Kategori Capaian"] === 3).length / totalEntries) * 100,
    }
  })

  charts.forestComparison = new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels: forestTypes,
      datasets: categories.map((category, index) => ({
        label: category,
        data: forestData.map((item) => item[category]),
        backgroundColor: colors.categories[index],
        borderWidth: 1,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Persentase (%)",
            color: "#333",
          },
          max: 100,
          stacked: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            color: "#333",
          },
        },
        x: {
          title: {
            display: true,
            text: "Jenis Hutan",
            color: "#333",
          },
          stacked: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            color: "#333",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || ""
              const value = context.raw || 0
              return `${label}: ${value.toFixed(1)}%`
            },
          },
        },
      },
    },
  })

  // Add click event for more details
  ctx.onclick = (evt) => {
    const points = charts.forestComparison.getElementsAtEventForMode(evt, "nearest", { intersect: true }, true)

    if (points.length) {
      const firstPoint = points[0]
      const forestType = charts.forestComparison.data.labels[firstPoint.index]
      const category = charts.forestComparison.data.datasets[firstPoint.datasetIndex].label
      const value = charts.forestComparison.data.datasets[firstPoint.datasetIndex].data[firstPoint.index]

      showToast(`${forestType} - ${category}: ${value.toFixed(1)}%`)
    }
  }
}

// Render scatter chart
function renderScatterChart() {
  const ctx = document.getElementById("scatterChart")
  if (!ctx) return

  const colors = getChartColors()

  // Prepare data for scatter plot
  const scatterData = filteredForestryData.map((item) => ({
    x: Number.parseFloat(item["Luas PBPH"] || 0),
    y: item["Rasio Realisasi"] || 0,
    forestType: item["Jenis Hutan"] === 0 ? "Hutan Alam" : "Hutan Tanaman",
  }))

  const alamData = scatterData.filter((item) => item.forestType === "Hutan Alam")
  const tanamanData = scatterData.filter((item) => item.forestType === "Hutan Tanaman")

  // Calculate max values for proper scaling
  const allData = [...alamData, ...tanamanData]
  const maxX = Math.max(...allData.map((item) => item.x), 100000) // Set minimum max to 100,000
  const maxY = Math.max(...allData.map((item) => item.y), 2) // Set minimum max to 2

  charts.scatter = new Chart(ctx.getContext("2d"), {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Hutan Alam",
          data: alamData,
          backgroundColor: colors.forestTypes[0],
          pointRadius: 5,
          pointHoverRadius: 7,
          hidden: document.getElementById("showAlamData") ? !document.getElementById("showAlamData").checked : false,
        },
        {
          label: "Hutan Tanaman",
          data: tanamanData,
          backgroundColor: colors.forestTypes[1],
          pointRadius: 5,
          pointHoverRadius: 7,
          hidden: document.getElementById("showTanamanData")
            ? !document.getElementById("showTanamanData").checked
            : false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: 1000,
        easing: "easeOutQuart",
      },
      layout: {
        padding: {
          top: 10,
          right: 10,
          bottom: 10,
          left: 10,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Rasio Realisasi",
            color: "#333",
          },
          min: 0,
          max: maxY * 1.1, // Add 10% padding to the max value
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          ticks: {
            color: "#333",
            precision: 1,
          },
        },
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Luas PBPH (Ha)",
            color: "#333",
          },
          min: 0,
          max: maxX * 1.1, // Add 10% padding to the max value
          ticks: {
            callback: (value) => (value / 1000).toFixed(0) + "k",
            color: "#333",
            maxRotation: 0,
            autoSkip: true,
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || ""
              const x = context.parsed.x
              const y = context.parsed.y
              return `${label}: Luas ${x.toFixed(0)} Ha, Rasio ${y.toFixed(2)}`
            },
          },
        },
      },
    },
  })

  // Add click event for more details
  ctx.onclick = (evt) => {
    const points = charts.scatter.getElementsAtEventForMode(evt, "nearest", { intersect: true }, true)

    if (points.length) {
      const firstPoint = points[0]
      const dataset = charts.scatter.data.datasets[firstPoint.datasetIndex]
      const dataPoint = dataset.data[firstPoint.index]

      showToast(`${dataset.label}: Luas ${dataPoint.x.toFixed(0)} Ha, Rasio Realisasi ${dataPoint.y.toFixed(2)}`)
    }
  }
}

// Update scatter chart based on checkboxes
function updateScatterChart() {
  if (!charts.scatter) return

  const showAlamData = document.getElementById("showAlamData")
  const showTanamanData = document.getElementById("showTanamanData")

  if (showAlamData) {
    charts.scatter.data.datasets[0].hidden = !showAlamData.checked
  }

  if (showTanamanData) {
    charts.scatter.data.datasets[1].hidden = !showTanamanData.checked
  }

  charts.scatter.update()
}

// Helper function to get category label from numeric value
function getCategoryLabel(categoryValue) {
  switch (categoryValue) {
    case 0:
      return "Tidak Ada Realisasi"
    case 1:
      return "1-50%"
    case 2:
      return "51-100%"
    case 3:
      return ">100%"
    default:
      return "Unknown"
  }
}
