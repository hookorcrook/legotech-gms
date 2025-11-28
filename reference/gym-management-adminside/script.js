// Gym Management System JavaScript

// Global variables
let currentSection = 'dashboard';
let members = [];
let classes = [];
let equipment = [];
let payments = [];
let staff = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboardData();
    showToast('Welcome to Elite Fitness Pro!', 'success');
});

function initializeApp() {
    // Initialize charts
    initializeCharts();
    
    // Load sample data
    loadSampleData();
    
    // Setup navigation
    setupNavigation();
    
    // Setup filters and search
    setupFilters();
}

function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            switchSection(section);
        });
    });
    
    // Member search
    document.getElementById('memberSearch')?.addEventListener('input', function() {
        filterMembers();
    });
    
    // Filters
    document.getElementById('membershipFilter')?.addEventListener('change', filterMembers);
    document.getElementById('statusFilter')?.addEventListener('change', filterMembers);
    
    // Payment filters
    document.getElementById('paymentStatus')?.addEventListener('change', filterPayments);
    document.getElementById('paymentMonth')?.addEventListener('change', filterPayments);
    
    // Report generation
    document.getElementById('reportPeriod')?.addEventListener('change', updateReports);
    document.getElementById('reportType')?.addEventListener('change', updateReports);
    
    // Day selector for classes
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadClassesForDay(this.dataset.day);
        });
    });
    
    // Date picker
    document.getElementById('dashboardDate')?.addEventListener('change', updateDashboardData);
}

function setupNavigation() {
    // Set initial active section
    switchSection('dashboard');
}

function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    currentSection = sectionName;
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            updateDashboardCharts();
            break;
        case 'members':
            loadMembers();
            break;
        case 'classes':
            loadClasses();
            break;
        case 'equipment':
            loadEquipment();
            break;
        case 'payments':
            loadPayments();
            break;
        case 'staff':
            loadStaff();
            break;
        case 'reports':
            updateReports();
            break;
    }
}

function setupFilters() {
    // Member filters are handled in filterMembers()
    // Payment filters are handled in filterPayments()
}

// Sample Data
function loadSampleData() {
    members = [
        {
            id: 1,
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '+1 234 567 8900',
            membership: 'premium',
            joinDate: '2024-01-10',
            status: 'active'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@email.com',
            phone: '+1 234 567 8901',
            membership: 'vip',
            joinDate: '2024-01-05',
            status: 'active'
        },
        {
            id: 3,
            name: 'Mike Wilson',
            email: 'mike.wilson@email.com',
            phone: '+1 234 567 8902',
            membership: 'basic',
            joinDate: '2024-01-12',
            status: 'inactive'
        }
    ];
    
    classes = [
        {
            id: 1,
            name: 'Yoga Flow',
            instructor: 'Sarah Johnson',
            time: '06:00 - 07:00',
            capacity: 20,
            booked: 15,
            location: 'Studio A',
            day: 'monday'
        },
        {
            id: 2,
            name: 'HIIT Training',
            instructor: 'Mike Wilson',
            time: '18:00 - 19:00',
            capacity: 25,
            booked: 18,
            location: 'Main Gym',
            day: 'monday'
        }
    ];
}

function loadDashboardData() {
    updateDashboardStats();
    updateDashboardCharts();
    loadRecentActivities();
}

function updateDashboardStats() {
    // Simulate real-time updates
    const stats = {
        totalMembers: 1247 + Math.floor(Math.random() * 10),
        todayCheckins: 287 + Math.floor(Math.random() * 20),
        monthlyRevenue: 45820 + Math.floor(Math.random() * 1000),
        classBookings: 156 + Math.floor(Math.random() * 10)
    };
    
    // Update the display with animation
    updateStatNumber('.stat-card:nth-child(1) .stat-number', stats.totalMembers);
    updateStatNumber('.stat-card:nth-child(2) .stat-number', stats.todayCheckins);
    updateStatNumber('.stat-card:nth-child(3) .stat-number', `$${stats.monthlyRevenue.toLocaleString()}`);
    updateStatNumber('.stat-card:nth-child(4) .stat-number', stats.classBookings);
}

function updateStatNumber(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.style.opacity = '0';
        setTimeout(() => {
            element.textContent = value;
            element.style.opacity = '1';
        }, 200);
    }
}

