<?php
header('Content-Type: application/json');
session_start();

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Récupérer la référence du ticket depuis la requête
    $reference = isset($_GET['reference']) ? $_GET['reference'] : '';
    
    if (empty($reference)) {
        throw new Exception("Référence de ticket invalide");
    }
    
    // Requête pour récupérer les détails du ticket
    $query = "SELECT * FROM ticket WHERE reference = :reference";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':reference', $reference, PDO::PARAM_STR);
    $stmt->execute();
    
    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($tickets)) {
        throw new Exception("Ticket non trouvé");
    }
    
    // Grouper les attractions
    $groupedTicket = [
        'reference' => $tickets[0]['reference'],
        'nom_client' => $tickets[0]['nom_client'],
        'email_client' => $tickets[0]['email_client'],
        'date_visite' => $tickets[0]['date_visite'],
        'date_emission' => $tickets[0]['date_emission'],
        'statut_paiement' => $tickets[0]['statut_paiement'],
        'attractions' => []
    ];
    
    foreach ($tickets as $ticket) {
        $groupedTicket['attractions'][] = [
            'nom_attraction' => $ticket['nom_attraction'],
            'prix_attraction' => $ticket['prix_attraction'],
            'quantite' => $ticket['quantite']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'ticket' => $groupedTicket
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>