// ==================== MODALES PERSONNALISÉES ====================
(function() {
    // Création du HTML pour la modale
    const modalHTML = `
    <div id="customAlertModal" class="custom-modal">
        <div class="custom-modal-content">
            <div class="custom-modal-header">
                <h3 class="custom-modal-title"><i class="fas fa-exclamation-circle custom-modal-icon"></i> <span id="customAlertTitle">Alerte</span></h3>
                <button class="custom-modal-close">&times;</button>
            </div>
            <div class="custom-modal-body">
                <p id="customAlertMessage"></p>
            </div>
            <div class="custom-modal-footer">
                <button id="customAlertConfirm" class="custom-modal-btn custom-modal-btn-primary">OK</button>
            </div>
        </div>
    </div>
    `;
    
    // Ajout du CSS pour les modales
    const style = document.createElement('style');
    style.textContent = `
    .custom-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        justify-content: center;
        align-items: center;
    }
    .custom-modal-content {
        background-color: #fff;
        padding: 25px;
        border-radius: 8px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        animation: modalFadeIn 0.3s;
        position: relative;
    }
    @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .custom-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    .custom-modal-title {
        font-size: 1.3rem;
        color: #b36572;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .custom-modal-body {
        margin-bottom: 20px;
        color: #555;
        line-height: 1.5;
    }
    .custom-modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    .custom-modal-btn {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
    }
    .custom-modal-btn-primary {
        background-color: #b36572;
        color: white;
    }
    .custom-modal-btn-primary:hover {
        background-color: #d8abb3;
    }
    .custom-modal-btn-secondary {
        background-color: #f0f0f0;
        color: #333;
    }
    .custom-modal-btn-secondary:hover {
        background-color: #e0e0e0;
    }
    .custom-modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #777;
        padding: 0 5px;
    }
    .custom-modal-icon {
        font-size: 1.2rem;
    }
    `;
    
    // Ajout des éléments au DOM
    document.head.appendChild(style);
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Fonction pour afficher les alertes personnalisées
    window.customAlert = function(message, title = 'Alerte', options = {}) {
        const modal = document.getElementById('customAlertModal');
        const messageEl = document.getElementById('customAlertMessage');
        const titleEl = document.getElementById('customAlertTitle');
        const confirmBtn = document.getElementById('customAlertConfirm');
        
        // Configurer le contenu
        titleEl.textContent = title;
        messageEl.textContent = message;
        
        // Configurer le bouton OK
        confirmBtn.textContent = options.confirmText || 'OK';
        confirmBtn.onclick = function() {
            modal.style.display = 'none';
            if (typeof options.onConfirm === 'function') {
                options.onConfirm();
            }
        };
        
        // Fermer avec le bouton de fermeture
        document.querySelector('#customAlertModal .custom-modal-close').onclick = function() {
            modal.style.display = 'none';
        };
        
        // Fermer en cliquant en dehors
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
        
        // Afficher la modale
        modal.style.display = 'flex';
        
        // Retourner une promesse pour les cas où on voudrait attendre la réponse
        return new Promise(resolve => {
            confirmBtn.onclick = function() {
                modal.style.display = 'none';
                resolve(true);
            };
        });
    };
    
    // Fonction pour les confirmations personnalisées
    window.customConfirm = function(message, title = 'Confirmation') {
        const modal = document.getElementById('customAlertModal');
        const messageEl = document.getElementById('customAlertMessage');
        const titleEl = document.getElementById('customAlertTitle');
        const confirmBtn = document.getElementById('customAlertConfirm');
        const footer = document.querySelector('.custom-modal-footer');
        
        // Créer un bouton Annuler
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'custom-modal-btn custom-modal-btn-secondary';
        cancelBtn.textContent = 'Annuler';
        footer.appendChild(cancelBtn);
        
        // Configurer le contenu
        titleEl.textContent = title;
        messageEl.textContent = message;
        confirmBtn.textContent = 'Confirmer';
        
        // Afficher la modale
        modal.style.display = 'flex';
        
        // Retourner une promesse
        return new Promise(resolve => {
            const cleanup = function() {
                footer.removeChild(cancelBtn);
                confirmBtn.textContent = 'OK';
                confirmBtn.onclick = null;
                cancelBtn.onclick = null;
                closeBtn.onclick = null;
                modal.onclick = null;
            };
            
            const closeBtn = document.querySelector('#customAlertModal .custom-modal-close');
            
            confirmBtn.onclick = function() {
                modal.style.display = 'none';
                cleanup();
                resolve(true);
            };
            
            cancelBtn.onclick = function() {
                modal.style.display = 'none';
                cleanup();
                resolve(false);
            };
            
            closeBtn.onclick = function() {
                modal.style.display = 'none';
                cleanup();
                resolve(false);
            };
            
            modal.onclick = function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    cleanup();
                    resolve(false);
                }
            };
        });
    };
    
    // Sauvegarde des fonctions originales
    window.originalAlert = window.alert;
    window.originalConfirm = window.confirm;
    
    // Remplacement de la fonction alert() native
    window.alert = function(message) {
        return customAlert(message);
    };
    
    // Remplacement de la fonction confirm() native
    window.confirm = function(message) {
        return customConfirm(message);
    };
})();