function loadRecentActivities() {
    const activities = [
        { type: 'user-plus', text: 'John Smith joined as premium member', time: '2 minutes ago' },
        { type: 'credit-card', text: 'Payment received from Sarah Johnson', time: '15 minutes ago' },
        { type: 'calendar', text: 'Yoga class booked by Mike Wilson', time: '32 minutes ago' },
        { type: 'dumbbell', text: 'Equipment maintenance completed', time: '1 hour ago' },
        { type: 'user-tie', text: 'New staff member added', time: '2 hours ago' }
    ];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.type}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span>${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

// Charts
let checkinsChart, revenueChart, memberGrowthChart, classPopularityChart;

function initializeCharts() {
    // Check-ins Chart
    const checkinsCtx = document.getElementById('checkinsChart');
    if (checkinsCtx) {
        checkinsChart = new Chart(checkinsCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily Check-ins',
                    data: [245, 289, 312, 267, 234, 198, 156],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        revenueChart = new Chart(revenueCtx, {
            type: 'bar',
            data: {
                labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [38200, 42100, 39800, 45600, 43200, 45820],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

function updateDashboardCharts() {
    // Update charts with new data
    if (checkinsChart) {
        checkinsChart.data.datasets[0].data = [
            245 + Math.floor(Math.random() * 50),
            289 + Math.floor(Math.random() * 50),
            312 + Math.floor(Math.random() * 50),
            267 + Math.floor(Math.random() * 50),
            234 + Math.floor(Math.random() * 50),
            198 + Math.floor(Math.random() * 50),
            156 + Math.floor(Math.random() * 50)
        ];
        checkinsChart.update();
    }
    
    if (revenueChart) {
        revenueChart.data.datasets[0].data = [
            38200 + Math.floor(Math.random() * 5000),
            42100 + Math.floor(Math.random() * 5000),
            39800 + Math.floor(Math.random() * 5000),
            45600 + Math.floor(Math.random() * 5000),
            43200 + Math.floor(Math.random() * 5000),
            45820 + Math.floor(Math.random() * 5000)
        ];
        revenueChart.update();
    }
}

// Member Management
function loadMembers() {
    updateMembersTable();
}

function filterMembers() {
    const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
    const membershipFilter = document.getElementById('membershipFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm) ||
                            member.email.toLowerCase().includes(searchTerm);
        const matchesMembership = !membershipFilter || member.membership === membershipFilter;
        const matchesStatus = !statusFilter || member.status === statusFilter;
        
        return matchesSearch && matchesMembership && matchesStatus;
    });
    
    displayMembers(filteredMembers);
}

function displayMembers(memberList) {
    const tableBody = document.querySelector('#membersTable tbody');
    if (tableBody) {
        tableBody.innerHTML = memberList.map(member => `
            <tr>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td><span class="badge ${member.membership}">${member.membership.charAt(0).toUpperCase() + member.membership.slice(1)}</span></td>
                <td>${member.joinDate}</td>
                <td><span class="badge ${member.status}">${member.status.charAt(0).toUpperCase() + member.status.slice(1)}</span></td>
                <td>
                    <button class="action-btn" onclick="editMember(${member.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn danger" onclick="deleteMember(${member.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function updateMembersTable() {
    displayMembers(members);
}

// Class Management
function loadClasses() {
    // Classes are already loaded in the HTML
    loadClassesForDay('monday');
}

function loadClassesForDay(day) {
    const filteredClasses = classes.filter(cls => cls.day === day);
    const classesGrid = document.getElementById('classesGrid');
    if (classesGrid) {
        classesGrid.innerHTML = filteredClasses.map(cls => `
            <div class="class-card">
                <div class="class-header">
                    <h3>${cls.name}</h3>
                    <span class="class-time">${cls.time}</span>
                </div>
                <div class="class-details">
                    <p><i class="fas fa-user"></i> ${cls.instructor}</p>
                    <p><i class="fas fa-users"></i> ${cls.booked}/${cls.capacity} members</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${cls.location}</p>
                </div>
                <div class="class-actions">
                    <button class="secondary-btn">Edit</button>
                    <button class="danger-btn">Cancel</button>
                </div>
            </div>
        `).join('');
    }
}

// Equipment Management
function loadEquipment() {
    // Equipment data is already in the HTML
    // This would typically load from a database
}

// Payment Management
function loadPayments() {
    // Payment data is already in the HTML
    // This would typically load from a payment processor
}

function filterPayments() {
    // Implementation for payment filtering
    showToast('Payment filters updated', 'success');
}

// Staff Management
function loadStaff() {
    // Staff data is already in the HTML
    // This would typically load from a staff database
}

// Reports
function loadReports() {
    updateReports();
}

function updateReports() {
    generateReportCharts();
}

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const reportPeriod = document.getElementById('reportPeriod').value;
    
    showToast(`Generating ${reportType} report for ${reportPeriod}`, 'success');
    
    // Simulate report generation
    setTimeout(() => {
        showToast('Report generated successfully!', 'success');
        generateReportCharts();
    }, 2000);
}

function generateReportCharts() {
    // Member Growth Chart
    const memberGrowthCtx = document.getElementById('memberGrowthChart');
    if (memberGrowthCtx) {
        if (memberGrowthChart) {
            memberGrowthChart.destroy();
        }
        
        memberGrowthChart = new Chart(memberGrowthCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Total Members',
                    data: [850, 920, 1050, 1100, 1150, 1180, 1200, 1220, 1230, 1235, 1240, 1247],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    // Class Popularity Chart
    const classPopularityCtx = document.getElementById('classPopularityChart');
    if (classPopularityCtx) {
        if (classPopularityChart) {
            classPopularityChart.destroy();
        }
        
        classPopularityChart = new Chart(classPopularityCtx, {
            type: 'doughnut',
            data: {
                labels: ['HIIT Training', 'Yoga Flow', 'Spin Class', 'Pilates', 'Zumba', 'CrossFit'],
                datasets: [{
                    data: [156, 142, 128, 98, 87, 75],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe',
                        '#00f2fe'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Modal Functions
function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

function showAddMemberModal() {
    const content = `
        <form id="addMemberForm">
            <div class="form-group">
                <label for="memberName">Full Name</label>
                <input type="text" id="memberName" name="name" required>
            </div>
            <div class="form-group">
                <label for="memberEmail">Email</label>
                <input type="email" id="memberEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="memberPhone">Phone</label>
                <input type="tel" id="memberPhone" name="phone" required>
            </div>
            <div class="form-group">
                <label for="memberMembership">Membership Type</label>
                <select id="memberMembership" name="membership" required>
                    <option value="">Select Membership</option>
                    <option value="basic">Basic - $79.99/month</option>
                    <option value="premium">Premium - $99.99/month</option>
                    <option value="vip">VIP - $149.99/month</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="secondary-btn" onclick="closeModal()">Cancel</button>
                <button type="submit" class="primary-btn">Add Member</button>
            </div>
        </form>
    `;
    
    showModal('Add New Member', content);
    
    // Handle form submission
    document.getElementById('addMemberForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const newMember = {
            id: members.length + 1,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            membership: formData.get('membership'),
            joinDate: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        
        members.push(newMember);
        updateMembersTable();
        closeModal();
        showToast('Member added successfully!', 'success');
    });
}

function showAddClassModal() {
    const content = `
        <form id="addClassForm">
            <div class="form-group">
                <label for="className">Class Name</label>
                <input type="text" id="className" name="name" required>
            </div>
            <div class="form-group">
                <label for="classInstructor">Instructor</label>
                <select id="classInstructor" name="instructor" required>
                    <option value="">Select Instructor</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Mike Wilson">Mike Wilson</option>
                    <option value="Emma Davis">Emma Davis</option>
                </select>
            </div>
            <div class="form-group">
                <label for="classTime">Time</label>
                <input type="time" id="classTime" name="time" required>
            </div>
            <div class="form-group">
                <label for="classDay">Day</label>
                <select id="classDay" name="day" required>
                    <option value="">Select Day</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                </select>
            </div>
            <div class="form-group">
                <label for="classCapacity">Capacity</label>
                <input type="number" id="classCapacity" name="capacity" min="1" required>
            </div>
            <div class="form-group">
                <label for="classLocation">Location</label>
                <select id="classLocation" name="location" required>
                    <option value="">Select Location</option>
                    <option value="Studio A">Studio A</option>
                    <option value="Studio B">Studio B</option>
                    <option value="Main Gym">Main Gym</option>
                    <option value="Spin Room">Spin Room</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="secondary-btn" onclick="closeModal()">Cancel</button>
                <button type="submit" class="primary-btn">Add Class</button>
            </div>
        </form>
    `;
    
    showModal('Add New Class', content);
    
    // Handle form submission
    document.getElementById('addClassForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const newClass = {
            id: classes.length + 1,
            name: formData.get('name'),
            instructor: formData.get('instructor'),
            time: formData.get('time') + ' - ' + formData.get('time'),
            capacity: parseInt(formData.get('capacity')),
            booked: 0,
            location: formData.get('location'),
            day: formData.get('day')
        };
        
        classes.push(newClass);
        loadClasses();
        closeModal();
        showToast('Class added successfully!', 'success');
    });
}

function showAddEquipmentModal() {
    const content = `
        <form id="addEquipmentForm">
            <div class="form-group">
                <label for="equipmentName">Equipment Name</label>
                <input type="text" id="equipmentName" name="name" required>
            </div>
            <div class="form-group">
                <label for="equipmentModel">Model</label>
                <input type="text" id="equipmentModel" name="model" required>
            </div>
            <div class="form-group">
                <label for="equipmentCategory">Category</label>
                <select id="equipmentCategory" name="category" required>
                    <option value="">Select Category</option>
                    <option value="cardio">Cardio</option>
                    <option value="strength">Strength Training</option>
                    <option value="functional">Functional Training</option>
                </select>
            </div>
            <div class="form-group">
                <label for="equipmentLocation">Location</label>
                <select id="equipmentLocation" name="location" required>
                    <option value="">Select Location</option>
                    <option value="Cardio Area">Cardio Area</option>
                    <option value="Weight Room">Weight Room</option>
                    <option value="Functional Training">Functional Training</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="secondary-btn" onclick="closeModal()">Cancel</button>
                <button type="submit" class="primary-btn">Add Equipment</button>
            </div>
        </form>
    `;
    
    showModal('Add New Equipment', content);
    
    // Handle form submission
    document.getElementById('addEquipmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Equipment added successfully!', 'success');
        closeModal();
    });
}

function showAddStaffModal() {
    const content = `
        <form id="addStaffForm">
            <div class="form-group">
                <label for="staffName">Full Name</label>
                <input type="text" id="staffName" name="name" required>
            </div>
            <div class="form-group">
                <label for="staffEmail">Email</label>
                <input type="email" id="staffEmail" name="email" required>
            </div>
            <div class="form-group">
                <label for="staffPhone">Phone</label>
                <input type="tel" id="staffPhone" name="phone" required>
            </div>
            <div class="form-group">
                <label for="staffPosition">Position</label>
                <select id="staffPosition" name="position" required>
                    <option value="">Select Position</option>
                    <option value="head-trainer">Head Trainer</option>
                    <option value="trainer">Trainer</option>
                    <option value="instructor">Instructor</option>
                    <option value="front-desk">Front Desk</option>
                    <option value="manager">Manager</option>
                </select>
            </div>
            <div class="form-group">
                <label for="staffSpecialization">Specialization</label>
                <input type="text" id="staffSpecialization" name="specialization" placeholder="e.g., Yoga, HIIT, Nutrition">
            </div>
            <div class="form-actions">
                <button type="button" class="secondary-btn" onclick="closeModal()">Cancel</button>
                <button type="submit" class="primary-btn">Add Staff</button>
            </div>
        </form>
    `;
    
    showModal('Add New Staff Member', content);
    
    // Handle form submission
    document.getElementById('addStaffForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('Staff member added successfully!', 'success');
        closeModal();
    });
}

// Action Functions
function editMember(memberId) {
    const member = members.find(m => m.id === memberId);
    if (member) {
        showToast(`Editing ${member.name}`, 'success');
        // In a real app, this would open an edit modal
    }
}

function deleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        members = members.filter(m => m.id !== memberId);
        updateMembersTable();
        showToast('Member deleted successfully!', 'success');
    }
}

// Utility Functions
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function updateDashboardData() {
    updateDashboardStats();
    showToast('Dashboard data updated!', 'success');
}

// Real-time updates simulation
setInterval(() => {
    if (currentSection === 'dashboard') {
        updateDashboardStats();
    }
}, 30000); // Update every 30 seconds

// Form styles for modals (inline since we don't have a separate form CSS)
const formStyles = `
<style>
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
}
</style>
`;

// Add form styles to modal content
document.addEventListener('DOMContentLoaded', function() {
    document.head.insertAdjacentHTML('beforeend', formStyles);
});