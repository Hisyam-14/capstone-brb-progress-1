<?php
$host = "localhost";     
$username = "u407076436_capstone";    
$password = "[I]huB9s";          
$database = "u407076436_capstone"; 

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8");

$csvFile = 'data/df_model_final.csv';

if (!file_exists($csvFile)) {
    die("CSV file not found: $csvFile");
}

$file = fopen($csvFile, 'r');
if (!$file) {
    die("Unable to open CSV file");
}

$headers = fgetcsv($file);

$sql = "INSERT INTO forestry_data (
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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$importedRows = 0;
$errorRows = 0;

while (($row = fgetcsv($file)) !== FALSE) {
    if (count($row) < count($headers)) {
        $errorRows++;
        continue;
    }
    
    $flagValue = (strtolower($row[11]) === 'true') ? 1 : 0;
    
    $stmt->bind_param(
        "iiddddddddiiddd",
        $row[0],  // Tahun
        $row[1],  // Jenis Hutan
        $row[2],  // Luas PBPH
        $row[3],  // Target Produksi RKTPH Murni Luas (Ha)
        $row[4],  // Target Produksi RKTPH Murni Volume (M3)
        $row[5],  // Target Produksi RKTPH Carry Over Luas (Ha)
        $row[6],  // Target Produksi RKTPH Carry Over Volume (M3)
        $row[7],  // Target Produksi RKTPH Jumlah Luas (Ha)
        $row[8],  // Realisasi Produksi RKTPH Alam Volume (M3)
        $row[9],  // Realisasi Produksi RKTPH Tanaman Volume (M3)
        $row[10], // Kategori Capaian
        $flagValue, // Flag_Prosentase_Tinggi
        $row[12], // log_Realisasi Produksi RKTPH Jumlah Volume (M3)
        $row[13], // Rasio Realisasi
        $row[14]  // Skala_PBPH
    );
    
    if ($stmt->execute()) {
        $importedRows++;
    } else {
        $errorRows++;
        echo "Error importing row: " . $stmt->error . "<br>";
    }
}

fclose($file);
$stmt->close();

echo "Import completed. Imported $importedRows rows. Errors: $errorRows rows.";

$conn->close();
?>