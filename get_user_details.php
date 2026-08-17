<?php
header('Content-Type: application/json');

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Vérifier l'ID utilisateur
if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'ID utilisateur manquant']);
    exit;
}

$userId = (int)$_GET['id'];

// Établir la connexion
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(['error' => 'Échec de la connexion à la base de données: ' . $conn->connect_error]));
}

try {
    // Requête préparée pour la sécurité
    $stmt = $conn->prepare("SELECT * FROM utilisateurs WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("Utilisateur non trouvé");
    }
    
    $user = $result->fetch_assoc();
    echo json_encode($user);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    $stmt->close();
    $conn->close();
}
?>