// ==================== CONSTANTES ET VARIABLES GLOBALES ====================
const PARK_CATEGORIES = {
    MANEGE: "manege",
    AQUAPARC: "aquaparc",
    ALL: "all"
};

// ==================== INITIALISATION ====================
document.addEventListener("DOMContentLoaded", function() {
    initApplication();
});

function initApplication() {
    initNavigation();
    initParkManagement();
    initUserManagement();
    initDashboard();
    initProfileManager();
}

const ProfileManager = (function() {
    // Éléments DOM
    const elements = {
        profileSection: document.querySelector(".profile-section"),
        profileName: document.querySelector("#profile-name"),
        profileEmail: document.querySelector("#profile-email"),
        profileJoinDate: document.querySelector("#profile-join-date"),
        profileLastLogin: document.querySelector("#profile-last-login"),
        profileAvatar: document.querySelector("#profile-avatar")
    };

    function init() {
        if (!elements.profileSection) {
            console.error("La section profil n'a pas été trouvée");
            return;
        }
        
        loadProfileData();
    }

    async function loadProfileData() {
        try {
            const userId = getUserId();
            const response = await fetch(`get_user_profile.php?user_id=${userId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const profileData = await response.json();

            if (profileData.error) {
                console.error(profileData.error);
                showProfileError("Erreur de chargement du profil");
                return;
            }

            updateProfileUI(profileData);
        } catch (error) {
            console.error("Erreur lors du chargement du profil:", error);
            showProfileError("Impossible de charger les données du profil");
        }
    }

    function getUserId() {
        return 1;
    }

    function showProfileError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'profile-error';
        errorElement.textContent = message;
        elements.profileSection.appendChild(errorElement);
    }

    function updateProfileUI(data) {
        if (elements.profileName) elements.profileName.textContent = data.nom || "Utilisateur";
        if (elements.profileEmail) elements.profileEmail.textContent = data.email || "Non disponible";
        if (elements.profileJoinDate) {
            elements.profileJoinDate.textContent = formatDate(data.date_inscription) || "Inconnue";
        }
        if (elements.profileLastLogin) {
            elements.profileLastLogin.textContent = data.last_login ? formatDate(data.last_login) : "Jamais";
        }
        if (elements.profileAvatar) {
            elements.profileAvatar.src = data.avatar || "default-avatar.jpg";
        }
    }

    function formatDate(dateString) {
        if (!dateString) return "Inconnue";
        try {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit'
            };
            return new Date(dateString).toLocaleDateString('fr-FR', options);
        } catch (e) {
            return dateString;
        }
    }

    return { init };
})();

function initProfileManager() {
    ProfileManager.init();
}

// ==================== MODULES ====================

// 1. Module de Navigation
const Navigation = (function() {
    function init() {
        const menuLinks = document.querySelectorAll(".sidebar-menu a");
        const sections = document.querySelectorAll(".content-section");
        
        menuLinks.forEach(link => {
            link.addEventListener("click", function(e) {
                if (this.classList.contains('logout-link') || this.getAttribute('href') === '#') return;
                
                e.preventDefault();
                const targetId = this.getAttribute("href");
                
                menuLinks.forEach(l => l.classList.remove("active"));
                sections.forEach(s => s.classList.remove("active"));
                
                this.classList.add("active");
                document.querySelector(targetId).classList.add("active");
            });
        });
    }
    
    return { init };
})();

function initNavigation() {
    Navigation.init();
}

// 3. Module Gestion des Parcs
const ParkManager = (function() {
    let parks = [];
    let currentCategory = PARK_CATEGORIES.ALL;
    let currentEditId = null;
    
    const elements = {
        parksList: document.getElementById("parks-list"),
        categoryButtons: document.querySelectorAll(".category-button"),
        searchInput: document.getElementById("park-search"),
        addParkButton: document.getElementById("add-park-button"),
        parkModal: document.getElementById("park-modal"),
        closeModal: document.querySelector(".close-modal"),
        cancelButton: document.querySelector(".cancel-btn"),
        parkForm: document.getElementById("park-form"),
        modalTitle: document.getElementById("modal-title")
    };
    
    function init() {
        setupEventListeners();
        loadInitialParks();
    }
    
    function setupEventListeners() {
        elements.categoryButtons.forEach(button => {
            button.addEventListener("click", function() {
                elements.categoryButtons.forEach(btn => btn.classList.remove("active"));
                this.classList.add("active");
                currentCategory = this.dataset.category;
                renderParksTable();
            });
        });
        
        elements.searchInput.addEventListener("input", renderParksTable);
        elements.addParkButton.addEventListener("click", openAddModal);
        elements.closeModal.addEventListener("click", closeModal);
        elements.cancelButton.addEventListener("click", closeModal);
        elements.parkForm.addEventListener("submit", handleParkFormSubmit);
        
        window.addEventListener("click", function(e) {
            if (e.target === elements.parkModal) {
                closeModal();
            }
        });
    }
    
    function loadInitialParks() {
        parks = [
            { id: 1, name: "Manège Elhamri", category: PARK_CATEGORIES.MANEGE, image: "images/elhamri.jpg", status: "active" },
        ];
        
        renderParksTable();
    }
    
    function renderParksTable() {
        const searchTerm = elements.searchInput.value.toLowerCase();
        
        const filteredParks = parks.filter(park => {
            const matchesCategory = currentCategory === PARK_CATEGORIES.ALL || park.category === currentCategory;
            const matchesSearch = park.name.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        
        elements.parksList.innerHTML = "";
        
        if (filteredParks.length === 0) {
            elements.parksList.innerHTML = `
                <tr>
                    <td colspan="5" class="no-results">Aucun parc trouvé</td>
                </tr>
            `;
            return;
        }
        
        filteredParks.forEach(park => {
            const row = document.createElement("tr");
            const statusInfo = getStatusInfo(park.status);
            
            row.innerHTML = `
                <td><img src="${park.image}" alt="${park.name}" class="park-image"></td>
                <td>${park.name}</td>
                <td>${park.category === PARK_CATEGORIES.MANEGE ? "Manège" : "Aquaparc"}</td>
                <td><span class="status-badge ${statusInfo.class}">${statusInfo.text}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" data-id="${park.id}">
                            <i class="fas fa-edit"></i> Modifier
                        </button>
                        <button class="delete-btn" data-id="${park.id}">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </div>
                </td>
            `;
            
            row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(park.id));
            row.querySelector('.delete-btn').addEventListener('click', () => deletePark(park.id));
            
            elements.parksList.appendChild(row);
        });
    }
    
    function getStatusInfo(status) {
        switch(status) {
            case "active": return { class: "status-active", text: "Actif" };
            case "inactive": return { class: "status-inactive", text: "Inactif" };
            case "maintenance": return { class: "status-maintenance", text: "Maintenance" };
            default: return { class: "", text: "Inconnu" };
        }
    }
    
    function openAddModal() {
        currentEditId = null;
        elements.modalTitle.textContent = "Ajouter un nouveau parc";
        elements.parkForm.reset();
        document.getElementById("park-id").value = "";
        elements.parkModal.style.display = "flex";
    }
    
    function openEditModal(parkId) {
        const park = parks.find(p => p.id === parkId);
        if (!park) return;
        
        currentEditId = parkId;
        elements.modalTitle.textContent = "Modifier le parc";
        
        document.getElementById("park-id").value = park.id;
        document.getElementById("park-name").value = park.name;
        document.getElementById("park-category").value = park.category;
        document.getElementById("park-image").value = park.image;
        document.getElementById("park-status").value = park.status;
        
        elements.parkModal.style.display = "flex";
    }
    
    function closeModal() {
        elements.parkModal.style.display = "none";
    }
    
    function handleParkFormSubmit(e) {
        e.preventDefault();
        const formData = getFormData();
        
        if (!validateForm(formData)) {
           /* alert("Veuillez remplir tous les champs");*/
           window.alert = function(message) {
            return customAlert("Veuillez remplir tous les champs");
        };
            /*return;*/
        }
        
        if (formData.id) {
            updatePark(formData);
        } else {
            addPark(formData);
        }
        
        closeModal();
        renderParksTable();
    }
    
    function getFormData() {
        return {
            id: document.getElementById("park-id").value,
            name: document.getElementById("park-name").value,
            category: document.getElementById("park-category").value,
            image: document.getElementById("park-image").value,
            status: document.getElementById("park-status").value
        };
    }
    
    function validateForm(formData) {
        return formData.name && formData.category && formData.image && formData.status;
    }
    
    function addPark(formData) {
        const newId = parks.length > 0 ? Math.max(...parks.map(p => p.id)) + 1 : 1;
        parks.push({ 
            id: newId, 
            ...formData 
        });
    }
    
    function updatePark(formData) {
        const index = parks.findIndex(p => p.id === parseInt(formData.id));
        if (index !== -1) {
            parks[index] = { 
                id: parseInt(formData.id), 
                ...formData 
            };
        }
    }
    
    function deletePark(parkId) {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce parc ?")) {
            parks = parks.filter(p => p.id !== parkId);
            renderParksTable();
        }
    }
    
    return { init };
})();

function initParkManagement() {
    ParkManager.init();
}

// 4. Module Gestion des Utilisateurs
const UserManager = (function() {
    const elements = {
        usersList: document.getElementById("users-list"),
        adminsList: document.getElementById("admins-list"),
        refreshUsersButton: document.getElementById("refresh-users"),
        refreshAdminsButton: document.getElementById("refresh-admins"),
        userModal: document.getElementById("user-modal"),
        userDetails: document.getElementById("user-details"),
        closeUserModal: document.getElementById("close-modal"),
        addAdminButton: document.getElementById("add-admin-button"),
        adminModal: document.getElementById("admin-modal"),
        adminForm: document.getElementById("admin-form"),
        closeAdminModal: document.querySelector("#admin-modal .close-modal"),
        cancelAdminButton: document.querySelector("#admin-modal .cancel-btn")
    };
    
    function init() {
        setupEventListeners();
        fetchUsers();
        fetchAdmins();
    }
    
    function setupEventListeners() {
        elements.refreshUsersButton.addEventListener("click", fetchUsers);
        elements.closeUserModal.addEventListener("click", () => elements.userModal.style.display = "none");
        elements.refreshAdminsButton.addEventListener("click", fetchAdmins);
        elements.addAdminButton.addEventListener("click", openAddAdminModal);
        elements.closeAdminModal.addEventListener("click", closeAdminModal);
        elements.cancelAdminButton.addEventListener("click", closeAdminModal);
        elements.adminForm.addEventListener("submit", handleAdminFormSubmit);
        
        window.addEventListener("click", function(e) {
            if (e.target === elements.userModal) {
                elements.userModal.style.display = "none";
            }
            if (e.target === elements.adminModal) {
                closeAdminModal();
            }
        });
    }
    
    function formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
    
    async function fetchUsers() {
        try {
            const response = await fetch('get_users.php');
            const users = await response.json();
            
            if (users.error) {
                alert(users.error);
                return;
            }
            
            renderUsersTable(users);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs:", error);
            alert("Une erreur est survenue lors de la récupération des utilisateurs");
          
        }
    }
    
    async function fetchAdmins() {
        try {
            const response = await fetch('get_admins.php');
            const admins = await response.json();
            
            if (admins.error) {
                alert(admins.error);
                return;
            }
            
            renderAdminsTable(admins);
        } catch (error) {
            console.error("Erreur lors de la récupération des administrateurs:", error);
            alert("Une erreur est survenue lors de la récupération des administrateurs");
        }
    }
    
    function renderUsersTable(users) {
        renderTable(elements.usersList, users, "user");
    }
    
    function renderAdminsTable(admins) {
        renderTable(elements.adminsList, admins, "admin");
    }
    
    function renderTable(tableElement, data, type) {
        tableElement.innerHTML = "";
    
        if (data.length === 0) {
            tableElement.innerHTML = `
                <tr>
                    <td colspan="5" class="no-results">Aucun ${type === 'user' ? 'utilisateur' : 'administrateur'} trouvé</td>
                </tr>
            `;
            return;
        }
    
        data.forEach(item => {
            const row = document.createElement("tr");
            const formattedDate = formatDate(item.date_inscription);
            
            const actionsHtml = type === 'admin' 
                ? `<div class="action-buttons">
                      <button class="view-btn" data-id="${item.id}" data-type="${type}">
                          <i class="fas fa-eye"></i> Voir
                      </button>
                      <button class="delete-btn" data-id="${item.id}" data-type="${type}">
                          <i class="fas fa-trash"></i> Supprimer
                      </button>
                   </div>`
                : `<div class="action-buttons">
                      <button class="view-btn" data-id="${item.id}" data-type="${type}">
                          <i class="fas fa-eye"></i> Voir
                      </button>
                   </div>`;
    
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nom}</td>
                <td>${item.email}</td>
                <td>${formattedDate}</td>
                <td>${actionsHtml}</td>
            `;
    
            row.querySelector('.view-btn').addEventListener('click', () => viewUserDetails(item.id, type));
            
            if (type === 'admin') {
                row.querySelector('.delete-btn').addEventListener('click', () => deleteAdmin(item.id));
            }
    
            tableElement.appendChild(row);
        });
    }
    
    async function viewUserDetails(userId, userType) {
        try {
            const response = await fetch(`get_user_details.php?id=${userId}&type=${userType}`);
            const user = await response.json();
            
            if (user.error) {
                alert(user.error);
                return;
            }
            
            const formattedDate = formatDate(user.date_inscription);
            
            elements.userDetails.innerHTML = `
                <div class="user-detail-row">
                    <div class="user-detail-label">ID:</div>
                    <div class="user-detail-value">${user.id}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Nom complet:</div>
                    <div class="user-detail-value">${user.nom}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Email:</div>
                    <div class="user-detail-value">${user.email}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Date d'inscription:</div>
                    <div class="user-detail-value">${formattedDate}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Rôle:</div>
                    <div class="user-detail-value">${user.role || (userType === 'admin' ? 'Administrateur' : 'Utilisateur')}</div>
                </div>
                <div class="user-detail-row">
                    <div class="user-detail-label">Dernière connexion:</div>
                    <div class="user-detail-value">${user.last_login || 'Inconnue'}</div>
                </div>
            `;
            
            elements.userModal.style.display = "flex";
        } catch (error) {
            console.error("Erreur lors de la récupération des détails:", error);
            alert("Une erreur est survenue lors de la récupération des détails");
        }
    }
    
    async function deleteAdmin(adminId) {
        const userConfirmed = await customConfirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?", "Confirmation de suppression");
        if (!userConfirmed) {
            return;
        }
        
        try {
            const response = await fetch('delete_admin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: adminId })
            });

            const result = await response.json();

            if (result.success) {
                alert("Administrateur supprimé avec succès");
                fetchAdmins();
            } else {
                alert(result.error || "Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Une erreur est survenue lors de la suppression");
        }
    }
    
    function openAddAdminModal() {
        elements.adminModal.style.display = "flex";
        elements.adminForm.reset();
    }
    
    function closeAdminModal() {
        elements.adminModal.style.display = "none";
    }
    
    async function handleAdminFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById("admin-name").value,
            email: document.getElementById("admin-email").value,
            password: document.getElementById("admin-password").value,
            confirmPassword: document.getElementById("admin-confirm-password").value
        };
        
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        
        if (formData.password.length < 6) {
            alert("Le mot de passe doit contenir au moins 6 caractères");
            return;
        }
        
        try {
            const response = await fetch('add_admin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert("Administrateur ajouté avec succès");
                closeAdminModal();
                fetchAdmins();
            } else {
                alert(result.error || "Erreur lors de l'ajout de l'administrateur");
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout:", error);
            alert("Une erreur est survenue lors de l'ajout de l'administrateur");
        }
    }
    
    return { init };
})();

