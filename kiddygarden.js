document.addEventListener("DOMContentLoaded", function () {
    // 1. Stocker le titre du parc pour l'affichage du ticket
    const parkTitle = document.querySelector("header h1").textContent;
    localStorage.setItem("parkTitle", parkTitle);

    // 2. Bouton retour en haut de la page
    // Afficher le bouton lorsqu'on défile vers le bas
const backToTopButton = document.getElementById('to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
        backToTopButton.style.display = 'flex'; // Afficher le bouton
    } else {
        backToTopButton.style.display = 'none'; // Cacher le bouton
    }
});
const toTopButton = document.getElementById('to-top');
toTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

    // 3. Affichage/masquage des détails des jeux
    document.querySelectorAll('.toggle-game').forEach(title => {
        title.addEventListener('click', function () {
            const gameDetails = this.nextElementSibling;
            gameDetails.style.display = (gameDetails.style.display === 'none' || !gameDetails.style.display) ? 'grid' : 'none';
        });
    });

    // 4. Gestion de la modal pour images et vidéos
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    const closeBtn = document.querySelector('.close');

    document.querySelectorAll('.game img, .game video').forEach(item => {
        item.addEventListener('click', () => {
            if (item.tagName === 'IMG') {
                modalImg.src = item.src;
                modalImg.style.display = 'block';
                modalVideo.style.display = 'none';
            } else {
                modalVideo.src = item.src;
                modalVideo.style.display = 'block';
                modalImg.style.display = 'none';
            }
            modal.style.display = 'block';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            modalVideo.pause();
        });
    }

    window.addEventListener('click', event => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modalVideo.pause();
        }
    });

    // 5. Gestion du panier
    const panier = [];
    const panierList = document.getElementById('panier-list');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const panierCircle = document.getElementById('panier-circle');
    const modalOverlay = document.getElementById('modal-overlay');
    const panierDetails = document.getElementById('panier-details');
    const closeModal = document.getElementById('close-modal');

    // Ajouter des jeux au panier
    document.querySelectorAll('.game').forEach(game => {
        let quantityElement = game.querySelector(".quantity");
        let quantity = 1;

        game.querySelector(".quantity-plus")?.addEventListener("click", () => {
            quantity++;
            quantityElement.textContent = quantity;
        });

        game.querySelector(".quantity-minus")?.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
            }
        });

        game.querySelector(".add-to-cart")?.addEventListener("click", () => {
            let gameName = game.querySelector("h3").textContent;
            let price = parseInt(game.querySelector("p").textContent.replace("Prix : ", "").replace(" DA", ""));
            addToCart(gameName, price, quantity);
            quantity = 1;
            quantityElement.textContent = quantity;
        });
    });

    function addToCart(name, price, quantity) {
        let existingGame = panier.find(item => item.name === name);
        if (existingGame) {
            existingGame.quantity += quantity;
        } else {
            panier.push({ name, price, quantity });
        }
        showAlert({
            type: 'success',
            title: 'Ajouté au panier',
            message: `${name} a été ajouté à votre panier`,
            duration: 2000
          });
        updatePanier();
    }

    function updatePanier() {
        panierList.innerHTML = '';
        let total = 0;
    
        if (panier.length === 0) {
            panierList.innerHTML = '<li>Votre panier est vide</li>';
            totalPriceElement.textContent = "Total: 0 DA";
        } else {
            panier.forEach((item, index) => {
                let li = document.createElement('li');
                li.style.display = 'flex'; // Ajout flex pour alignement
                li.style.justifyContent = 'space-between'; // Espacement entre éléments
                li.style.alignItems = 'center'; // Centrage vertical
                li.style.padding = '10px 0'; // Espacement interne
                li.style.borderBottom = '1px solid #eee'; // Séparation visuelle
                
                // Conteneur texte
                let textContainer = document.createElement('div');
                textContainer.textContent = `${item.name} x${item.quantity} - ${item.price * item.quantity} DA`;
                
                // Bouton suppression
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = `<img src="images/poubelle.png" alt="Supprimer" width="16" height="16">`;
                deleteButton.classList.add('delete-button');
                deleteButton.style.marginLeft = '20px'; // Espacement supplémentaire
                deleteButton.addEventListener('click', () => {
                    panier.splice(index, 1);
                    updatePanier();
                });
    
                li.appendChild(textContainer);
                li.appendChild(deleteButton);
                panierList.appendChild(li);
    
                total += item.price * item.quantity;
            });
            totalPriceElement.textContent = `Total: ${total} DA`;
        }
    }

    panierCircle?.addEventListener('click', () => {
        modalOverlay.classList.add("visible");
        panierDetails.classList.add("visible");
        modalOverlay.style.display = "flex";
    });

    closeModal?.addEventListener('click', () => {
        modalOverlay.classList.remove("visible");
        panierDetails.classList.remove("visible");
        setTimeout(() => { modalOverlay.style.display = "none"; }, 300);
    });

    modalOverlay?.addEventListener("click", (event) => {
        if (event.target === modalOverlay) {
            modalOverlay.classList.remove("visible");
            panierDetails.classList.remove("visible");
            setTimeout(() => { modalOverlay.style.display = "none"; }, 300);
        }
    });

    checkoutButton?.addEventListener('click', () => {
        if (panier.length === 0) {
            showAlert({
                type: 'error',
                title: 'Panier vide',
                message: 'Votre panier est vide !',
                duration: 3000
                
              });
              
            return;

        }
    
        // Vérifier si l'utilisateur est connecté
        const userData = localStorage.getItem('userData');
        
        if (!userData) {
            // Utilisateur non connecté
            showAlert({
                type: 'warning',          // Type "warning" (couleur orange)
                title: 'Connexion requise',
                message: 'Vous devez vous connecter avant de passer au paiement.',
                duration: 4000,           // 4 secondes
                closable: true            // Permet de fermer manuellement
              });
            setTimeout(() => {
                window.location.href = 'login.html'; // Rediriger vers la page de connexion
            }
            , 4000); // 4 secondes avant la redirection
                 // Rediriger vers la page de connexion après 4 secondes
            return;
        }
    
        // Utilisateur connecté - procéder au paiement
        const total = panier.reduce((sum, item) => sum + item.price * item.quantity, 0);
        localStorage.setItem('panier', JSON.stringify(panier));
        localStorage.setItem('totalPanier', total);
        window.location.href = 'payment-page.html';
    });

    // 6. Filtrage des jeux par catégorie
    document.querySelectorAll(".category-button").forEach(button => {
        button.addEventListener("click", function () {
            const category = button.getAttribute("data-category");
            document.querySelectorAll(".game").forEach(game => {
                game.style.display = (category === "Tous" || game.getAttribute("data-category") === category) ? "block" : "none";
            });
        });
    });

});
document.addEventListener('DOMContentLoaded', function() {
    // Créer un bouton menu hamburger pour les petits écrans
    const hamburger = document.createElement('button');
    hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    hamburger.id = 'hamburger-menu';
    hamburger.style.display = 'none';
    hamburger.style.background = 'transparent';
    hamburger.style.border = 'none';
    hamburger.style.color = 'white';
    hamburger.style.fontSize = '1.5rem';
    hamburger.style.cursor = 'pointer';
    
    // Insérer le bouton dans le header
    const header = document.querySelector('header');
    header.insertBefore(hamburger, header.firstChild);
    
    // Gérer l'affichage du menu
    const nav = document.querySelector('header nav');
    
    function toggleMenu() {
        if (nav.style.display === 'none' || nav.style.display === '') {
            nav.style.display = 'block';
        } else {
            nav.style.display = 'none';
        }
    }
    
    hamburger.addEventListener('click', toggleMenu);
    
    // Afficher/masquer le bouton hamburger en fonction de la taille de l'écran
    function handleResponsive() {
        if (window.innerWidth <= 768) {
            hamburger.style.display = 'block';
            nav.style.display = 'none';
        } else {
            hamburger.style.display = 'none';
            nav.style.display = 'block';
        }
    }
    
    // Exécuter au chargement et lors du redimensionnement
    window.addEventListener('load', handleResponsive);
    window.addEventListener('resize', handleResponsive);
});
   //utilisateur connecté

