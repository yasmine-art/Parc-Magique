<?php
session_start();
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

try {
    // Vérifier si l'utilisateur est connecté
    if (!isset($_SESSION['user_id'])) {
        throw new Exception("Utilisateur non connecté");
    }

    $user_id = $_SESSION['user_id'];

    // Connexion à la base de données
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Gérer la méthode DELETE
    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $input = json_decode(file_get_contents('php://input'), true);
        $reference = $input['ticket_id'] ?? null;

        if (!$reference) {
            throw new Exception("ID de ticket manquant");
        }

        // Supprimer le ticket
        $stmt = $conn->prepare("DELETE FROM ticket WHERE reference = :reference AND user_id = :user_id");
        $stmt->bindParam(':reference', $reference, PDO::PARAM_STR);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Ticket supprimé avec succès']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ticket non trouvé ou déjà supprimé']);
        }
        exit;
    }

    // Le reste de votre code pour GET reste inchangé...
    // Requête pour récupérer les tickets de l'utilisateur
    $query = "SELECT * FROM ticket WHERE user_id = :user_id ORDER by date_emission DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($tickets)) {
        echo json_encode(['success' => true, 'tickets' => []]);
        exit;
    }

    // Grouper les tickets par référence
    $groupedTickets = [];
    foreach ($tickets as $ticket) {
        $reference = $ticket['reference'];
        
        if (!isset($groupedTickets[$reference])) {
            $groupedTickets[$reference] = [
                'id' => $reference,
                'park_title' => $ticket['park_title'],
                'name' => $ticket['nom_client'],
                'email' => $ticket['email_client'],
                'visitDate' => $ticket['date_visite'],
                'emissionDate' => $ticket['date_emission'],
                'statut' => $ticket['statut_paiement'],
                'attractions' => [],
                'total' => 0
            ];
        }
        
        $groupedTickets[$reference]['attractions'][] = [
            'nom_attraction' => $ticket['nom_attraction'],
            'prix_attraction' => (float)$ticket['prix_attraction'],
            'quantite' => (int)$ticket['quantite']
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

  // Ajouter l'attraction et calculer le total
      /*  $groupedTickets[$reference]['attractions'][] = [
            'name' => $ticket['nom_attraction'],
            'price' => $ticket['prix_attraction'],
            'quantity' => $ticket['quantite']
        ];*/






/*header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// Connexion à la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupérer l'email du client depuis la requête (vous devrez le passer depuis le frontend)
    $email = $_GET['email'] ?? '';

    if (empty($email)) {
        throw new Exception("Email client requis");
    }

    // Requête pour récupérer les tickets groupés par référence
    $query = "SELECT * FROM ticket WHERE email_client = :email ORDER BY date_emission DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->execute();

    $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($tickets)) {
        echo json_encode(['success' => true, 'tickets' => []]);
        exit;
    }

    // Grouper les tickets par référence
    $groupedTickets = [];
    foreach ($tickets as $ticket) {
        $reference = $ticket['reference'];
        if (!isset($groupedTickets[$reference])) {
            $groupedTickets[$reference] = [
                'id' => $reference,
                'parkName' => 'Parc Magique',// ou récupérez depuis la DB si disponible
                'name' => $ticket['nom_client'],
                'email' => $ticket['email_client'],
                'visitDate' => $ticket['date_visite'],
                'emissionDate' => $ticket['date_emission'],
                'status' => $ticket['statut_paiement'] === 'Payé' ? 'upcoming' : 'cancelled',
                'total' => 0,
                'attractions' => []
            ];
        }
        
        // Ajouter l'attraction et calculer le total
        $groupedTickets[$reference]['attractions'][] = [
            'name' => $ticket['nom_attraction'],
            'price' => $ticket['prix_attraction'],
            'quantity' => $ticket['quantite']
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
} */