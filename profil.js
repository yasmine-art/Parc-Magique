document.addEventListener('DOMContentLoaded', function() {
    // Données utilisateur
    const userData = {
        name: "Jean Dupont",
        email: "jean.dupont@example.com",
        phone: "+33 6 12 34 56 78",
        joinDate: "2023-01-10",
        avatar: "images/default-avatar.jpg"
    };

    // Éléments du DOM
    const editProfileModal = document.getElementById('edit-profile-modal');
    const passwordModal = document.getElementById('password-modal');

    // Afficher les données
    function displayProfileData() {
        document.getElementById('profile-name').textContent = userData.name;
        document.getElementById('profile-email').textContent = userData.email;
        document.getElementById('detail-name').textContent = userData.name;
        document.getElementById('detail-email').textContent = userData.email;
        document.getElementById('detail-phone').textContent = userData.phone;
        document.getElementById('detail-join-date').textContent = formatDate(userData.joinDate);
        
        if (userData.avatar) {
            document.getElementById('profile-avatar').src = userData.avatar;
        }
    }

    // Formater la date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    // Initialisation
    displayProfileData();

    // Gestion de l'avatar
    document.getElementById('change-avatar').addEventListener('click', function() {
        document.getElementById('avatar-upload').click();
    });

    document.getElementById('avatar-upload').addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                userData.avatar = event.target.result;
                document.getElementById('profile-avatar').src = userData.avatar;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Gestion des modales
    document.getElementById('edit-profile-btn').addEventListener('click', function() {
        // Pré-remplir le formulaire
        document.getElementById('edit-name').value = userData.name;
        document.getElementById('edit-email').value = userData.email;
        document.getElementById('edit-phone').value = userData.phone;
        
        editProfileModal.classList.add('active');
    });

    document.getElementById('change-password-btn').addEventListener('click', function() {
        passwordModal.classList.add('active');
    });

    // Fermer les modales
    function closeModals() {
        editProfileModal.classList.remove('active');
        passwordModal.classList.remove('active');
    }

    document.getElementById('close-edit-modal').addEventListener('click', closeModals);
    document.getElementById('close-password-modal').addEventListener('click', closeModals);
    document.getElementById('cancel-edit').addEventListener('click', closeModals);
    document.getElementById('cancel-password').addEventListener('click', closeModals);

    // Fermer en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
    });

    // Soumission du formulaire de profil
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Mettre à jour les données
        userData.name = document.getElementById('edit-name').value;
        userData.email = document.getElementById('edit-email').value;
        userData.phone = document.getElementById('edit-phone').value;
        
        // Mettre à jour l'affichage
        displayProfileData();
        
        // Fermer la modale
        closeModals();
        
        alert('Profil mis à jour avec succès!');
    });

    // Soumission du formulaire de mot de passe
    document.getElementById('change-password-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (newPassword !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas!');
            return;
        }
        
        if (newPassword.length < 8) {
            alert('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }
        
        alert('Mot de passe changé avec succès!');
        this.reset();
        closeModals();
    });
});