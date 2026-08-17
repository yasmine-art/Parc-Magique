// Fonction pour filtrer les parcs par catégorie
function filterParks(category) {
    const activeList = document.querySelector('.parks-list.active');
    if (activeList) {
        activeList.classList.add('fade-out'); // Ajoute un effet de sortie
        setTimeout(() => {
            activeList.classList.remove('active', 'fade-out', 'slide-left', 'slide-right');
            // Afficher la nouvelle catégorie avec un effet d'entrée
            const newList = document.getElementById(category + '-parks');
            if (newList) {
                newList.classList.add('active');
                newList.classList.remove('slide-left', 'slide-right');
            }
            // Mettre à jour l'index actuel
            currentIndex = categories.indexOf(category);
        }, 500); // Attends la fin de l'animation avant d'afficher la nouvelle catégorie
    } else {
        // Si aucune liste active, affiche directement
        const newList = document.getElementById(category + '-parks');
        if (newList) {
            newList.classList.add('active');
        }
        currentIndex = categories.indexOf(category);
    }
}
 // Gestion des boutons de catégorie
 const categoryButtons = document.querySelectorAll('.category-button');
 categoryButtons.forEach(button => {
     button.addEventListener('click', () => {
         const category = button.getAttribute('data-category');
         filterParks(category);
     });
 });
 // Initialiser en affichant tous les parcs
 filterParks('none');
// Afficher le bouton lorsqu'on défile vers le bas
        const backToTopButton = document.getElementById('back-to-top');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                backToTopButton.style.display = 'flex'; // Afficher le bouton
            } else {
                backToTopButton.style.display = 'none'; // Cacher le bouton
            }
        });
        const toTopButton = document.getElementById('back-to-top');
        toTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
       // Fonction d'animation au défilement pour toutes les sections
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll('section');
    const items = document.querySelectorAll('.feature, .parks, .about-item');
    // Observer pour détecter l'apparition des sections à l'écran
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');  // Ajouter la classe visible quand l'élément est à l'écran
                observer.unobserve(entry.target);  // Arrêter l'observation une fois l'élément visible
            }
        });
    }, { threshold: 0.3 });  // L'élément sera observé lorsqu'il est à 30% visible
    // Observer toutes les sections
    sections.forEach(section => {
        observer.observe(section);
    });
    // Observer les éléments à l'intérieur des sections
    items.forEach(item => {
        observer.observe(item);
    });
});
// Menu hamburger amélioré
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



document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    let parksData = []; // Stockera les données des parcs

    // Charger les données des parcs
    function loadParksData() {
        fetch('get_parks1.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    parksData = data.parks;
                }
            })
            .catch(error => console.error('Erreur:', error));
    }

    // Rechercher les parcs
    function searchParks(query) {
        if (!query.trim()) {
            searchResults.style.display = 'none';
            return;
        }

        const results = parksData.filter(park => 
            park.nom.toLowerCase().includes(query.toLowerCase())
        );

        displaySearchResults(results);
    }

    // Afficher les résultats
    function displaySearchResults(results) {
        searchResults.innerHTML = '';

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Aucun parc trouvé</div>';
            searchResults.style.display = 'block';
            return;
        }

        results.forEach(park => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            
            const iconClass = park.type === 'aquaparc' ? 'fas fa-swimming-pool' : 'fas fa-carousel';
            
            item.innerHTML = `
                <i class="${iconClass}"></i>
                <span>${park.nom}</span>
            `;
            
            item.addEventListener('click', () => {
                window.location.href = park.lien;
            });
            
            searchResults.appendChild(item);
        });

        searchResults.style.display = 'block';
    }

    // Écouteurs d'événements
    searchInput.addEventListener('input', function() {
        searchParks(this.value);
    });

    searchBtn.addEventListener('click', function() {
        searchParks(searchInput.value);
    });

    // Fermer les résultats quand on clique ailleurs
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            searchResults.style.display = 'none';
        }
    });

    // Charger les données au démarrage
    loadParksData();
});