<?php
session_start();
header('Content-Type: application/json');

// Vérification de l'authentification
if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non autorisé']);
    exit;
}
// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Établir la connexion
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(['error' => 'Échec de la connexion à la base de données: ' . $conn->connect_error]));
}

$data = json_decode(file_get_contents('php://input'), true);

// Validation des données
if (empty($data['current_password']) || empty($data['new_password']) || strlen($data['new_password']) < 8) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Le mot de passe doit contenir au moins 8 caractères']);
    exit;
}

if ($data['new_password'] !== $data['confirm_password']) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Les mots de passe ne correspondent pas']);
    exit;
}

$adminId = $_SESSION['user_id'];
$currentPassword = $data['current_password'];
$newPassword = $data['new_password'];

try {
    // 1. Vérifiez le mot de passe actuel
    $checkStmt = $conn->prepare("SELECT pass FROM utilisateurs WHERE id = ?");
    $checkStmt->bind_param("i", $adminId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("Administrateur non trouvé");
    }

    $admin = $result->fetch_assoc();
    
    if (!password_verify($currentPassword, $admin['pass'])) {
        throw new Exception("Mot de passe actuel incorrect");
    }


    // 3. Mise à jour du mot de passe
    $updateStmt = $conn->prepare("UPDATE utilisateurs SET pass = ? WHERE id = ?");
    $updateStmt->bind_param("si", $Password, $adminId);
    $updateStmt->execute();

    if ($updateStmt->affected_rows === 0) {
        throw new Exception("Échec de la mise à jour du mot de passe");
    }

    echo json_encode(['success' => true, 'message' => 'Mot de passe changé avec succès']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    if (isset($checkStmt)) $checkStmt->close();
    if (isset($updateStmt)) $updateStmt->close();
    $conn->close();
}
?>