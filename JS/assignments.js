let allAssignments = [];
        let filteredAssignments = [];
        let currentStatus = 'all';
        let currentSort = 'dueDate';
        
        // UI Functions
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            
            sidebar.classList.toggle('open');
            overlay.classList.toggle('hidden');
        }
        
        function toggleUserMenu() {
            const menu = document.getElementById('user-menu');
            menu.classList.toggle('hidden');
        }
  
function logout() {
    // Remove any previous confirmation toast
    const existing = document.querySelector('.toast-confirm');
    if (existing) existing.remove();

    // Create confirmation toast
    const toast = document.createElement('div');
    toast.className = 'toast toast-confirm fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 bg-gray-800 border border-cyan-600 text-white max-w-xs';
    toast.innerHTML = `
        <div class="mb-2 font-semibold">Are you sure you want to logout?</div>
        <div class="flex space-x-2 mt-2">
            <button id="logout-yes" class="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition">Yes</button>
            <button id="logout-no" class="px-3 py-1 rounded bg-gray-700 text-white font-semibold hover:bg-gray-800 transition">No</button>
        </div>
    `;
    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);

    // Button logic
    toast.querySelector("#logout-yes").onclick = function () {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        showNotification("Logged out successfully.", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    };
    toast.querySelector("#logout-no").onclick = function () {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    };
}

        
        function filterByStatus(status) {
            currentStatus = status;
            
            // Update filter buttons
            document.querySelectorAll('.status-filter').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('bg-gray-100', 'text-gray-700');
                btn.classList.remove('bg-cyan-600', 'text-white');
            });
            
            event.target.classList.add('active');
            event.target.classList.remove('bg-gray-100', 'text-gray-700');
            event.target.classList.add('bg-cyan-600', 'text-white');
            
            applyFilters();
        }
        
        function filterAssignments() {
            applyFilters();
        }
        
        function sortAssignments() {
            currentSort = document.getElementById('sort-select').value;
            applyFilters();
        }
        
        function applyFilters() {
            const searchTerm = document.getElementById('assignment-search').value.toLowerCase();
            
            filteredAssignments = allAssignments.filter(assignment => {
                const matchesSearch = assignment.title.toLowerCase().includes(searchTerm) || 
                                    assignment.course.toLowerCase().includes(searchTerm);
                const matchesStatus = currentStatus === 'all' || assignment.status === currentStatus;
                
                return matchesSearch && matchesStatus;
            });
            
            // Sort assignments
            filteredAssignments.sort((a, b) => {
                switch (currentSort) {
                    case 'dueDate':
                        return new Date(a.dueDate) - new Date(b.dueDate);
                    case 'priority':
                        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                        return priorityOrder[b.priority] - priorityOrder[a.priority];
                    case 'course':
                        return a.course.localeCompare(b.course);
                    case 'status':
                        return a.status.localeCompare(b.status);
                    default:
                        return 0;
                }
            });
            
            renderAssignments();
            updateStats();
        }
        
        function clearFilters() {
            document.getElementById('assignment-search').value = '';
            currentStatus = 'all';
            currentSort = 'dueDate';
            
            // Reset filter buttons
            document.querySelectorAll('.status-filter').forEach(btn => {
                btn.classList.remove('active', 'bg-cyan-600', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            });
            
            document.querySelector('.status-filter').classList.add('active');
            document.querySelector('.status-filter').classList.remove('bg-gray-100', 'text-gray-700');
            document.querySelector('.status-filter').classList.add('bg-cyan-600', 'text-white');
            
            document.getElementById('sort-select').value = 'dueDate';
            
            applyFilters();
        }
        
        function updateStats() {
            const total = allAssignments.length;
            const pending = allAssignments.filter(a => a.status === 'pending').length;
            const completed = allAssignments.filter(a => a.status === 'completed').length;
            const overdue = allAssignments.filter(a => a.status === 'overdue').length;
            
            document.getElementById('total-count').textContent = total;
            document.getElementById('pending-count').textContent = pending;
            document.getElementById('completed-count').textContent = completed;
            document.getElementById('overdue-count').textContent = overdue;
        }
        
        function renderAssignments() {
            const container = document.getElementById('assignments-container');
            const emptyState = document.getElementById('empty-state');
            
            if (filteredAssignments.length === 0) {
                container.classList.add('hidden');
                emptyState.classList.remove('hidden');
                return;
            }
            
            container.classList.remove('hidden');
            emptyState.classList.add('hidden');
            
            container.innerHTML = filteredAssignments.map(assignment => createAssignmentCard(assignment)).join('');
        }
        
        function createAssignmentCard(assignment) {
            const statusColors = {
                'pending': 'bg-orange-100 text-orange-800',
                'completed': 'bg-emerald-100 text-emerald-800',
                'overdue': 'bg-red-100 text-red-800'
            };
            
            const priorityColors = {
                'High': 'text-red-600',
                'Medium': 'text-yellow-600',
                'Low': 'text-emerald-600'
            };
            
            const priorityClass = `priority-${assignment.priority.toLowerCase()}`;
            const daysUntilDue = Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
            const dueDateText = daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : 
                               daysUntilDue === 0 ? 'Due today' : 
                               daysUntilDue === 1 ? 'Due tomorrow' : 
                               `Due in ${daysUntilDue} days`;
            
            return `
                <div class="assignment-card ${priorityClass} bg-white rounded-xl shadow-sm p-6">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex-1">
                            <div class="flex items-center mb-2">
                                <h3 class="font-heading text-lg font-semibold text-gray-900 mr-3">
                                    ${assignment.title}
                                </h3>
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[assignment.status]}">
                                    ${assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                </span>
                            </div>
                            
                            <div class="flex items-center text-sm text-gray-600 mb-2">
                                <i class="fas fa-book mr-2"></i>
                                <span class="mr-4">${assignment.course}</span>
                                <i class="fas fa-tag mr-2"></i>
                                <span>${assignment.type}</span>
                            </div>
                            
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fas fa-calendar mr-2"></i>
                                <span class="mr-4">${dueDateText}</span>
                                <i class="fas fa-flag mr-2 ${priorityColors[assignment.priority]}"></i>
                                <span class="${priorityColors[assignment.priority]} capitalize">${assignment.priority} Priority</span>
                                <span class="ml-4 flex items-center">
                                    <i class="fas fa-star mr-1"></i>
                                    ${assignment.points} pts
                                </span>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-2 ml-4">
                            ${assignment.status === 'pending' ? `
                                <button onclick="markAsCompleted(${assignment.id})" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    <i class="fas fa-check mr-1"></i>
                                    Complete
                                </button>
                            ` : assignment.status === 'completed' ? `
                                <button onclick="viewSubmission(${assignment.id})" class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    <i class="fas fa-eye mr-1"></i>
                                    View
                                </button>
                            ` : `
                                <button onclick="resubmit(${assignment.id})" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    <i class="fas fa-redo mr-1"></i>
                                    Resubmit
                                </button>
                            `}
                            
                            <button onclick="viewDetails(${assignment.id})" class="text-gray-400 hover:text-gray-600 p-2">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div class="flex items-center text-sm text-gray-500">
                            <i class="fas fa-clock mr-2"></i>
                            <span>Due: ${new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        
                        ${assignment.grade ? `
                            <div class="flex items-center text-sm">
                                <span class="text-gray-500 mr-2">Grade:</span>
                                <span class="font-semibold text-emerald-600">${assignment.grade}%</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        async function markAsCompleted(assignmentId) {
            const assignment = allAssignments.find(a => a.id === assignmentId);
            if (!assignment) return;
            
            try {
                // Show loading state
                const button = event.target;
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Submitting...';
                button.disabled = true;
                
                // Update assignment via API
                await window.apiService.updateAssignment(assignmentId, true);
                
                // Update local state
                assignment.status = 'completed';
                assignment.grade = Math.floor(Math.random() * 30 + 70); // Random grade 70-100
                
                applyFilters();
                showNotification(`Assignment "${assignment.title}" marked as completed!`, 'success');
                
            } catch (error) {
                console.error('Error updating assignment:', error);
                showNotification('Failed to update assignment. Please try again.', 'error');
                
                // Reset button
                const button = event.target;
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }
        
        function viewSubmission(assignmentId) {
            const assignment = allAssignments.find(a => a.id === assignmentId);
            if (assignment) {
                showNotification(`Viewing submission for: ${assignment.title}`, 'info');
               
            }
        }
        
        async function resubmit(assignmentId) {
            const assignment = allAssignments.find(a => a.id === assignmentId);
            if (!assignment) return;
            
            if (confirm(`Resubmit assignment: ${assignment.title}?`)) {
                try {
                    await window.apiService.updateAssignment(assignmentId, false);
                    assignment.status = 'pending';
                    assignment.grade = null;
                    applyFilters();
                    showNotification(`Assignment "${assignment.title}" reopened for resubmission`, 'info');
                } catch (error) {
                    console.error('Error resubmitting assignment:', error);
                    showNotification('Failed to resubmit assignment. Please try again.', 'error');
                }
            }
        }
        
        function viewDetails(assignmentId) {
            const assignment = allAssignments.find(a => a.id === assignmentId);
            if (assignment) {
                const details = `
Assignment Details:

Title: ${assignment.title}
Course: ${assignment.course}
Type: ${assignment.type}
Due Date: ${new Date(assignment.dueDate).toLocaleDateString()}
Priority: ${assignment.priority}
Status: ${assignment.status}
Points: ${assignment.points}
${assignment.grade ? `Grade: ${assignment.grade}%` : ''}
                `.trim();
                
                alert(details);
            }
        }
        
        async function loadAssignments() {
            try {
                const todos = await window.apiService.getAssignments();
                
                // Process assignment data using API service
                allAssignments = window.apiService.processAssignmentData(todos.slice(0, 50));
                
                // Determine status based on due date and completion
                allAssignments = allAssignments.map(assignment => {
                    const dueDate = new Date(assignment.dueDate);
                    const isOverdue = dueDate < new Date() && !assignment.completed;
                    
                    return {
                        ...assignment,
                        status: isOverdue ? 'overdue' : assignment.completed ? 'completed' : 'pending',
                        grade: assignment.completed ? Math.floor(Math.random() * 30 + 70) : null
                    };
                });
                
                filteredAssignments = [...allAssignments];
                
                // Hide loading state and show assignments
                document.getElementById('loading-state').classList.add('hidden');
                renderAssignments();
                updateStats();
                
                showNotification(`Loaded ${allAssignments.length} assignments successfully`, 'success');
                
            } catch (error) {
                console.error('Error loading assignments:', error);
                showErrorState();
                showNotification('Failed to load assignments. Please try again.', 'error');
            }
        }
        
        function showErrorState() {
            document.getElementById('loading-state').innerHTML = `
                <div class="text-center py-12">
                    <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                    </div>
                    <h3 class="font-heading text-xl font-semibold text-gray-900 mb-2">Failed to load assignments</h3>
                    <p class="text-gray-600 mb-6">Please check your internet connection and try again</p>
                    <button onclick="retryLoadAssignments()" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-colors mr-4">
                        <i class="fas fa-redo mr-2"></i>Retry
                    </button>
                    <button onclick="loadSampleAssignments()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        <i class="fas fa-database mr-2"></i>Load Sample Data
                    </button>
                </div>
            `;
        }
        
        function retryLoadAssignments() {
            document.getElementById('loading-state').innerHTML = `
                <div class="space-y-4">
                    ${Array(6).fill().map(() => `
                        <div class="loading-skeleton bg-white rounded-xl shadow-sm p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div class="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div class="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    `).join('')}
                </div>
            `;
            loadAssignments();
        }
        
        function loadSampleAssignments() {
            const sampleAssignments = [
                {
                    id: 1,
                    title: "JavaScript Fundamentals Quiz",
                    course: "Web Development",
                    type: "Quiz",
                    status: "pending",
                    priority: "High",
                    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    points: 25,
                    completed: false
                },
                {
                    id: 2,
                    title: "React Component Project",
                    course: "Frontend Development",
                    type: "Project",
                    status: "completed",
                    priority: "Medium",
                    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    points: 50,
                    completed: true,
                    grade: 92
                }
            ];
            
            allAssignments = sampleAssignments;
            filteredAssignments = [...allAssignments];
            
            document.getElementById('loading-state').classList.add('hidden');
            renderAssignments();
            updateStats();
            
            showNotification('Loaded sample assignment data', 'info');
        }
        
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full ${
                type === 'error' ? 'bg-red-500 text-white' : 
                type === 'success' ? 'bg-emerald-500 text-white' : 
                'bg-blue-500 text-white'
            }`;
            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'success' ? 'fa-check-circle' : 'fa-info-circle'} mr-2"></i>
                    ${message}
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white/80 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.remove('translate-x-full');
            }, 100);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
        
        // Check authentication
        function checkAuth() {
            return window.apiService.isAuthenticated();
        }
        
        // Initialize user info
        function initUserInfo() {
            const userName = localStorage.getItem('userName') || 'Student';
            document.getElementById('user-name').textContent = userName;
        }
        
        // Close user menu when clicking outside
        document.addEventListener('click', function(event) {
            const userMenu = document.getElementById('user-menu');
            const userMenuButton = event.target.closest('button[onclick="toggleUserMenu()"]');
            
            if (!userMenuButton && !userMenu.contains(event.target)) {
                userMenu.classList.add('hidden');
            }
        });
        
        // Initialize on page load
        window.addEventListener('load', () => {
            if (checkAuth()) {
                initUserInfo();
                loadAssignments();
            }
        });

    function setUserProfileDisplay() {
    // Sidebar
    const sidebarAvatar = document.getElementById('sidebar-user-avatar');
    const sidebarName = document.getElementById('sidebar-user-name');
    if (sidebarAvatar) sidebarAvatar.src = localStorage.getItem('userAvatarSmall') || '/placeholder.svg?height=40&width=40';
    if (sidebarName) sidebarName.textContent = localStorage.getItem('userName') || 'John Doe';
    // Header
    const headerAvatar = document.getElementById('header-user-avatar');
    if (headerAvatar) headerAvatar.src = localStorage.getItem('userAvatarThumb') || '/placeholder.svg?height=32&width=32';
    // Profile main avatar
    const profileAvatar = document.getElementById('profile-avatar');
    if (profileAvatar) profileAvatar.src = localStorage.getItem('userAvatar') || '/placeholder.svg?height=96&width=96';
    // Profile name/email
    const profileName = document.getElementById('profile-name');
    if (profileName) profileName.textContent = localStorage.getItem('userName') || 'John Doe';
    const profileEmail = document.getElementById('profile-email');
    if (profileEmail) profileEmail.textContent = localStorage.getItem('userEmail') || 'john.doe@example.com';
}

window.addEventListener('load', setUserProfileDisplay);

  // Notification dropdown logic
  const notificationBtn = document.getElementById("notification-btn");
  const notificationDropdown = document.getElementById("notification-dropdown");

  notificationBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    notificationDropdown.classList.toggle("hidden");
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", function (event) {
    if (
      notificationDropdown &&
      !notificationDropdown.classList.contains("hidden") &&
      !notificationBtn.contains(event.target) &&
      !notificationDropdown.contains(event.target)
    ) {
      notificationDropdown.classList.add("hidden");
    }
  });