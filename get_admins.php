<?php
header('Content-Type: application/json');

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Établir la connexion
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(['error' => 'Échec de la connexion à la base de données: ' . $conn->connect_error]));
}

try {
    // Requête pour récupérer uniquement les administrateurs
    $sql = "SELECT id, nom, email, date_inscription FROM utilisateurs WHERE role = 'admin'";
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Erreur lors de la récupération des administrateurs: " . $conn->error);
    }
    
    $admins = [];
    while ($row = $result->fetch_assoc()) {
        $admins[] = $row;
    }
    
    echo json_encode($admins);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $conn->close();
}
?>