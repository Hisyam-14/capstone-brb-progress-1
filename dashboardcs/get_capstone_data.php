<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: text/csv; charset=utf-8");
header("Content-Disposition: attachment; filename=capstone_data.csv");

$host = "localhost";     
$username = "root";      
$password = "";          
$database = "capstone";  

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    $fallbackFile = "df_model_final.csv";
    if (file_exists($fallbackFile)) {
        echo file_get_contents($fallbackFile);
        exit;
    }
    
    echo "Error: Database connection failed and fallback file not found.";
    exit;
}

$conn->set_charset("utf8");

$sql = "SELECT 
            Tahun, 
            `Jenis Hutan`, 
            `Luas PBPH`, 
            `Target Produksi RKTPH Murni Luas (Ha)`, 
            `Target Produksi RKTPH Murni Volume (M3)`, 
            `Target Produksi RKTPH Carry Over Luas (Ha)`, 
            `Target Produksi RKTPH Carry Over Volume (M3)`, 
            `Target Produksi RKTPH Jumlah Luas (Ha)`, 
            `Realisasi Produksi RKTPH Alam Volume (M3)`, 
            `Realisasi Produksi RKTPH Tanaman Volume (M3)`, 
            `Kategori Capaian`, 
            Flag_Prosentase_Tinggi, 
            `log_Realisasi Produksi RKTPH Jumlah Volume (M3)`, 
            `Rasio Realisasi`, 
            Skala_PBPH 
        FROM forestry_data";

$result = $conn->query($sql);

$headers = array(
    'Tahun',
    'Jenis Hutan',
    'Luas PBPH',
    'Target Produksi RKTPH Murni Luas (Ha)',
    'Target Produksi RKTPH Murni Volume (M3)',
    'Target Produksi RKTPH Carry Over Luas (Ha)',
    'Target Produksi RKTPH Carry Over Volume (M3)',
    'Target Produksi RKTPH Jumlah Luas (Ha)',
    'Realisasi Produksi RKTPH Alam Volume (M3)',
    'Realisasi Produksi RKTPH Tanaman Volume (M3)',
    'Kategori Capaian',
    'Flag_Prosentase_Tinggi',
    'log_Realisasi Produksi RKTPH Jumlah Volume (M3)',
    'Rasio Realisasi',
    'Skala_PBPH'
);

echo implode(',', $headers) . "\n";

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        foreach ($row as &$value) {
            if (strpos($value, ',') !== false) {
                $value = '"' . str_replace('"', '""', $value) . '"';
            }
        }
        echo implode(',', $row) . "\n";
    }
} else {
    $fallbackFile = "df_model_final.csv";
    if (file_exists($fallbackFile)) {
        $lines = file($fallbackFile);
        for ($i = 1; $i < count($lines); $i++) {
            echo $lines[$i];
        }
    } else {
        echo "# No data found in the database or fallback file\n";
    }
}

$conn->close();
?>
