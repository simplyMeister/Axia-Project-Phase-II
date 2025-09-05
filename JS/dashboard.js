const recentCourses = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    progress: 75,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    instructor: "Mosh Hamed",
    nextLesson: "Arrays and Objects",
  },
  {
    id: 2,
    title: "React Development",
    progress: 45,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    instructor: "Mosh Hamed",
    nextLesson: "State Management",
  },
  {
    id: 3,
    title: "Python for Beginners",
    progress: 90,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    instructor: "Mosh Hamed",
    nextLesson: "Final Project",
  },
  {
    id: 4,
    title: "Data Science Basics",
    progress: 60,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rstudio/rstudio-original.svg",
    instructor: "Free CodeCamp",
    nextLesson: "Data Visualization",
  },
  {
    id: 5,
    title: "Web Development with Django",
    progress: 30,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    instructor: "Free CodeCamp",
    nextLesson: "Models and Migrations",
  },
  {
    id: 6,
    title: "Machine Learning 101",
    progress: 20,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    instructor: "Free CodeCamp",
    nextLesson: "Supervised Learning",
  },
  {
    id: 7,
    title: "UI/UX Design Principles",
    progress: 80,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    instructor: "Free CodeCamp",
    nextLesson: "Prototyping",
  },
  {
    id: 8,
    title: "Cloud Computing Basics",
    progress: 50,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg",
    instructor: "edureka!",
    nextLesson: "Cloud Fundamentals",
  },

  {
    id: 9,
    title: "Cybersecurity Essentials",
    progress: 40,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    instructor: "Simplilearn",
    nextLesson: "Network Security",
  },
  {
    id: 10,
    title: "Mobile App Development",
    progress: 55,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg",
    instructor: "Mosh Hamed",
    nextLesson: "React Native Basics",
  },
  {
    id: 11,
    title: "Digital Marketing 101",
    progress: 65,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
    instructor: "Adam Erhart",
    nextLesson: "SEO Strategies",
  },
  {
    id: 12,
    title: "Project Management Fundamentals",
    progress: 35,
    thumbnail:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg",
    instructor: "Invensis Learning",
    nextLesson: "Agile Methodologies",
  },
];

const upcomingDeadlines = [
  {
    title: "React Assignment #3",
    course: "React Development",
    dueDate: "Tomorrow",
    priority: "high",
  },
  {
    title: "Python Quiz",
    course: "Python for Beginners",
    dueDate: "3 days",
    priority: "medium",
  },
  {
    title: "JavaScript Project",
    course: "JavaScript Fundamentals",
    dueDate: "1 week",
    priority: "low",
  },
  {
    title: "Data Science Report",
    course: "Data Science Basics",
    dueDate: "5 days",
    priority: "medium",
  },
  {
    title: "Django Midterm",
    course: "Web Development with Django",
    dueDate: "4 days",
    priority: "high",
  },
  {
    title: "Machine Learning Assignment",
    course: "Machine Learning 101",
    dueDate: "1 week",
    priority: "low",
  },
  {
    title: "UI/UX Design Project",
    course: "UI/UX Design Principles",
    dueDate: "2 weeks",
    priority: "low",
  },
  {
    title: "Cloud Computing Quiz",
    course: "Cloud Computing Basics",
    dueDate: "3 days",
    priority: "medium",
  },
  {
    title: "Cybersecurity Assignment",
    course: "Cybersecurity Essentials",
    dueDate: "6 days",
    priority: "medium",
  },
  {
    title: "Mobile App Prototype",
    course: "Mobile App Development",
    dueDate: "1 week",
    priority: "low",
  },
  {
    title: "Digital Marketing Plan",
    course: "Digital Marketing 101",
    dueDate: "5 days",
    priority: "high",
  },
  {
    title: "Final Exam",
    course: "All Courses",
    dueDate: "1 month",
    priority: "high",
  },
  {
    title: "Axia Project Phase",
    course: "Front End Dev",
    dueDate: "1 week",
    priority: "high",
  },
  {
    title: "MIS426",
    course: "Project Philosophy",
    dueDate: "2 months",
    priority: "low",
  },
  
];

// UI Functions
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");

  sidebar.classList.toggle("open");
  overlay.classList.toggle("hidden");
}

function toggleUserMenu() {
  const menu = document.getElementById("user-menu");
  menu.classList.toggle("hidden");
}

