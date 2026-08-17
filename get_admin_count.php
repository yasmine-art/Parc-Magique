<?php
header('Content-Type: application/json');

// Configuration de la connexion
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "parc_magique";

// Créer la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    echo json_encode([
        'error' => 'Échec de la connexion à la base de données: ' . $conn->connect_error
    ]);
    exit();
}

try {
    // Requête pour compter les utilisateurs avec le rôle 'user'
    $sql = "SELECT COUNT(*) as count FROM utilisateurs WHERE role = 'admin'";
    $result = $conn->query($sql);
    
    if ($result === false) {
        throw new Exception("Erreur dans la requête SQL: " . $conn->error);
    }
    
    $row = $result->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'count' => $row['count']
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'error' => 'Erreur: ' . $e->getMessage()
    ]);
} finally {
    // Fermer la connexion
    $conn->close();
}
?>