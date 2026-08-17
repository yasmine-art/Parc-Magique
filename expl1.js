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

// JavaScript pour gérer la modale
//const modal = document.getElementById('modal');
/* const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalMap = document.getElementById('modal-map');
const visitButton = document.getElementById('visit-button');

document.querySelectorAll('#parks ul li').forEach((card) => {
    card.addEventListener('click', () => {
        const title = card.querySelector('a').textContent;
        const description = card.getAttribute('data-description');
        const location = card.getAttribute('data-location'); // Récupère l'URL de la carte

        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalMap.src = location; // Met à jour l'iframe avec la carte
        modal.style.display = 'flex'; // Affiche le modal
    });
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'; // Ferme le modal si on clique en dehors
    }
});

visitButton.addEventListener('click', () => {
    const title = modalTitle.textContent;
    alert(`Redirection vers ${title}`);
});*/

// Fonction d'animation au défilement pour toutes les sections
document.addEventListener("DOMContentLoaded", function () {
const sections = document.querySelectorAll('section');
const items = document.querySelectorAll('.feature,.category-item, .about-item');

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

// Récupérer les éléments du DOM
const btnAll = document.getElementById('btn-all');
const btnManege = document.getElementById('btn-manege');
const btnAquaparc = document.getElementById('btn-aquaparc');

const modalAll = document.getElementById('modal-all');
const modalManege = document.getElementById('modal-manege');
const modalAquaparc = document.getElementById('modal-aquaparc');

const closeButtons = document.querySelectorAll('.close');

// Ouvrir le modal "Tous"
btnAll.addEventListener('click', () => {
modalAll.style.display = 'block';
});

// Ouvrir le modal "Manèges"
btnManege.addEventListener('click', () => {
modalManege.style.display = 'block';
});

// Ouvrir le modal "Aquaparcs"
btnAquaparc.addEventListener('click', () => {
modalAquaparc.style.display = 'block';
});

// Fermer les modals
closeButtons.forEach(button => {
button.addEventListener('click', () => {
modalAll.style.display = 'none';
modalManege.style.display = 'none';
modalAquaparc.style.display = 'none';
});
});

// Fermer les modals en cliquant en dehors
window.addEventListener('click', (event) => {
if (event.target === modalAll) {
modalAll.style.display = 'none';
}
if (event.target === modalManege) {
modalManege.style.display = 'none';
}
if (event.target === modalAquaparc) {
modalAquaparc.style.display = 'none';
}
});

// Sélectionnez tous les éléments de catégorie
const categoryItems = document.querySelectorAll('.category-item');

// Ajoutez un écouteur d'événement à chaque élément
categoryItems.forEach(item => {
item.addEventListener('click', function() {
 // Retirez la classe 'active' de tous les éléments
 categoryItems.forEach(i => i.classList.remove('active'));

 // Ajoutez la classe 'active' à l'élément cliqué
 item.classList.add('active');
});
});