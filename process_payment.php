<?php
session_start();

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Erreur de connexion: " . $conn->connect_error]));
}

if (!isset($_SESSION['user_id'])) {
    die(json_encode(['success' => false, 'message' => "Utilisateur non connecté"]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    die(json_encode(['success' => false, 'message' => "Données invalides"]));
}

try {
    $conn->begin_transaction();
    
    // 1. Enregistrement du paiement principal
    $query = "INSERT INTO paiements (
                user_id, 
                park_title,
                date_visite, 
                montant, 
                mode_paiement, 
                statut_paiement, 
                date_paiement
              ) VALUES (?,?, ?, ?, ?, ?, NOW())";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) throw new Exception("Erreur préparation requête: " . $conn->error);
    
    $statut = ($data['mode_paiement'] === 'en_ligne') ? 'paye' : 'a_payer';
    $stmt->bind_param("issdss", $_SESSION['user_id'], $data['park_title'], $data['date_visite'], $data['montant'], 
                     $data['mode_paiement'], $statut);
    
    if (!$stmt->execute()) throw new Exception("Erreur exécution: " . $stmt->error);
    
    $paiement_id = $stmt->insert_id;
    $stmt->close();
    
    // 2. Enregistrement des attractions
    $attractions_ids = [];
    if (!empty($data['panier'])) {
        $queryAttraction = "INSERT INTO attraction (
                            paiement_id, 
                            user_id, 
                            nom_attraction, 
                            prix, 
                            quantite
                          ) VALUES (?, ?, ?, ?, ?)";
        
        $stmtAttraction = $conn->prepare($queryAttraction);
        if (!$stmtAttraction) throw new Exception("Erreur préparation attraction: " . $conn->error);
        
        foreach ($data['panier'] as $item) {
            $stmtAttraction->bind_param("iisdi", $paiement_id, $_SESSION['user_id'], 
                                      $item['name'], $item['price'], $item['quantity']);
            if (!$stmtAttraction->execute()) throw new Exception("Erreur enregistrement attraction: " . $stmtAttraction->error);
            $attractions_ids[] = $conn->insert_id;
        }
        $stmtAttraction->close();
    }
    
    $conn->commit();
    
    // Récupération infos utilisateur
    $queryUser = "SELECT nom, email FROM utilisateurs WHERE id = ?";
    $stmtUser = $conn->prepare($queryUser);
    $stmtUser->bind_param("i", $_SESSION['user_id']);
    $stmtUser->execute();
    $userInfo = $stmtUser->get_result()->fetch_assoc();
    $stmtUser->close();
    
    // Insertion dans la table ticket avec le téléphone
    if (!empty($data['panier'])) {
        $reference = 'PM-' . str_pad($paiement_id, 6, '0', STR_PAD_LEFT);
        $queryTicket = "INSERT INTO ticket (
                        paiement_id,
                        user_id, 
                        park_title,
                        reference, 
                        nom_client, 
                        email_client, 
                        date_visite, 
                        nom_attraction, 
                        prix_attraction, 
                        quantite,
                        statut_paiement
                      ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
        
        $stmtTicket = $conn->prepare($queryTicket);
        if (!$stmtTicket) throw new Exception("Erreur préparation ticket: " . $conn->error);
        
        foreach ($data['panier'] as $item) {
            $stmtTicket->bind_param("iissssssdis", 
                                  $paiement_id, 
                                  $_SESSION['user_id'], 
                                  $data['park_title'],
                                  $reference,
                                  $userInfo['nom'], 
                                  $userInfo['email'], 
                                  $data['date_visite'],
                                  $item['name'], 
                                  $item['price'], 
                                  $item['quantity'],
                                  $statut);
            if (!$stmtTicket->execute()) throw new Exception("Erreur enregistrement ticket: " . $stmtTicket->error);
        }
        $stmtTicket->close();
    }
    
    $conn->close();
    
    echo json_encode([
        'success' => true,
        'message' => 'Paiement et attractions enregistrés',
        'reference' => 'PM-' . str_pad($paiement_id, 6, '0', STR_PAD_LEFT),
        'attractions_ids' => $attractions_ids,
        'data' => [
            'nom' => $userInfo['nom'],
            'email' => $userInfo['email'],
            'date_visite' => $data['date_visite'],
            'mode_paiement' => $data['mode_paiement'],
            'statut_paiement'=> $statut
        ]
    ]);
    
} catch (Exception $e) {
    $conn->rollback();
    $conn->close();
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>