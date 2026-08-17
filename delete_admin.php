<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Récupérer les données DELETE
$data = json_decode(file_get_contents('php://input'), true);

// Vérifier les données
if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'ID administrateur manquant']);
    exit;
}

$adminId = (int)$data['id'];

// Établir la connexion
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Échec de la connexion à la base de données: ' . $conn->connect_error]));
}

try {
    // Commencer une transaction
    $conn->begin_transaction();

    // 1. Vérifier si c'est bien un admin
    $checkStmt = $conn->prepare("SELECT role FROM utilisateurs WHERE id = ?");
    $checkStmt->bind_param("i", $adminId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    if ($checkResult->num_rows === 0) {
        throw new Exception("Administrateur non trouvé");
    }
    
    $user = $checkResult->fetch_assoc();
    if ($user['role'] !== 'admin') {
        throw new Exception("Cet utilisateur n'est pas un administrateur");
    }
    
    // 2. D'abord supprimer de la table admin
    $deleteAdminStmt = $conn->prepare("DELETE FROM admin WHERE id = ?");
    $deleteAdminStmt->bind_param("i", $adminId);
    $deleteAdminStmt->execute();
    
    // 3. Ensuite supprimer de la table utilisateurs
    $deleteUserStmt = $conn->prepare("DELETE FROM utilisateurs WHERE id = ?");
    $deleteUserStmt->bind_param("i", $adminId);
    $deleteUserStmt->execute();
    
    if ($deleteUserStmt->affected_rows === 0) {
        throw new Exception("Aucun administrateur supprimé");
    }
    
    // Valider la transaction si tout s'est bien passé
    $conn->commit();
    
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Administrateur supprimé avec succès']);
} catch (Exception $e) {
    // Annuler la transaction en cas d'erreur
    $conn->rollback();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if (isset($checkStmt)) $checkStmt->close();
    if (isset($deleteAdminStmt)) $deleteAdminStmt->close();
    if (isset($deleteUserStmt)) $deleteUserStmt->close();
    $conn->close();
}
?>