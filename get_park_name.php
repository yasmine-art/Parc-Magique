<?php
header('Content-Type: application/json');

// Configuration de la base de données
$host = 'localhost';
$db   = 'votre_base';
$user = 'utilisateur';
$pass = 'motdepasse';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    $stmt = $pdo->query("SELECT id, nom FROM parc");
    $parks = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'parks' => $parks
    ]);
} catch (\PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur de base de données: ' . $e->getMessage()
    ]);
}
?>