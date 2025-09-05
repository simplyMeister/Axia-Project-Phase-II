 let currentUser = null;
        let currentTab = 'overview';
        
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
        showToast("Logged out successfully.", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    };
    toast.querySelector("#logout-no").onclick = function () {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    };
}

        
        function switchTab(tabName) {
            currentTab = tabName;
            
            // Update tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active', 'text-cyan-600', 'border-cyan-600');
                btn.classList.add('text-gray-500', 'border-transparent');
            });
            
            event.target.classList.add('active', 'text-cyan-600', 'border-cyan-600');
            event.target.classList.remove('text-gray-500', 'border-transparent');
            
            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            document.getElementById(`${tabName}-tab`).classList.remove('hidden');
        }
        
        function editProfile() {
            switchTab('personal');
            // Switch to personal tab button
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active', 'text-cyan-600', 'border-cyan-600');
                btn.classList.add('text-gray-500', 'border-transparent');
            });
            
            const personalTabBtn = document.querySelectorAll('.tab-button')[1];
            personalTabBtn.classList.add('active', 'text-cyan-600', 'border-cyan-600');
            personalTabBtn.classList.remove('text-gray-500', 'border-transparent');
        }
        
        function changeProfilePicture() {
            alert('Profile picture change functionality would be implemented here.\n\nIn a real application, this would open a file picker or camera interface.');
        }
        
        function savePersonalInfo(event) {
            event.preventDefault();
            
            // Get form data
            const formData = new FormData(event.target);
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            
            // Update current user data
            currentUser.name.first = firstName;
            currentUser.name.last = lastName;
            currentUser.email = email;
            
            // Update UI
            updateProfileDisplay();
            
            showToast('Profile updated successfully!');
            switchTab('overview');
        }
        
        function cancelEdit() {
            // Reset form to current user data
            populatePersonalInfoForm();
            switchTab('overview');
        }
        
        function deleteAccount() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                if (confirm('This will permanently delete all your data. Are you absolutely sure?')) {
                    showToast('Account deletion would be processed here.\n\nIn a real application, this would delete the user account and redirect to the homepage.');
                    // logout();
                }
            }
        }
        
        async function generateNewProfile() {
            if (confirm('Generate a new random profile? This will replace your current profile data.')) {
                document.getElementById('loading-state').classList.remove('hidden');
                document.getElementById('profile-content').classList.add('hidden');
                
                await loadUserProfile();
            }
        }
        
        // Load user profile from Random User API
        async function loadUserProfile() {
            try {
                const response = await fetch('https://randomuser.me/api/');
                const data = await response.json();
                currentUser = data.results[0];
                
                // Store user data
                localStorage.setItem('userName', `${currentUser.name.first} ${currentUser.name.last}`);
                localStorage.setItem('userEmail', currentUser.email);
                
                updateProfileDisplay();
                populatePersonalInfoForm();
                
                // Hide loading state and show profile
                document.getElementById('loading-state').classList.add('hidden');
                document.getElementById('profile-content').classList.remove('hidden');
                
            } catch (error) {
                console.error('Error loading user profile:', error);
                
                // Use fallback data
                currentUser = {
                    name: { first: 'John', last: 'Doe' },
                    email: 'john.doe@example.com',
                    phone: '+1 (555) 123-4567',
                    dob: { date: '1990-01-01' },
                    gender: 'male',
                    location: {
                        street: { number: 123, name: 'Main St' },
                        city: 'Anytown',
                        state: 'State',
                        postcode: '12345',
                        country: 'Country'
                    },
                    picture: { large: '/placeholder.svg?height=96&width=96' }
                };
                
                updateProfileDisplay();
                populatePersonalInfoForm();
                
                document.getElementById('loading-state').classList.add('hidden');
                document.getElementById('profile-content').classList.remove('hidden');
            }
        }
        
        function updateProfileDisplay() {
            const fullName = `${currentUser.name.first} ${currentUser.name.last}`;
            
            // Update profile header
            document.getElementById('profile-name').textContent = fullName;
            document.getElementById('profile-email').textContent = currentUser.email;
            document.getElementById('profile-avatar').src = currentUser.picture?.large || '/placeholder.svg?height=96&width=96';
            
            // Update sidebar
            document.getElementById('sidebar-user-name').textContent = fullName;
            document.getElementById('sidebar-user-avatar').src = currentUser.picture?.medium || '/placeholder.svg?height=40&width=40';
            
            // Update header
            document.getElementById('header-user-avatar').src = currentUser.picture?.thumbnail || '/placeholder.svg?height=32&width=32';
            
            // Update join date (random date in the past year)
            const joinDate = new Date();
            joinDate.setMonth(joinDate.getMonth() - Math.floor(Math.random() * 12));
            document.getElementById('join-date').textContent = joinDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
             syncProfileToLocalStorage();
             setUserProfileDisplay();
        }
        
        function populatePersonalInfoForm() {
            if (!currentUser) return;
            
            document.getElementById('first-name').value = currentUser.name.first;
            document.getElementById('last-name').value = currentUser.name.last;
            document.getElementById('email').value = currentUser.email;
            document.getElementById('phone').value = currentUser.phone || '';
            document.getElementById('dob').value = currentUser.dob?.date?.split('T')[0] || '';
            document.getElementById('gender').value = currentUser.gender || '';
            
            // Build address string
            const location = currentUser.location;
            if (location) {
                const address = `${location.street?.number || ''} ${location.street?.name || ''}, ${location.city || ''}, ${location.state || ''} ${location.postcode || ''}, ${location.country || ''}`.trim();
                document.getElementById('address').value = address;
            }
            
            document.getElementById('bio').value = `I'm a passionate learner interested in technology and continuous improvement. Currently enrolled in multiple courses to expand my skills.`;
        }
        
        // Check authentication
        function checkAuth() {
            const token = localStorage.getItem('authToken');
            if (!token) {
                window.location.href = 'login.html';
                return false;
            }
            return true;
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
                loadUserProfile();
            }
        });

        

function syncProfileToLocalStorage() {
    if (!currentUser || !currentUser.name || !currentUser.picture) return;
    localStorage.setItem('userName', `${currentUser.name.first} ${currentUser.name.last}`);
    localStorage.setItem('userEmail', currentUser.email);
    localStorage.setItem('userAvatar', currentUser.picture.large || '/placeholder.svg?height=96&width=96');
    localStorage.setItem('userAvatarSmall', currentUser.picture.medium || '/placeholder.svg?height=40&width=40');
    localStorage.setItem('userAvatarThumb', currentUser.picture.thumbnail || '/placeholder.svg?height=32&width=32');
}

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

// Call this after loading or generating a new profile



// On page load, please abeg always sync display from localStorage
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

 

  