document.addEventListener('DOMContentLoaded', function() {
    const profileBtn = document.getElementById('profile-btn');
    const profileMenu = document.querySelector('.profile-menu');

    // Afficher/masquer le menu au clic
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        profileMenu.classList.toggle('active');
    });

    // Fermer le menu quand on clique ailleurs
    document.addEventListener('click', function() {
        profileMenu.classList.remove('active');
    });

    // Charger les données utilisateur
    const userData = localStorage.getItem('userData');
    if (userData) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('user-profile').style.display = 'block';
        
        // Mettre à jour l'image si disponible
        const user = JSON.parse(userData);
        if (user.photo) {
            document.querySelector('.profile-pic').src = user.photo;
        }
    }
});
  

const ALERT_ICONS = {
    success: '<i class="fas fa-check-circle"></i>',
    error: '<i class="fas fa-exclamation-circle"></i>',
    warning: '<i class="fas fa-exclamation-triangle"></i>',
    info: '<i class="fas fa-info-circle"></i>'
  };
  
  function showAlert(config) {
    const {
      type = 'info',
      title = '',
      message = '',
      duration = 5000,
      closable = true
    } = config;
    
    const overlay = document.getElementById('customAlertOverlay');
    const alertBox = overlay.querySelector('.alert-box');
    const alertIcon = overlay.querySelector('.alert-icon');
    const alertTitle = overlay.querySelector('.alert-title');
    const alertMessage = overlay.querySelector('.alert-message');
    const alertClose = overlay.querySelector('.alert-close');
    const alertProgress = overlay.querySelector('.alert-progress');
    
    // Appliquer le type d'alerte
    alertBox.className = 'alert-box alert-' + type;
    alertIcon.innerHTML = ALERT_ICONS[type] || ALERT_ICONS.info;
    
    // Contenu de l'alerte
    alertTitle.textContent = title;
    alertMessage.textContent = message;
    
    // Bouton de fermeture
    alertClose.style.display = closable ? 'block' : 'none';
    
    // Afficher l'alerte
    overlay.classList.add('active');
    
    // Animation de progression
    alertProgress.style.transition = `transform ${duration}ms linear`;
    alertProgress.style.transform = 'scaleX(0)';
    
    // Fermeture automatique
    let timeoutId = setTimeout(() => {
      closeAlert();
    }, duration);
    
    // Fermeture manuelle
    alertClose.onclick = () => {
      clearTimeout(timeoutId);
      closeAlert();
    };
    
    function closeAlert() {
      overlay.classList.remove('active');
      setTimeout(() => {
        alertProgress.style.transform = 'scaleX(1)';
        alertProgress.style.transition = 'none';
      }, 300);
    }
  }