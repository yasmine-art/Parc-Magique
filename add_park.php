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

// Récupérer les données du formulaire
$name = $conn->real_escape_string($_POST['name'] ?? '');
$type = $conn->real_escape_string($_POST['type'] ?? '');
$image = $conn->real_escape_string($_POST['image'] ?? '');
$link = $conn->real_escape_string($_POST['link'] ?? '');

// Validation des données
if (empty($name) || empty($type) || empty($image) || empty($link)) {
    echo json_encode(['success' => false, 'error' => 'Tous les champs sont obligatoires']);
    exit;
}

// Requête d'insertion
$sql = "INSERT INTO parc (nom, type, image, lien) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo json_encode(['success' => false, 'error' => 'Erreur de préparation de la requête']);
    exit;
}

$stmt->bind_param('ssss', $name, $type, $image, $link);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'exécution de la requête']);
}

$stmt->close();
$conn->close();
?>