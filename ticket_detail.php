<?php
session_start();

// Configuration de la base de données
$host = 'localhost';
$dbname = 'parc_magique';
$username = 'root';
$password = '';

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

// Vérifier si l'ID du ticket est présent dans l'URL
if (!isset($_GET['id'])) {
    header("Location: history.php");
    exit();
}

$ticket_id = $_GET['id'];
$user_id = $_SESSION['user_id'];

try {
    // Connexion à la base de données
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Requête pour récupérer les détails du ticket
    $query = "SELECT * WHERE :user_id";
    
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':ticket_id', $ticket_id, PDO::PARAM_STR);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();

    $ticket_items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($ticket_items)) {
        header("Location: history.php?error=ticket_not_found");
        exit();
    }

    // Calculer le total et préparer les données
    $total = 0;
    $attractions = [];
    $ticket_data = [
        'reference' => $ticket_items[0]['reference'],
        'nom_client' => $ticket_items[0]['nom_client'],
        'email_client' => $ticket_items[0]['email_client'],
        'date_emission' => $ticket_items[0]['date_emission'],
        'date_visite' => $ticket_items[0]['date_visite'],
        'statut_paiement' => $ticket_items[0]['statut_paiement']
    ];

    foreach ($ticket_items as $item) {
        $total += $item['attraction_prix'] * $item['quantite'];
        $attractions[] = [
            'nom' => $item['attraction_nom'],
            'description' => $item['attraction_description'],
            'prix' => $item['attraction_prix'],
            'quantite' => $item['quantite'],
            'image' => $item['attraction_image']
        ];
    }

    // Déterminer le statut en fonction de la date
    $today = new DateTime();
    $visit_date = new DateTime($ticket_data['date_visite']);
    $status = ($ticket_data['statut_paiement'] !== 'Payé') ? 'Annulé' : 
              ($visit_date > $today ? 'À venir' : 'Utilisé');

} catch (PDOException $e) {
    die("Erreur de base de données : " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détails du Ticket #<?= $ticket_data['reference'] ?> - Parc Magique</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: mistyrose;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            padding: 30px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #b36572;
        }
        
        .ticket-title {
            color: #b36572;
            margin: 0;
        }
        
        .status-badge {
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-upcoming {
            background: #4CAF50;
            color: white;
        }
        
        .status-used {
            background: #2196F3;
            color: white;
        }
        
        .status-cancelled {
            background: #f44336;
            color: white;
        }
        
        .client-info, .ticket-info {
            margin-bottom: 30px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .info-item {
            margin-bottom: 10px;
        }
        
        .info-label {
            font-weight: bold;
            color: #b36572;
            margin-right: 10px;
        }
        
        .attractions-list {
            margin-top: 30px;
        }
        
        .attraction-card {
            display: flex;
            margin-bottom: 20px;
            padding: 15px;
            border-radius: 8px;
            background: #f9f9f9;
            align-items: center;
        }
        
        .attraction-image {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 5px;
            margin-right: 20px;
        }
        
        .attraction-details {
            flex-grow: 1;
        }
        
        .attraction-name {
            font-weight: bold;
            margin-bottom: 5px;
            color: #b36572;
        }
        
        .attraction-price {
            font-weight: bold;
        }
        
        .total-section {
            text-align: right;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #b36572;
            font-size: 1.2em;
            font-weight: bold;
        }
        
        .actions {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
            gap: 15px;
        }
        
        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .btn-print {
            background: #b36572;
            color: white;
        }
        
        .btn-print:hover {
            background: #9a5460;
        }
        
        .btn-back {
            background: #f8f9fa;
            border: 1px solid #b36572;
            color: #b36572;
        }
        
        .btn-back:hover {
            background: #b36572;
            color: white;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 15px;
            }
            
            .header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .status-badge {
                margin-top: 10px;
            }
            
            .attraction-card {
                flex-direction: column;
                text-align: center;
            }
            
            .attraction-image {
                margin-right: 0;
                margin-bottom: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="ticket-title">Ticket #<?= $ticket_data['reference'] ?></h1>
            <span class="status-badge status-<?= strtolower(str_replace(' ', '-', $status)) ?>">
                <?= $status ?>
            </span>
        </div>
        
        <div class="client-info">
            <h2>Informations client</h2>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Nom:</span>
                    <?= htmlspecialchars($ticket_data['nom_client']) ?>
                </div>
                <div class="info-item">
                    <span class="info-label">Email:</span>
                    <?= htmlspecialchars($ticket_data['email_client']) ?>
                </div>
            </div>
        </div>
        
        <div class="ticket-info">
            <h2>Informations du ticket</h2>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Date d'émission:</span>
                    <?= date('d/m/Y H:i', strtotime($ticket_data['date_emission'])) ?>
                </div>
                <div class="info-item">
                    <span class="info-label">Date de visite:</span>
                    <?= date('d/m/Y', strtotime($ticket_data['date_visite'])) ?>
                </div>
                <div class="info-item">
                    <span class="info-label">Statut paiement:</span>
                    <?= htmlspecialchars($ticket_data['statut_paiement']) ?>
                </div>
            </div>
        </div>
        
        <div class="attractions-list">
            <h2>Attractions réservées</h2>
            <?php foreach ($attractions as $attraction): ?>
                <div class="attraction-card">
                    <img src="<?= htmlspecialchars($attraction['image']) ?>" alt="<?= htmlspecialchars($attraction['nom']) ?>" class="attraction-image">
                    <div class="attraction-details">
                        <div class="attraction-name"><?= htmlspecialchars($attraction['nom']) ?></div>
                        <div class="attraction-description"><?= htmlspecialchars($attraction['description']) ?></div>
                        <div class="attraction-price">
                            <?= number_format($attraction['prix'], 2) ?> DA × <?= $attraction['quantite'] ?> = 
                            <?= number_format($attraction['prix'] * $attraction['quantite'], 2) ?> DA
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        
        <div class="total-section">
            Total: <?= number_format($total, 2) ?> DA
        </div>
        
        <div class="actions">
            <button class="btn btn-back" onclick="window.history.back()">
                <i class="fas fa-arrow-left"></i> Retour
            </button>
            <button class="btn btn-print" onclick="window.print()">
                <i class="fas fa-print"></i> Imprimer
            </button>
        </div>
    </div>
</body>
</html>