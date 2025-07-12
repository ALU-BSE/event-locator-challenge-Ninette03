const eventData = [
    {
        id: 1,
        title: "Summer Music Festival",
        date: "2023-08-15",
        time: "14:00",
        location: "Central Park",
        city: "New York",
        category: "music",
        description: "Join us for the biggest music festival of the summer featuring top artists from around the world.",
        organizer: "Music Events Inc.",
        price: "$50-$150",
        image: "./images/music_festival.png"
    },
    {
        id: 2,
        title: "Tech Conference 2023",
        date: "2023-09-20",
        time: "09:00",
        location: "Convention Center",
        city: "San Francisco",
        category: "business",
        description: "Annual technology conference showcasing the latest innovations in software and hardware.",
        organizer: "Tech Events Worldwide",
        price: "$299",
        image: "./images/tech_conference.png"
    },
    {
        id: 3,
        title: "Food & Wine Expo",
        date: "2023-07-30",
        time: "11:00",
        location: "Downtown Pavilion",
        city: "Chicago",
        category: "food",
        description: "Sample gourmet foods and fine wines from local and international vendors.",
        organizer: "Gourmet Experiences",
        price: "$35-$75",
        image: "./images/food_and_wine.png"
    },
    {
        id: 4,
        title: "Marathon 2023",
        date: "2023-10-08",
        time: "07:00",
        location: "City Streets",
        city: "Boston",
        category: "sports",
        description: "Annual city marathon with routes through historic neighborhoods.",
        organizer: "Sports Events Org",
        price: "$85",
        image: "./images/marathon.png"
    },
    {
        id: 5,
        title: "Art Gallery Opening",
        date: "2023-08-05",
        time: "18:00",
        location: "Modern Art Museum",
        city: "Los Angeles",
        category: "arts",
        description: "Exhibition opening featuring contemporary artists from around the world.",
        organizer: "Art Foundation",
        price: "Free",
        image: "./images/art_gallery.png"
    },
    {
        id: 6,
        title: "Jazz Night",
        date: "2023-07-22",
        time: "20:00",
        location: "Blue Note Club",
        city: "New York",
        category: "music",
        description: "An evening of smooth jazz with renowned musicians.",
        organizer: "Jazz Society",
        price: "$25-$40",
        image: "./images/jazz_night.png"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const path = window.location.pathname.split('/').pop();
    
    if (path === 'index.html' || path === '') {
        initHomePage();
    } else if (path === 'events.html') {
        initEventsPage();
    } else if (path === 'event-details.html') {
        initEventDetailsPage();
    }
});

// Home page functions
function initHomePage() {
    // Display popular events (first 3 events)
    displayPopularEvents(eventData.slice(0, 3));
    
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = document.getElementById('searchInput').value;
            const dateFilter = document.getElementById('dateFilter').value;
            const categoryFilter = document.getElementById('categoryFilter').value;
            
            sessionStorage.setItem('searchTerm', searchTerm);
            sessionStorage.setItem('dateFilter', dateFilter);
            sessionStorage.setItem('categoryFilter', categoryFilter);
            
            // Redirect to events page
            window.location.href = 'events.html';
        });
    }
}

function displayPopularEvents(events) {
    const container = document.getElementById('popularEvents');
    if (!container) return;
    
    container.innerHTML = '';
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        container.appendChild(eventCard);
    });
}

// Events Page Functions
function initEventsPage() {

    const searchTerm = sessionStorage.getItem('searchTerm') || '';
    const dateFilter = sessionStorage.getItem('dateFilter') || 'all';
    const categoryFilter = sessionStorage.getItem('categoryFilter') || 'all';
    
    // Clear stored filters
    sessionStorage.removeItem('searchTerm');
    sessionStorage.removeItem('dateFilter');
    sessionStorage.removeItem('categoryFilter');
    
    // Filter events based on criteria
    let filteredEvents = filterEvents(searchTerm, dateFilter, categoryFilter);
    
    // Display filtered events
    displayEvents(filteredEvents);
    
    // Set up filter panel toggle
    const filterBtn = document.getElementById('filterBtn');
    const filterPanel = document.getElementById('filterPanel');
    
    if (filterBtn && filterPanel) {
        filterBtn.addEventListener('click', function() {
            filterPanel.classList.toggle('d-none');
        });
    }
    
    // Set up sorting
    const sortSelect = document.getElementById('sortEvents');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            let sortedEvents = [...filteredEvents];
            
            switch(sortValue) {
                case 'date-asc':
                    sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
                    break;
                case 'date-desc':
                    sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
                    break;
                case 'name-asc':
                    sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case 'name-desc':
                    sortedEvents.sort((a, b) => b.title.localeCompare(a.title));
                    break;
            }
            
            displayEvents(sortedEvents);
        });
    }
}

