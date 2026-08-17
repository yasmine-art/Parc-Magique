<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Récupérer les données POST
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier les données
if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Tous les champs sont obligatoires']);
    exit;
}

$name = trim($data['name']);
$email = trim($data['email']);
$password1 = $data['password'];

// Validation des données
if (empty($name)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Le nom ne peut pas être vide']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email invalide']);
    exit;
}

if (strlen($password1) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Le mot de passe doit contenir au moins 6 caractères']);
    exit;
}

// Établir la connexion
try {
    $conn = new mysqli($host, $username, $password, $dbname);
    
    // Vérifier la connexion
    if ($conn->connect_error) {
        throw new Exception('Échec de la connexion à la base de données: ' . $conn->connect_error);
    }

    // Commencer une transaction
    $conn->begin_transaction();

    // 1. Vérifier si l'email existe déjà
    $checkStmt = $conn->prepare("SELECT id FROM utilisateurs WHERE email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'error' => 'Cet email est déjà utilisé']);
        exit;
    }
    
    // 2. Ajouter dans la table utilisateurs
    $userStmt = $conn->prepare("INSERT INTO utilisateurs (nom, email, pass, role) VALUES (?, ?, ?, 'admin')");
    $userStmt->bind_param("sss", $name, $email, $password1);
    $userStmt->execute();
    
    if ($userStmt->affected_rows === 0) {
        throw new Exception("Erreur lors de l'ajout dans la table utilisateurs");
    }
    
    $user_id = $userStmt->insert_id;
    
    // 3. Ajouter dans la table admin
    $adminStmt = $conn->prepare("INSERT INTO admin (id, nom, email, pass, role, date_inscription) 
                               VALUES (?, ?, ?, ?, 'admin', NOW())");
    $adminStmt->bind_param("isss", $user_id, $name, $email, $password1);
    $adminStmt->execute();
    
    if ($adminStmt->affected_rows === 0) {
        $conn->rollback();
        throw new Exception("Erreur lors de l'ajout dans la table admin");
    }
    
    // Tout s'est bien passé, valider la transaction
    $conn->commit();
    
    http_response_code(201);
    echo json_encode([
        'success' => true, 
        'message' => 'Administrateur ajouté avec succès dans les deux tables',
        'user_id' => $user_id,
        'admin_info' => [
            'nom' => $name,
            'email' => $email,
            'role' => 'admin',
            'date_inscription' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    // En cas d'erreur, annuler les changements
    if (isset($conn)) $conn->rollback();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    // Fermer toutes les connexions
    if (isset($checkStmt)) $checkStmt->close();
    if (isset($userStmt)) $userStmt->close();
    if (isset($adminStmt)) $adminStmt->close();
    if (isset($conn)) $conn->close();
}

?>