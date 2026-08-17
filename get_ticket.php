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

try {
    // Récupérer tous les tickets groupés par référence
    $query = "SELECT * FROM ticket ORDER BY date_emission DESC";
    $result = $conn->query($query);
    $tickets = $result->fetch_all(MYSQLI_ASSOC);
    
    if (empty($tickets)) {
        die(json_encode(['success' => false, 'message' => "Aucun ticket trouvé"]));
    }
    
    // Grouper les tickets par référence
    $groupedTickets = [];
    foreach ($tickets as $ticket) {
        $reference = $ticket['reference'];
        if (!isset($groupedTickets[$reference])) {
            $groupedTickets[$reference] = [
                'reference' => $reference,
                'nom_client' => $ticket['nom_client'],
                'email_client' => $ticket['email_client'],
                'date_visite' => $ticket['date_visite'],
                'date_emission' => $ticket['date_emission'],
                'statut_paiement' => $ticket['statut_paiement'],
                'attractions' => [],
                'total' => 0
            ];
        }
        
        $groupedTickets[$reference]['attractions'][] = [
            'nom_attraction' => $ticket['nom_attraction'],
            'prix_attraction' => $ticket['prix_attraction'],
            'quantite' => $ticket['quantite']
        ];
        
        $groupedTickets[$reference]['total'] += $ticket['prix_attraction'] * $ticket['quantite'];
    }
    
    echo json_encode([
        'success' => true,
        'tickets' => array_values($groupedTickets)
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>