function filterEvents(searchTerm, dateFilter, categoryFilter) {
    let filtered = [...eventData];
    
    // Apply search term filter
    if (searchTerm) {
        filtered = filtered.filter(event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
    )}
    
    // Apply date filter
    if (dateFilter !== 'all') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(event => {
            const eventDate = new Date(event.date);
            
            switch(dateFilter) {
                case 'today':
                    return eventDate.toDateString() === today.toDateString();
                case 'week':
                    const nextWeek = new Date(today);
                    nextWeek.setDate(today.getDate() + 7);
                    return eventDate >= today && eventDate <= nextWeek;
                case 'month':
                    const nextMonth = new Date(today);
                    nextMonth.setMonth(today.getMonth() + 1);
                    return eventDate >= today && eventDate <= nextMonth;
                default:
                    return true;
            }
        });
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(event => event.category === categoryFilter);
    }
    
    return filtered;
}

function displayEvents(events) {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>No events found</h3>
                <p>Try adjusting your search filters</p>
            </div>
        `;
        return;
    }
    
    events.forEach(event => {
        const eventCard = createEventCard(event);
        container.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const eventDate = new Date(event.date);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = eventDate.toLocaleDateString('en-US', options);
    
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    col.innerHTML = `
        <div class="card h-100">
            <img src="${event.image}" class="card-img-top" alt="${event.title}">
            <div class="card-body">
                <span class="badge bg-primary mb-2">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                <h5 class="card-title">${event.title}</h5>
                <p class="card-text text-muted"><small><i class="bi bi-calendar-event me-1"></i> ${formattedDate} at ${event.time}</small></p>
                <p class="card-text text-muted"><small><i class="bi bi-geo-alt me-1"></i> ${event.location}, ${event.city}</small></p>
                <p class="card-text">${event.description.substring(0, 100)}...</p>
            </div>
            <div class="card-footer bg-transparent">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-primary fw-bold">${event.price}</span>
                    <a href="event-details.html?id=${event.id}" class="btn btn-sm btn-outline-primary">Details</a>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Event Details Page Functions
function initEventDetailsPage() {
    // Get event ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('id'));
    
    // Find the event
    const event = eventData.find(e => e.id === eventId);
    
    if (event) {
        displayEventDetails(event);
        displaySimilarEvents(event);
    } else {
        // Event not found - redirect to events page
        window.location.href = 'events.html';
    }
    
    // Set up booking button
    const bookBtn = document.getElementById('bookTicket');
    if (bookBtn) {
        bookBtn.addEventListener('click', function() {
            alert(`Booking for ${event.title} would be processed here.`);
        });
    }
}

function displayEventDetails(event) {
    const eventDate = new Date(event.date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = eventDate.toLocaleDateString('en-US', options);
    
    // Set all the event details
    document.getElementById('eventTitle').textContent = event.title;
    document.getElementById('eventCategory').textContent = event.category.charAt(0).toUpperCase() + event.category.slice(1);
    document.getElementById('eventDate').textContent = formattedDate;
    document.getElementById('eventTime').textContent = event.time;
    document.getElementById('eventLocation').textContent = `${event.location}, ${event.city}`;
    document.getElementById('eventDescription').textContent = event.description;
    document.getElementById('eventOrganizer').textContent = event.organizer;
    document.getElementById('eventDateTime').textContent = `${formattedDate} at ${event.time}`;
    document.getElementById('eventFullLocation').textContent = `${event.location}, ${event.city}`;
    document.getElementById('eventPrice').textContent = event.price;
}

function displaySimilarEvents(currentEvent) {
    const container = document.getElementById('similarEvents');
    if (!container) return;
    
    // Find similar events (same category, excluding current event)
    const similarEvents = eventData.filter(event => 
        event.category === currentEvent.category && 
        event.id !== currentEvent.id
    ).slice(0, 3); // Limit to 3 events
    
    if (similarEvents.length === 0) {
        container.innerHTML = '<p>No similar events found.</p>';
        return;
    }
    
    container.innerHTML = '';
    
    similarEvents.forEach(event => {
        const eventCard = createEventCard(event);
        container.appendChild(eventCard);
    });
}