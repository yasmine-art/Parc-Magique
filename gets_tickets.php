<?php
// get_tickets.php
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

$user_id = $_SESSION['user_id'];

try {
    // Récupérer les tickets de l'utilisateur
    $query = "SELECT * FROM ticket WHERE user_id=?";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) throw new Exception("Erreur préparation requête: " . $conn->error);
    
    $stmt->bind_param("i", $user_id);
    if (!$stmt->execute()) throw new Exception("Erreur exécution: " . $stmt->error);
    
    $result = $stmt->get_result();
    $tickets = [];
    
    while ($row = $result->fetch_assoc()) {
        $tickets[] = [
            'id' => $row['id'],
            'reference' => $row['reference'],
            'nom_client' => $row['nom_client'],
            'email_client' => $row['email_client'],
            'date_visite' => $row['date_visite'],
            'nom_attraction' => $row['nom_attraction'],
            'prix_attraction' => $row['prix_attraction'],
            'quantite' => $row['quantite'],
            'date_emission' => $row['date_emission'],
            'mode_paiement' => $row['mode_paiement'],
            'statut_paiement' => $row['statut_paiement']
        ];
    }
    
    $stmt->close();
    $conn->close();
    
    echo json_encode([
        'success' => true,
        'tickets' => $tickets
    ]);
    
} catch (Exception $e) {
    $conn->close();
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>