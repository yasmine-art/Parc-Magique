document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID utilisateur depuis le localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userId = userData?.id;
    
    if (!userId) {
        document.getElementById('tickets-container').innerHTML = `
            <div class="no-tickets">
                <p>Vous devez être connecté pour voir vos tickets.</p>
                <button class="btn btn-primary" onclick="window.location.href='login.html'">
                    <i class="fas fa-sign-in-alt"></i> Se connecter
                </button>
            </div>
        `;
        return;
    }

    // Récupérer tous les tickets depuis localStorage
    const allTickets = JSON.parse(localStorage.getItem('ticketsHistory')) || [];
    
    // Filtrer les tickets de l'utilisateur courant
    const userTickets = allTickets.filter(ticket => ticket.userId === userId);
    
    // Afficher les tickets
    displayTickets(userTickets);
});

function displayTickets(tickets) {
    const container = document.getElementById('tickets-container');
    
    if (tickets.length === 0) {
        container.innerHTML = `
            <div class="no-tickets">
                <p>Vous n'avez aucun ticket enregistré.</p>
                <button class="btn btn-primary" onclick="window.location.href='reservation.html'">
                    <i class="fas fa-ticket-alt"></i> Faire une réservation
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    tickets.forEach(ticket => {
        const ticketElement = document.createElement('div');
        ticketElement.className = 'ticket-card';
        
        // Formater la date
        const visitDate = new Date(ticket.dateVisite);
        const formattedDate = visitDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        // Créer le contenu du ticket
        ticketElement.innerHTML = `
            <div class="ticket-header">
                <span class="ticket-ref">${ticket.reference || 'TKT-' + ticket.id.toString().padStart(6, '0')}</span>
                <span class="ticket-date">Visite prévue le ${formattedDate}</span>
            </div>
            
            <div class="ticket-details">
                <div class="detail-item">
                    <span class="detail-label">Nom</span>
                    <span class="detail-value">${ticket.nom || 'Non spécifié'}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Montant total</span>
                    <span class="detail-value">${ticket.total ? parseFloat(ticket.total).toFixed(2) + ' DA' : '0.00 DA'}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Statut</span>
                    <span class="ticket-status ${ticket.statusPaiement === 'Payé' ? 'status-paid' : 'status-pending'}">
                        ${ticket.statusPaiement || 'À payer'}
                    </span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Mode de paiement</span>
                    <span class="detail-value">
                        ${ticket.modePaiement === 'en_ligne' ? 'Carte bancaire' : 
                          ticket.modePaiement === 'espece' ? 'Espèces' : 'Non spécifié'}
                        ${ticket.last4Digits ? '(•••• ' + ticket.last4Digits + ')' : ''}
                    </span>
                </div>
            </div>
            
            <div class="detail-item">
                <span class="detail-label">Attractions</span>
                <ul style="margin-top: 5px; padding-left: 20px;">
                    ${ticket.panier ? ticket.panier.map(item => `
                        <li>${item.name} 
                            (${item.quantity} x ${parseFloat(item.price).toFixed(2)} DA)
                        </li>
                    `).join('') : '<li>Aucune attraction</li>'}
                </ul>
            </div>
            
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="viewTicket('${ticket.id}')">
                    <i class="fas fa-eye"></i> Voir le ticket
                </button>
                <button class="btn btn-secondary" onclick="generateQR('${ticket.id}')">
                    <i class="fas fa-qrcode"></i> QR Code
                </button>
                <button class="btn btn-secondary" onclick="deleteTicket('${ticket.id}')">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        `;
        
        container.appendChild(ticketElement);
    });
}

// Fonction pour afficher un ticket en détail
function viewTicket(ticketId) {
    // Stocker l'ID du ticket à afficher
    localStorage.setItem('currentTicketId', ticketId);
    // Rediriger vers la page de détail
    window.location.href = 'voir_ticket.html';
}

// Fonction pour générer un QR code
function generateQR(ticketId) {
    const tickets = JSON.parse(localStorage.getItem('ticketsHistory')) || [];
    const ticket = tickets.find(t => t.id == ticketId);
    
    if (ticket) {
        const qrData = {
            reference: ticket.reference,
            nom: ticket.nom,
            date: ticket.dateVisite,
            attractions: ticket.panier.map(item => item.name)
        };
        
        localStorage.setItem('qrData', JSON.stringify(qrData));
        window.location.href = 'qr_code.html';
    }
}

// Fonction pour supprimer un ticket
function deleteTicket(ticketId) {
    if (confirm('Voulez-vous vraiment supprimer ce ticket ?')) {
        const tickets = JSON.parse(localStorage.getItem('ticketsHistory')) || [];
        const updatedTickets = tickets.filter(ticket => ticket.id != ticketId);
        
        localStorage.setItem('ticketsHistory', JSON.stringify(updatedTickets));
        
        // Recharger l'affichage
        const userData = JSON.parse(localStorage.getItem('userData'));
        const userTickets = updatedTickets.filter(ticket => ticket.userId === userData.id);
        displayTickets(userTickets);
    }
}