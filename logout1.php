<?php
session_start();

// Détruire la session complètement
$_SESSION = array();

// Supprimer le cookie de session
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

session_destroy();

// Réponse JSON pour les requêtes AJAX
header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'redirect_url' => 'login.html'
]);
exit();
?>