<?php
session_start();

$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Erreur de connexion à la base de données: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom_complet = htmlspecialchars(trim($_POST['nom']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $mot_de_passe = $_POST['pass'];
    $confirm_password = $_POST['confirm-password'];
    $date_inscription = date('Y-m-d H:i:s'); // Date actuelle au format MySQL
    $role = 'user'; // Rôle par défaut

    $errors = [];

    // Validation des champs
    if (empty($nom_complet)) {
        $errors[] = "Le nom complet est requis.";
    } elseif (strlen($nom_complet) < 3) {
        $errors[] = "Le nom complet doit contenir au moins 3 caractères.";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "L'adresse email n'est pas valide.";
    }

    if (strlen($mot_de_passe) < 8) {
        $errors[] = "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if ($mot_de_passe !== $confirm_password) {
        $errors[] = "Les mots de passe ne correspondent pas.";
    }

    // Vérification si l'email existe déjà dans utilisateurs OU clients
    $check_email = $conn->prepare("SELECT id FROM utilisateurs WHERE email = ? UNION SELECT id FROM clients WHERE email = ?");
    $check_email->bind_param("ss", $email, $email);
    $check_email->execute();
    $check_email->store_result();

    if ($check_email->num_rows > 0) {
        $errors[] = "Cet email est déjà utilisé.";
    }
    $check_email->close();

    if (empty($errors)) {
        // Commencer une transaction pour s'assurer que les deux insertions réussissent
        $conn->begin_transaction();

        try {
            // Insertion dans la table utilisateurs
            $sql_user = "INSERT INTO utilisateurs (nom, email, pass, date_inscription) VALUES (?, ?, ?, ?)";
            $stmt_user = $conn->prepare($sql_user);
            $stmt_user->bind_param("ssss", $nom_complet, $email, $mot_de_passe, $date_inscription);
            $stmt_user->execute();
            $user_id = $stmt_user->insert_id;
            $stmt_user->close();

            // Insertion dans la table clients
            $sql_client = "INSERT INTO clients (user_id, nom, email, role, date_inscription) VALUES (?, ?, ?, ?, ?)";
            $stmt_client = $conn->prepare($sql_client);
            $stmt_client->bind_param("issss", $user_id, $nom_complet, $email, $role, $date_inscription);
            $stmt_client->execute();
            $stmt_client->close();

            // Valider la transaction si tout s'est bien passé
            $conn->commit();

            // Mettre en session
            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_email'] = $email;
            $_SESSION['user_nom'] = $nom_complet;
            $_SESSION['logged_in'] = true;
            $_SESSION['user_role'] = $role;
          
            // Stocker dans localStorage
            $userData = [
                'id' => $user_id,
                'email' => $email,
                'nom' => $nom_complet,
                'date_inscription' => $date_inscription,
                'role' => $role
            ];
            
            echo "<script>
                    localStorage.setItem('userData', '".json_encode($userData)."');
                    window.location.href = 'exple.html';
                  </script>";
            exit();

        } catch (Exception $e) {
            // Annuler la transaction en cas d'erreur
            $conn->rollback();
            $errors[] = "Erreur lors de l'inscription: " . $e->getMessage();
        }
    }

    if (!empty($errors)) {
        echo "<script>";
        foreach ($errors as $error) {
            echo "alert('".addslashes($error)."');";
        }
        echo "window.history.back();";
        echo "</script>";
        exit();
    }
}

$conn->close();
?> 