function initUserManagement() {
    UserManager.init();
}

// 5. Module Dashboard
const Dashboard = (function() {
    let parksData = [];
    
    async function fetchParks() {
        try {
            const response = await fetch('get_parks.php');
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            parksData = data;
            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des parcs:", error);
            throw error;
        }
    }
    
    function renderParksTable(parks) {
        let existingContainer = document.querySelector('.parks-table-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        
        const parksContainer = document.createElement('div');
        parksContainer.classList.add('parks-table-container');
        
        const heading = document.createElement('h3');
        heading.innerHTML = '<i class="fas fa-list"></i> Liste des parcs';
        parksContainer.appendChild(heading);
        
        const table = document.createElement('table');
        table.classList.add('parks-table');
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th class="image">Image</th>
                <th>Nom</th>
                <th>Type</th>
                <th>Date d'ajout</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        
        if (parks.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="no-data">Aucun parc disponible</td>`;
            tbody.appendChild(row);
        } else {
            parks.forEach(park => {
                const row = document.createElement('tr');
                
                const imageCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = park.image || 'assets/default-park.jpg';
                img.alt = park.nom;
                img.classList.add('park-thumbnail');
                imageCell.appendChild(img);
                
                const nameCell = document.createElement('td');
                nameCell.textContent = park.nom;
                
                const typeCell = document.createElement('td');
                const typeSpan = document.createElement('span');
                typeSpan.classList.add('park-type', park.type);
                typeSpan.textContent = park.type === 'manege' ? 'Manège' : 'Aquaparc';
                typeCell.appendChild(typeSpan);
                
                const dateCell = document.createElement('td');
                const date = new Date(park.created_at || Date.now());
                dateCell.textContent = date.toLocaleDateString();
                
                const actionsCell = document.createElement('td');
                actionsCell.classList.add('actions');
                actionsCell.innerHTML = `
                    <a href="${park.lien}" target="_blank" class="btn-view" title="Voir">
                        <i class="fas fa-eye"></i>Voir
                    </a>
                    <button class="btn-delete" data-id="${park.id}" title="Supprimer">
                        <i class="fas fa-trash-alt"></i>Supprimer
                    </button>
                `;
                
                row.appendChild(imageCell);
                row.appendChild(nameCell);
                row.appendChild(typeCell);
                row.appendChild(dateCell);
                row.appendChild(actionsCell);
                tbody.appendChild(row);
            });
        }
        
        table.appendChild(tbody);
        parksContainer.appendChild(table);
        
        document.querySelector('#dashboard').appendChild(parksContainer);
        addDeleteEventListeners();
    }
    
    function addDeleteEventListeners() {
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const parkId = this.getAttribute('data-id');
                deletePark(parkId).catch(error => {
                    console.error('Erreur:', error);
                });
            });
        });
    }
    
    async function deletePark(parkId) {
        // Afficher une modale de confirmation personnalisée
        const userConfirmed = await customConfirm(
            "Êtes-vous sûr de vouloir supprimer ce parc ?", 
            "Confirmation de suppression"
        );
        
        if (!userConfirmed) return;
    
        try {
            // Ajouter un indicateur de chargement si nécessaire
            document.body.classList.add('loading');
            
            const response = await fetch(`delete_park.php?id=${parkId}`);
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Échec de la suppression');
            }
            
            // Afficher un message de succès
            await customAlert("Parc supprimé avec succès", "Succès");
            
            // Recharger la liste des parcs
            await loadParks();
            
            return result;
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            await customAlert(
                "Une erreur est survenue lors de la suppression du parc", 
                "Erreur"
            );
            throw error;
        } finally {
            document.body.classList.remove('loading');
        }
    }
    
    function showAddParkModal() {
        const modal = document.getElementById('add-park-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }
    
    function hideAddParkModal() {
        const modal = document.getElementById('add-park-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    async function handleAddParkFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            
            const response = await fetch('add_park.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('Parc ajouté avec succès!');
                hideAddParkModal();
                form.reset();
                await loadParks();
            } else {
                throw new Error(result.error || 'Échec de l\'ajout du parc');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Enregistrer';
        }
    }
    
    /*async function loadUserStats() {
        try {
            const response = await fetch('get_user_count.php');
            const data = await response.json();
            
            if (data.error) {
                console.error(data.error);
                return;
            }
            
            if (document.getElementById('total-users')) {
                document.getElementById('total-users').textContent = data.count;
            }
        } catch (error) {
            console.error("Erreur lors du chargement des stats utilisateurs:", error);
        }
    }
    
    async function loadAdminStats() {
        try {
            const response = await fetch('get_admin_count.php');
            const data = await response.json();
            
            if (data.error) {
                console.error(data.error);
                return;
            }
            
            if (document.getElementById('total-admins')) {
                document.getElementById('total-admins').textContent = data.count;
            }
        } catch (error) {
            console.error("Erreur lors du chargement des stats administrateurs:", error);
        }
    }*/// Variables pour stocker les données
let userCount = 0;
let adminCount = 0;

async function loadUserStats() {
    try {
        const response = await fetch('get_user_count.php');
        const data = await response.json();
        
        if (data.error) {
            console.error(data.error);
            return;
        }
        
        userCount = data.count;
        document.getElementById('total-users').textContent = userCount;
        updateCombinedStats();
    } catch (error) {
        console.error("Erreur lors du chargement des stats utilisateurs:", error);
    }
}

async function loadAdminStats() {
    try {
        const response = await fetch('get_admin_count.php');
        const data = await response.json();
        
        if (data.error) {
            console.error(data.error);
            return;
        }
        
        adminCount = data.count;
        document.getElementById('total-admins').textContent = adminCount;
        updateCombinedStats();
    } catch (error) {
        console.error("Erreur lors du chargement des stats administrateurs:", error);
    }
}

function updateCombinedStats() {
    // Conversion explicite en nombres
    const userCountNum = Number(userCount);
    const adminCountNum = Number(adminCount);
    
    // Calcul de la somme numérique
    const totalMembers = userCountNum + adminCountNum;
    document.getElementById('total-members').textContent = totalMembers;
    
    if (totalMembers > 0) {
        const adminPercentage = (adminCount / totalMembers) * 100;
        const userPercentage = (userCount / totalMembers) * 100;
        
        const adminCircle = document.querySelector('.circle-fill-admin');
        const userCircle = document.querySelector('.circle-fill-user');
        
        adminCircle.style.setProperty('--percentage', adminPercentage);
        adminCircle.style.strokeDasharray = `${adminPercentage}, 100`;
        
        userCircle.style.setProperty('--percentage', userPercentage);
        userCircle.style.strokeDashoffset = `-${adminPercentage}`; // Démarre après le segment admin
        userCircle.style.strokeDasharray = `${userPercentage}, 100`;
    }
}
// Appelez ces fonctions au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadUserStats();
    loadAdminStats();
});
    
    async function loadParks() {
        const parkCountElement = document.getElementById('park-count');
        
        try {
            const parks = await fetchParks();
            
            if (parkCountElement) {
                parkCountElement.textContent = parks.length;
            }
            
            renderParksTable(parks);
        } catch (error) {
            console.error("Erreur lors de la récupération des parcs:", error);
            alert("Une erreur est survenue lors de la récupération des parcs");
        }
    }
    
    function init() {
        loadParks();
        
        const loadParksBtn = document.getElementById('load-parks-btn');
        if (loadParksBtn) {
            loadParksBtn.addEventListener('click', loadParks);
        }
        
        const addParkBtn = document.getElementById('add-park-dashboard');
        if (addParkBtn) {
            addParkBtn.addEventListener('click', showAddParkModal);
        }
        
        const closeModalBtn = document.querySelector('.close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', hideAddParkModal);
        }
        
        const addParkForm = document.getElementById('add-park-form');
        if (addParkForm) {
            addParkForm.addEventListener('submit', handleAddParkFormSubmit);
        }
        
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('add-park-modal');
            if (event.target === modal) {
                hideAddParkModal();
            }
        });
        
        loadUserStats();
        loadAdminStats();
    }
    
    return {
        init,
        loadParks
    };
})();

// ==================== FONCTIONS GLOBALES ====================
async function confirmLogout() {
    // Afficher la modale de confirmation personnalisée
    const userConfirmed = await customConfirm(
        "Voulez-vous vraiment vous déconnecter ?", 
        "Confirmation de déconnexion",
        {
            confirmText: "Se déconnecter",
            cancelText: "Annuler"
        }
    );
    
    if (!userConfirmed) return;

    try {
        // Ajouter un indicateur de chargement
        document.body.classList.add('loading');
        
        // Envoyer la requête de déconnexion au serveur
        const response = await fetch('logout1.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest' // Pour identifier les requêtes AJAX
            },
            credentials: 'include' // Pour inclure les cookies de session
        });

        const result = await response.json();

        if (result.success) {
            // Nettoyer le localStorage
            localStorage.removeItem('userData');
            
            // Rediriger vers la page de login
            window.location.href = result.redirect_url || 'login.html';
        } else {
            await customAlert(
                "La déconnexion a échoué", 
                "Erreur"
            );
        }
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        await customAlert(
            "Une erreur est survenue lors de la déconnexion", 
            "Erreur"
        );
    } finally {
        document.body.classList.remove('loading');
    }
}
// ==================== STYLES ====================
function addDashboardStyles() {
    const style = document.createElement('style');
    style.textContent = `
        #dashboard {
            padding: 20px;
            background-color: #f9f9f9;
        }
        .stats-container {
            display: flex;
            gap: 20px;
        }
        .stat-card {
            flex: 1;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .stat-card i {
            font-size: 30px;
            color: #b36572;
        }
        .stat-card h3 {
            font-size: 32px;
            color: #333;
            margin: 10px 0;
        }
        .stat-card p {
            font-size: 16px;
            color: #777;
        }
        #load-parks-btn {
            background-color: #b36572;
            color: white;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 20px;
        }
        #load-parks-btn:hover {
            background-color: #d8abb3;
        }
        .parks-table-container {
            margin-top: 30px;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .parks-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .parks-table th, .parks-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        .parks-table th {
            background-color: #f5f5f5;
            font-weight: 600;
        }
        .park-thumbnail {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 4px;
        }
        .park-type {
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: 500;
        }
        .park-type.manege {
            background-color: #e3f2fd;
            color: #1976d2;
        }
        .park-type.aquaparc {
            background-color: #e8f5e9;
            color: #388e3c;
        }
        .actions a {
            margin-right: 10px;
            color: #555;
            text-decoration: none;
            font-size: 1.1em;
        }
        .actions a:hover {
            color: #1976d2;
        }
        .btn-delete:hover {
            color: #d32f2f !important;
        }
        .error-message {
            color: red;
            font-size: 14px;
            margin-top: 10px;
        }
    `;
    document.head.appendChild(style);
}

// Initialisation du Dashboard
document.addEventListener('DOMContentLoaded', function() {
    addDashboardStyles();
    Dashboard.init();
}); 