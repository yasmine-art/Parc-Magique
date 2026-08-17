<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Config DB
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'DB connection failed']));
}

$conn->set_charset('utf8mb4');

// Récupérer le type de filtre si présent
$type = isset($_GET['type']) ? $_GET['type'] : null;

try {
    if ($type && in_array($type, ['manege', 'aquaparc'])) {
        // Filtrage par type
        $stmt = $conn->prepare("SELECT id, nom, type, image,lien FROM parc WHERE type = ?");
        $stmt->bind_param('s', $type);
    } else {
        // Tous les parcs
        $stmt = $conn->prepare("SELECT id, nom, type, image,lien FROM parc");
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $parks = [];
    while ($row = $result->fetch_assoc()) {
        $parks[] = [
            'id' => $row['id'],
            'nom' => htmlspecialchars($row['nom'], ENT_QUOTES, 'UTF-8'),
            'type' => $row['type'],
            'lien'=>$row['lien'],
            'image' => filter_var($row['image'], FILTER_SANITIZE_URL)
        ];
    }
    
    echo json_encode(['success' => true, 'parks' => $parks]);
    
    $stmt->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    $conn->close();
}
?>