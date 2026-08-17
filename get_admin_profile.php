<?php
session_start();

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

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$adminId = $_SESSION['user_id'];
$query = "SELECT  nom, email, date_inscription FROM utilisateurs WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $adminId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $adminData = $result->fetch_assoc();
    echo json_encode($adminData);
} else {
    echo json_encode(['error' => 'Administrateur non trouvé']);
}

$stmt->close();
$conn->close();
?>