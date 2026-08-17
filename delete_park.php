<?php
header('Content-Type: application/json');

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Créer une connexion MySQLi
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Erreur de connexion à la base de données']));
}

// Récupérer l'ID du parc à supprimer
$parkId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($parkId <= 0) {
    echo json_encode(['success' => false, 'error' => 'ID de parc invalide']);
    exit;
}

// Requête de suppression
$sql = "DELETE FROM parc WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['success' => false, 'error' => 'Erreur de préparation de la requête']);
    exit;
}

$stmt->bind_param('i', $parkId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Erreur lors de la suppression du parc']);
}

$stmt->close();
$conn->close();
?>