<?php
header('Content-Type: application/json');

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Récupérer les données POST
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier les données
if (!isset($data['id'])) {
    echo json_encode(['error' => 'ID utilisateur manquant']);
    exit;
}

$userId = (int)$data['id'];

// Établir la connexion
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(['error' => 'Échec de la connexion à la base de données: ' . $conn->connect_error]));
}

try {
    // Commencer une transaction pour plus de sécurité
    $conn->begin_transaction();
    
    // 1. Optionnel: Supprimer d'abord les dépendances (commentaires, réservations, etc.)
    // $stmt = $conn->prepare("DELETE FROM commentaires WHERE user_id = ?");
    // $stmt->bind_param("i", $userId);
    // $stmt->execute();
    
    // 2. Supprimer l'utilisateur
    $stmt = $conn->prepare("DELETE FROM utilisateurs WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    
    // Vérifier si la suppression a réussi
    if ($stmt->affected_rows === 0) {
        throw new Exception("Aucun utilisateur trouvé avec cet ID");
    }
    
    // Valider la transaction
    $conn->commit();
    
    echo json_encode(['success' => true, 'message' => 'Utilisateur supprimé avec succès']);
} catch (Exception $e) {
    // Annuler la transaction en cas d'erreur
    $conn->rollback();
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>