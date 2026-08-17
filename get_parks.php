<?php

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

// Fonction pour récupérer tous les parcs
function getAllParks($conn) {
    // Requête pour récupérer tous les parcs
    $sql = "SELECT * FROM parc ORDER BY type, nom";
    $result = $conn->query($sql);

    // Vérifier si la requête a réussi
    if ($result === false) {
        die("Erreur lors de l'exécution de la requête : " . $conn->error);
    }

    // Vérifier si des résultats ont été trouvés
    if ($result->num_rows > 0) {
        $parks = [];

        // Récupérer chaque parc et les ajouter dans un tableau
        while ($row = $result->fetch_assoc()) {
            $parks[] = $row;
        }

        return $parks;
    } else {
        return [];
    }
}

// Récupérer tous les parcs
$parks = getAllParks($conn);

// Convertir les parcs en JSON et les envoyer en réponse
echo json_encode($parks);

// Fermer la connexion
$conn->close();
?>
