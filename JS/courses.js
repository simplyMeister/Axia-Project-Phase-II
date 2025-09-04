let allCourses = [];
      let filteredCourses = [];
      let currentView = "grid";
      let currentCategory = "all";

      
      const categoryMapping = {
        electronics: "Technology",
        jewelery: "Design",
        "men's clothing": "Business",
        "women's clothing": "Creative",
      };

     
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

      
      function logout() {
       
        const existing = document.querySelector(".toast-confirm");
        if (existing) existing.remove();

        const toast = document.createElement("div");
        toast.className =
          "toast toast-confirm fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 bg-gray-800 border border-cyan-600 text-white max-w-xs";
        toast.innerHTML = `
        <div class="mb-2 font-semibold">Are you sure you want to logout?</div>
        <div class="flex space-x-2 mt-2">
            <button id="logout-yes" class="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition">Yes</button>
            <button id="logout-no" class="px-3 py-1 rounded bg-gray-700 text-white font-semibold hover:bg-gray-800 transition">No</button>
        </div>
    `;
        document.body.appendChild(toast);

      
        setTimeout(() => toast.classList.add("show"), 100);

       
        toast.querySelector("#logout-yes").onclick = function () {
          toast.classList.remove("show");
          setTimeout(() => toast.remove(), 300);
          localStorage.removeItem("authToken");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userName");
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

      function setView(view) {
        currentView = view;
        const gridView = document.getElementById("grid-view");
        const listView = document.getElementById("list-view");
        const coursesGrid = document.getElementById("courses-grid");
        const coursesList = document.getElementById("courses-list");

        if (view === "grid") {
          gridView.classList.add("bg-white", "text-gray-900", "shadow-sm");
          gridView.classList.remove("text-gray-500");
          listView.classList.remove("bg-white", "text-gray-900", "shadow-sm");
          listView.classList.add("text-gray-500");

          coursesGrid.classList.remove("hidden");
          coursesList.classList.add("hidden");
        } else {
          listView.classList.add("bg-white", "text-gray-900", "shadow-sm");
          listView.classList.remove("text-gray-500");
          gridView.classList.remove("bg-white", "text-gray-900", "shadow-sm");
          gridView.classList.add("text-gray-500");

          coursesList.classList.remove("hidden");
          coursesGrid.classList.add("hidden");
        }

        renderCourses();
      }

      function filterByCategory(category) {
        currentCategory = category;

       
        document.querySelectorAll(".filter-btn").forEach((btn) => {
          btn.classList.remove("active");
          btn.classList.add("bg-gray-100", "text-gray-700");
          btn.classList.remove("bg-cyan-600", "text-white");
        });

        event.target.classList.add("active");
        event.target.classList.remove("bg-gray-100", "text-gray-700");
        event.target.classList.add("bg-cyan-600", "text-white");

        applyFilters();
      }

      function filterCourses() {
        applyFilters();
      }

      function applyFilters() {
        const searchTerm = document
          .getElementById("course-search")
          .value.toLowerCase();

        filteredCourses = allCourses.filter((course) => {
          const matchesSearch =
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm);
          const matchesCategory =
            currentCategory === "all" || course.category === currentCategory;

          return matchesSearch && matchesCategory;
        });

        renderCourses();
      }

      function clearFilters() {
        document.getElementById("course-search").value = "";
        currentCategory = "all";

      
        document.querySelectorAll(".filter-btn").forEach((btn) => {
          btn.classList.remove("active", "bg-cyan-600", "text-white");
          btn.classList.add("bg-gray-100", "text-gray-700");
        });

        document.querySelector(".filter-btn").classList.add("active");
        document
          .querySelector(".filter-btn")
          .classList.remove("bg-gray-100", "text-gray-700");
        document
          .querySelector(".filter-btn")
          .classList.add("bg-cyan-600", "text-white");

        applyFilters();
      }

      function renderCourses() {
        const coursesGrid = document.getElementById("courses-grid");
        const coursesList = document.getElementById("courses-list");
        const emptyState = document.getElementById("empty-state");
        const coursesContainer = document.getElementById("courses-container");
        const courseCount = document.getElementById("course-count");

        courseCount.textContent = filteredCourses.length;

        if (filteredCourses.length === 0) {
          coursesContainer.classList.add("hidden");
          emptyState.classList.remove("hidden");
          return;
        }

        coursesContainer.classList.remove("hidden");
        emptyState.classList.add("hidden");

        if (currentView === "grid") {
          coursesGrid.innerHTML = filteredCourses
            .map((course) => createCourseCard(course))
            .join("");
        } else {
          coursesList.innerHTML = filteredCourses
            .map((course) => createCourseListItem(course))
            .join("");
        }
      }

      function createCourseCard(course) {
        const categoryDisplay =
          categoryMapping[course.category] || course.category;
        const rating =
          course.rating?.rate || (Math.random() * 2 + 3).toFixed(1);
        const enrolledCourses = JSON.parse(
          localStorage.getItem("enrolledCourses") || "[]"
        );
        const isEnrolled = enrolledCourses.includes(course.id);

        return `
                <div class="course-card bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="relative">
                        <img src="${course.image}" alt="${
          course.title
        }" class="w-full h-48 object-cover">
                        <div class="absolute top-4 left-4">
                            <span class="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                                ${categoryDisplay}
                            </span>
                        </div>
                        <div class="absolute top-4 right-4">
                            <button class="bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                                <i class="fas fa-heart text-sm"></i>
                            </button>
                        </div>
                        ${
                          isEnrolled
                            ? '<div class="absolute bottom-4 left-4"><span class="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium"><i class="fas fa-check mr-1"></i>Enrolled</span></div>'
                            : ""
                        }
                    </div>
                    
                    <div class="p-6">
                        <h3 class="font-heading text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            ${course.title}
                        </h3>
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                            ${course.description}
                        </p>
                        
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center">
                                <div class="flex text-yellow-400">
                                    ${Array(5)
                                      .fill()
                                      .map(
                                        (_, i) =>
                                          `<i class="fas fa-star text-xs ${
                                            i < Math.floor(rating)
                                              ? ""
                                              : "text-gray-300"
                                          }"></i>`
                                      )
                                      .join("")}
                                </div>
                                <span class="text-sm text-gray-600 ml-2">${rating} (${
          course.enrolled || Math.floor(Math.random() * 5000) + 500
        })</span>
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fas fa-clock mr-1"></i>
                                ${course.duration}
                            </div>
                            <div class="flex items-center text-sm text-gray-500">
                                <i class="fas fa-signal mr-1"></i>
                                ${course.level}
                            </div>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div class="text-2xl font-bold text-gray-900">
                                $${course.price}
                            </div>
                            <button onclick="enrollCourse(${
                              course.id
                            })" class="${
          isEnrolled
            ? "bg-emerald-500 cursor-not-allowed"
            : "bg-cyan-600 hover:bg-cyan-700"
        } text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors" ${
          isEnrolled ? "disabled" : ""
        }>
                                ${
                                  isEnrolled
                                    ? '<i class="fas fa-check mr-2"></i>Enrolled'
                                    : "Enroll Now"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            `;
      }

      function createCourseListItem(course) {
        const categoryDisplay =
          categoryMapping[course.category] || course.category;
        const rating =
          course.rating?.rate || (Math.random() * 2 + 3).toFixed(1);
        const students = Math.floor(Math.random() * 5000) + 500;
        const duration = Math.floor(Math.random() * 20) + 5;

        return `
                <div class="course-card bg-white rounded-xl shadow-sm p-6">
                    <div class="flex items-start space-x-4">
                        <img src="${course.image}" alt="${
          course.title
        }" class="w-24 h-24 object-cover rounded-lg flex-shrink-0">
                        
                        <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between mb-2">
                                <h3 class="font-heading text-lg font-semibold text-gray-900 line-clamp-1">
                                    ${course.title}
                                </h3>
                                <button class="text-gray-400 hover:text-red-500 ml-4">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                            
                            <div class="flex items-center mb-2">
                                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium mr-3">
                                    ${categoryDisplay}
                                </span>
                                <div class="flex items-center">
                                    <div class="flex text-yellow-400 mr-2">
                                        ${Array(5)
                                          .fill()
                                          .map(
                                            (_, i) =>
                                              `<i class="fas fa-star text-xs ${
                                                i < Math.floor(rating)
                                                  ? ""
                                                  : "text-gray-300"
                                              }"></i>`
                                          )
                                          .join("")}
                                    </div>
                                    <span class="text-sm text-gray-600">${rating}</span>
                                </div>
                            </div>
                            
                            <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                                ${course.description}
                            </p>
                            
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-4 text-sm text-gray-500">
                                    <div class="flex items-center">
                                        <i class="fas fa-clock mr-1"></i>
                                        ${course.duration}
                                    </div>
                                    <div class="flex items-center">
                                        <i class="fas fa-signal mr-1"></i>
                                        ${course.level}
                                    </div>
                                </div>
                                
                                <div class="flex items-center space-x-4">
                                    <div class="text-xl font-bold text-gray-900">
                                        $${course.price}
                                    </div>
                                    <button onclick="enrollCourse(${
                                      course.id
                                    })" class="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
      }

      async function loadCourses() {
        try {
          
          const [coursesData, categoriesData] = await Promise.all([
            window.apiService.getCourses(20),
            window.apiService.getCategories(),
          ]);

        
          allCourses = window.apiService.processCourseData(coursesData);
          filteredCourses = [...allCourses];

         
          updateCategoryFilters(categoriesData);

         
          document.getElementById("loading-state").classList.add("hidden");
          renderCourses();

        
          showNotification(
            `Loaded ${allCourses.length} courses successfully`,
            "success"
          );
        } catch (error) {
          console.error("Error loading courses:", error);
          showErrorState();
          showNotification(
            "Failed to load courses. Please try again.",
            "error"
          );
        }
      }

      function updateCategoryFilters(categories) {
        const filterContainer = document.querySelector(".flex.flex-wrap.gap-2");
        const allButton = filterContainer.querySelector(
          'button[onclick*="all"]'
        );

        
        const categoryButtons = filterContainer.querySelectorAll(
          'button:not([onclick*="all"])'
        );
        categoryButtons.forEach((btn) => btn.remove());

       
        categories.forEach((category) => {
          const displayName =
            categoryMapping[category] ||
            category.charAt(0).toUpperCase() + category.slice(1);
          const button = document.createElement("button");
          button.onclick = () => filterByCategory(category);
          button.className =
            "filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700";
          button.textContent = displayName;
          filterContainer.appendChild(button);
        });
      }

      function showErrorState() {
        document.getElementById("loading-state").innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                    </div>
                    <h3 class="font-heading text-xl font-semibold text-gray-900 mb-2">Failed to load courses</h3>
                    <p class="text-gray-600 mb-6">Please check your internet connection and try again</p>
                    <button onclick="retryLoadCourses()" class="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-colors mr-4">
                        <i class="fas fa-redo mr-2"></i>Retry
                    </button>
                    <button onclick="loadOfflineData()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        <i class="fas fa-database mr-2"></i>Load Sample Data
                    </button>
                </div>
            `;
      }

      function retryLoadCourses() {
        document.getElementById("loading-state").innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    ${Array(8)
                      .fill()
                      .map(
                        () => `
                        <div class="loading-skeleton bg-white rounded-xl shadow-sm p-6">
                            <div class="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div class="h-4 bg-gray-200 rounded mb-2"></div>
                            <div class="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div class="h-8 bg-gray-200 rounded"></div>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;
        loadCourses();
      }

      function loadOfflineData() {
        const sampleCourses = [
          {
            id: 1,
            title: "Complete Web Development Bootcamp",
            description:
              "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.",
            price: 89.99,
            image: "/placeholder.svg?height=300&width=400",
            category: "electronics",
            rating: { rate: 4.8 },
            instructor: "Dr. Sarah Johnson",
            duration: "40 hours",
            level: "Beginner",
            enrolled: 2547,
          },
          {
            id: 2,
            title: "UI/UX Design Masterclass",
            description:
              "Master the principles of user interface and user experience design.",
            price: 79.99,
            image: "/placeholder.svg?height=300&width=400",
            category: "jewelery",
            rating: { rate: 4.6 },
            instructor: "Prof. Michael Chen",
            duration: "25 hours",
            level: "Intermediate",
            enrolled: 1834,
          },
        ];

        allCourses = sampleCourses;
        filteredCourses = [...allCourses];

        document.getElementById("loading-state").classList.add("hidden");
        renderCourses();

        showNotification("Loaded sample course data", "info");
      }

      async function enrollCourse(courseId) {
        const course = allCourses.find((c) => c.id === courseId);
        if (!course) return;

        try {
          
          const button = event.target;
          const originalText = button.innerHTML;
          button.innerHTML =
            '<i class="fas fa-spinner fa-spin mr-2"></i>Enrolling...';
          button.disabled = true;

          
          await new Promise((resolve) => setTimeout(resolve, 1500));

          
          button.innerHTML = '<i class="fas fa-check mr-2"></i>Enrolled';
          button.classList.remove("bg-cyan-600", "hover:bg-cyan-700");
          button.classList.add("bg-emerald-500", "cursor-not-allowed");

          
          const enrolledCourses = JSON.parse(
            localStorage.getItem("enrolledCourses") || "[]"
          );
          if (!enrolledCourses.includes(courseId)) {
            enrolledCourses.push(courseId);
            localStorage.setItem(
              "enrolledCourses",
              JSON.stringify(enrolledCourses)
            );
          }

          showNotification(
            `Successfully enrolled in "${course.title}"!`,
            "success"
          );
        } catch (error) {
          console.error("Enrollment error:", error);
          showNotification("Enrollment failed. Please try again.", "error");

          
          button.innerHTML = originalText;
          button.disabled = false;
        }
      }

      function showNotification(message, type = "info") {
        const notification = document.createElement("div");
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full ${
          type === "error"
            ? "bg-red-500 text-white"
            : type === "success"
            ? "bg-emerald-500 text-white"
            : "bg-blue-500 text-white"
        }`;
        notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${
                      type === "error"
                        ? "fa-exclamation-circle"
                        : type === "success"
                        ? "fa-check-circle"
                        : "fa-info-circle"
                    } mr-2"></i>
                    ${message}
                    <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white/80 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

        document.body.appendChild(notification);

        
        setTimeout(() => {
          notification.classList.remove("translate-x-full");
        }, 100);

       
        setTimeout(() => {
          notification.classList.add("translate-x-full");
          setTimeout(() => notification.remove(), 300);
        }, 5000);
      }

      
      function checkAuth() {
        return window.apiService.isAuthenticated();
      }

      
      function initUserInfo() {
        const userName = localStorage.getItem("userName") || "Student";
        document.getElementById("user-name").textContent = userName;
      }

      document.addEventListener("click", function (event) {
        const userMenu = document.getElementById("user-menu");
        const userMenuButton = event.target.closest(
          'button[onclick="toggleUserMenu()"]'
        );

        if (!userMenuButton && !userMenu.contains(event.target)) {
          userMenu.classList.add("hidden");
        }
      });

      
      window.addEventListener("load", () => {
        if (checkAuth()) {
          initUserInfo();
          loadCourses();
        }
      });

      

      function setUserProfileDisplay() {
      
        const sidebarAvatar = document.getElementById("sidebar-user-avatar");
        if (sidebarAvatar)
          sidebarAvatar.src =
            localStorage.getItem("userAvatarSmall") ||
            "/placeholder.svg?height=40&width=40";
        
        const sidebarName = document.getElementById("user-name");
        if (sidebarName)
          sidebarName.textContent =
            localStorage.getItem("userName") || "Student";
       
        const headerAvatar = document.getElementById("header-user-avatar");
        if (headerAvatar)
          headerAvatar.src =
            localStorage.getItem("userAvatarThumb") ||
            "/placeholder.svg?height=32&width=32";
      }

      window.addEventListener("load", setUserProfileDisplay);

      

      const notificationBtn = document.getElementById("notification-btn");
      const notificationDropdown = document.getElementById(
        "notification-dropdown"
      );

      notificationBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle("hidden");
      });


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
        function markAllNotificationsRead() {
        const notifications = document.querySelectorAll(
          "#notification-dropdown li"
        );
        notifications.forEach((notif) => {
          notif.classList.remove("bg-gray-100");
          notif.classList.add("bg-white");
        }
        );
        showNotification("All notifications marked as read", "info");
      }
        document
        .getElementById("mark-all-read")
        .addEventListener("click", markAllNotificationsRead);

        function clearAllNotifications() {
        const notificationList = document.getElementById("notification-list");
        notificationList.innerHTML = `
          <li class="text-center text-gray-500 py-4">
            No notifications
          </li>
        `;
        showNotification("All notifications cleared", "info");
      }
        document
        .getElementById("clear-all")
        .addEventListener("click", clearAllNotifications);
        