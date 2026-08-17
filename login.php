<?php
session_start();

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Créer une connexion MySQLi
$conn = new mysqli($host, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Erreur de connexion à la base de données : " . $conn->connect_error);
}

// Vérifier si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Valider et nettoyer les entrées
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = $_POST['pass'];

    // Vérifier que l'email est valide
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: login.html?error=invalid_email");
        exit();
    }

    // Requête préparée pour récupérer le rôle
    $query = "SELECT id, nom, email, pass, role FROM utilisateurs WHERE email = ?";
    $stmt = $conn->prepare($query);

    if ($stmt) {
        // Lier les paramètres
        $stmt->bind_param("s", $email);

        // Exécuter la requête
        $stmt->execute();

        // Récupérer le résultat
        $result = $stmt->get_result();

        // Vérifier si l'utilisateur existe
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            // Vérifier le mot de passe (version simplifiée - à remplacer par password_verify en production)
            if ($password === $user['pass']) {
                // Démarrer la session utilisateur
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_nom'] = $user['nom'];
                $_SESSION['user_role'] = $user['role'];
                $_SESSION['user_date_inscription'] = $user['date_inscription'];
                $_SESSION['logged_in'] = true;

                // Préparer les données pour le localStorage
                $userData = json_encode([
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'nom' => $user['nom'],
                    'date_inscription' => $user['date_inscription'],
                    'role' => $user['role']
                ]);

                // Redirection selon le rôle
                if ($user['role'] === 'admin') {
                    echo "<script>
                            localStorage.setItem('userData', '".addslashes($userData)."');
                            window.location.href = 'administrateur.html';
                          </script>";
                } else {
                    echo "<script>
                            localStorage.setItem('userData', '".addslashes($userData)."');
                            window.location.href = 'exple.html';
                          </script>";
                }
                exit();
            } else {
                // Mot de passe incorrect
                header("Location: login.html?error=wrong_password");
                exit();
            }
        } else {
            // Utilisateur non trouvé
            header("Location: login.html?error=user_not_found");
            exit();
        }

        // Fermer le statement
        $stmt->close();
    } else {
        die("Erreur lors de la préparation de la requête : " . $conn->error);
    }
}

// Fermer la connexion
$conn->close();
?>  