// Toast notification system
function showToast(message, type = "info", duration = 4000) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function logout() {
  // Remove any previous confirmation toast
  const container = document.getElementById("toast-container");
  if (!container) return;

  // Remove any existing confirmation toasts
  Array.from(container.children).forEach((child) => {
    if (child.classList.contains("toast-confirm")) child.remove();
  });

  // Create confirmation toast
  const toast = document.createElement("div");
  toast.className = "toast toast-confirm";
  toast.innerHTML = `
    <span>Are you sure you want to logout?</span>
    <div class="mt-3 flex space-x-2">
      <button id="logout-yes" class="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition">Yes</button>
      <button id="logout-no" class="px-3 py-1 rounded bg-gray-700 text-white font-semibold hover:bg-gray-800 transition">No</button>
    </div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Button logic
  toast.querySelector("#logout-yes").onclick = function () {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
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

// Load dashboard data

function loadRecentCourses() {
  const container = document.getElementById("recent-courses");

  // YouTube video URLs for each course
  const courseVideos = {
    "JavaScript Fundamentals": "https://www.youtube.com/watch?v=W6NZfCO5SIk",
    "React Development": "https://www.youtube.com/watch?v=SqcY0GlETPk",
    "Python for Beginners": "https://www.youtube.com/watch?v=kqtD5dpn9C8",
    "Data Science Basics": "https://www.youtube.com/watch?v=ua-CiDNNj30",
    "Web Development with Django":
      "https://www.youtube.com/watch?v=F5mRW0jo-U4",
    "Machine Learning 101": "https://www.youtube.com/watch?v=NWONeJKn6kc",
    "UI/UX Design Principles": "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
    "Cloud Computing Basics": "https://www.youtube.com/watch?v=2LaAJq1lB1Q",
    "Cybersecurity Essentials": "https://www.youtube.com/watch?v=inWWhr5tnEA",
    "Mobile App Development": "https://www.youtube.com/watch?v=0-S5a0eXPoc",
    "Digital Marketing 101": "https://www.youtube.com/watch?v=h95cQkEWBx0",
    "Project Management Fundamentals":
    "https://www.youtube.com/watch?v=cLXkOYaZ_K0",
  };

  container.innerHTML = recentCourses
    .map(
      (course) => `
        <div class="flex flex-col sm:flex-row items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors w-full">
          <img src="${
            course.thumbnail
          }" class="w-16 h-16 min-w-16 min-h-16 rounded-lg object-contain bg-white" />
          <div class="sm:ml-4 mt-4 sm:mt-0 flex-1 flex flex-col justify-center min-h-16 w-full">
            <div class="flex flex-col sm:flex-row sm:items-center w-full">
              <h4 class="font-medium text-white text-lg truncate w-full sm:w-auto" style="max-width: 220px;">${
                course.title
              }</h4>
              <span class="hidden sm:inline mx-3 text-gray-600">|</span>
              <p class="text-sm text-gray-400 font-medium truncate w-full sm:w-auto" style="max-width: 140px;">by ${
                course.instructor
              }</p>
            </div>
            <p class="text-sm text-cyan-600 mt-1">Next: ${course.nextLesson}</p>
            <div class="mt-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-400">Progress</span>
                <span class="font-medium">${course.progress}%</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                <div class="bg-cyan-600 h-2 rounded-full" style="width: ${
                  course.progress
                }%"></div>
              </div>
            </div>
          </div>
          <a href="${
            courseVideos[course.title]
          }" target="_blank" class="sm:ml-4 mt-4 sm:mt-0 text-cyan-600 hover:text-cyan-400" title="Watch course video on YouTube">
            <i class="fas fa-play-circle text-2xl"></i>
          </a>
        </div>
      `
    )
    .join("");
}

function loadUpcomingDeadlines() {
  const container = document.getElementById("upcoming-deadlines");
  container.innerHTML = upcomingDeadlines
    .map((deadline) => {
      const priorityColors = {
        high: "bg-red-900 text-red-400",
        medium: "bg-yellow-900 text-yellow-400",
        low: "bg-green-900 text-green-400",
      };

      return `
                    <div class="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                        <div class="flex-1">
                            <h4 class="font-medium text-white">${
                              deadline.title
                            }</h4>
                            <p class="text-sm text-gray-400">${
                              deadline.course
                            }</p>
                        </div>
                        <div class="text-right">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              priorityColors[deadline.priority]
                            }">
                                ${deadline.dueDate}
                            </span>
                        </div>
                    </div>
                `;
    })
    .join("");
}

// Initialize dashboard
function initDashboard() {
  // Load user info
  const userName = localStorage.getItem("userName") || "Student";
  const userEmail = localStorage.getItem("userEmail") || "student@example.com";

  document.getElementById("welcome-name").textContent = userName.split(" ")[0];
  document.getElementById("user-name").textContent = userName;

  // Load dashboard data
  loadRecentCourses();
  loadUpcomingDeadlines();
}

// Check authentication
function checkAuth() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Close user menu when clicking outside
document.addEventListener("click", function (event) {
  const userMenu = document.getElementById("user-menu");
  const userMenuButton = event.target.closest(
    'button[onclick="toggleUserMenu()"]'
  );

  if (!userMenuButton && !userMenu.contains(event.target)) {
    userMenu.classList.add("hidden");
  }
});

// Initialize on page load
window.addEventListener("load", () => {
  if (checkAuth()) {
    initDashboard();
  }
});
function setUserProfileDisplay() {
  // Sidebar
  const sidebarAvatar = document.getElementById("sidebar-user-avatar");
  const sidebarName = document.getElementById("sidebar-user-name");
  if (sidebarAvatar)
    sidebarAvatar.src =
      localStorage.getItem("userAvatarSmall") ||
      "/placeholder.svg?height=40&width=40";
  if (sidebarName)
    sidebarName.textContent = localStorage.getItem("userName") || "John Doe";
  // Header
  const headerAvatar = document.getElementById("header-user-avatar");
  if (headerAvatar)
    headerAvatar.src =
      localStorage.getItem("userAvatarThumb") ||
      "/placeholder.svg?height=32&width=32";
  // Profile main avatar (optional, if present)
  const profileAvatar = document.getElementById("profile-avatar");
  if (profileAvatar)
    profileAvatar.src =
      localStorage.getItem("userAvatar") ||
      "/placeholder.svg?height=96&width=96";
  // Profile name/email (optional, if present)
  const profileName = document.getElementById("profile-name");
  if (profileName)
    profileName.textContent = localStorage.getItem("userName") || "John Doe";
  const profileEmail = document.getElementById("profile-email");
  if (profileEmail)
    profileEmail.textContent =
      localStorage.getItem("userEmail") || "john.doe@example.com";
}
window.addEventListener("load", setUserProfileDisplay);

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
