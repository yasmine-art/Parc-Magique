// Afficher le bouton "Retour en haut" lorsque l'utilisateur défile vers le bas
window.onscroll = function() {
    let backToTopBtn = document.getElementById("back-to-top");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

// Lorsque l'utilisateur clique sur le bouton "Retour en haut", remonter la page
document.getElementById("back-to-top").onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Traitement du formulaire de billetterie
document.getElementById("ticket-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const park = document.getElementById("park").value;
    const ticketType = document.getElementById("ticket-type").value;
    const quantity = document.getElementById("quantity").value;

    // Ici, vous pouvez ajouter du code pour traiter l'achat (ex. appeler une API ou afficher une confirmation)
    alert(`Vous avez choisi : ${park}, Type de billet : ${ticketType}, Quantité : ${quantity}`);
});

// Traitement du formulaire de contact
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Vous pouvez ajouter un traitement pour envoyer le formulaire (ex. via AJAX)
    alert(`Merci pour votre message. Nous vous contacterons bientôt à ${email} ou ${phone}.`);
});
