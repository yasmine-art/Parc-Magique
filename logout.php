<?php
session_start();

// Détruire la session
session_destroy();

// Rediriger vers la page d'accueil avec script pour nettoyer le localStorage
echo "<script>
        localStorage.removeItem('userData');
        window.location.href = 'exple.html';
      </script>";
exit();
?>