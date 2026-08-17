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
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'ID ticket manquant']);
    exit;
}

$ticketId = (int)$data['id'];

// Établir la connexion
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['success' => false, 'error' => 'Échec de la connexion à la base de données: ' . $conn->connect_error]));
}

try {
    // Commencer une transaction pour plus de sécurité
    $conn->begin_transaction();
    
    // 1. Optionnel: Supprimer d'abord les dépendances (réservations d'attractions, etc.)
    // $stmt = $conn->prepare("DELETE FROM reservations_attractions WHERE ticket_id = ?");
    // $stmt->bind_param("i", $ticketId);
    // $stmt->execute();
    // Vérifier si c'est une requête DELETE pour supprimer un ticket
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Récupérer les données JSON du corps de la requête
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Vérifier si l'utilisateur est connecté
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Non autorisé']);
        exit;
    }
    
    $user_id = $_SESSION['user_id'];
    $ticket_reference = $data['ticket_reference'] ?? null;
    
    if (!$ticket_reference) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Référence du ticket requise']);
        exit;
    }
    
    try {
        // Préparer et exécuter la requête DELETE
        $query = "DELETE FROM ticket WHERE reference = :reference AND user_id = :user_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':reference', $ticket_reference);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        // Vérifier si des lignes ont été affectées
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Ticket supprimé avec succès']);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Ticket non trouvé ou déjà supprimé']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la suppression: ' . $e->getMessage()]);
    }
    exit;
} 
  
?>