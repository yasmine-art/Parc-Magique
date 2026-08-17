<?php
header('Content-Type: application/json');
session_start();

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['logged_in'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit();
}

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Créer une connexion MySQLi
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de connexion à la base de données']);
    exit();
}

// Récupérer les informations utilisateur
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_SESSION['user_id'];
    
    $query = "SELECT id, nom, email, telephone, date_inscription FROM utilisateurs WHERE id = ?";
    $stmt = $conn->prepare($query);
    
    if ($stmt) {
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'nom' => $user['nom'],
                    'email' => $user['email'],
                    'telephone' => $user['telephone'],
                    'date_inscription' => $user['date_inscription']
                ]
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Utilisateur non trouvé']);
        }
        
        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur de préparation de la requête']);
    }
}

// Changer le mot de passe
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    if ($_POST['action'] === 'change_password') {
        $user_id = $_SESSION['user_id'];
        $current_password = $_POST['current_password'];
        $new_password = $_POST['new_password'];
        $confirm_password = $_POST['confirm_password'];
        
        // Validation
        if ($new_password !== $confirm_password) {
            http_response_code(400);
            echo json_encode(['error' => 'Les nouveaux mots de passe ne correspondent pas']);
            exit();
        }
        
        // Vérifier l'ancien mot de passe
        $query = "SELECT pass FROM utilisateurs WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        if ($current_password === $user['pass']) {
            // Mettre à jour le mot de passe
            $update_query = "UPDATE utilisateurs SET pass = ? WHERE id = ?";
            $update_stmt = $conn->prepare($update_query);
            $update_stmt->bind_param("si", $new_password, $user_id);
            
            if ($update_stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Mot de passe mis à jour avec succès']);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Erreur lors de la mise à jour du mot de passe']);
            }
            
            $update_stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Mot de passe actuel incorrect']);
        }
        
        $stmt->close();
    }
}

// Déconnexion
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
}

$conn->close();
?>