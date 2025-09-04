 function setUserProfileDisplay() {
        const sidebarAvatar = document.getElementById("sidebar-user-avatar");
        const sidebarName = document.getElementById("sidebar-user-name");
        if (sidebarAvatar)
          sidebarAvatar.src =
            localStorage.getItem("userAvatarSmall") ||
            "/placeholder.svg?height=40&width=40";
        if (sidebarName)
          sidebarName.textContent =
            localStorage.getItem("userName") || "John Doe";
      }
      window.addEventListener("load", setUserProfileDisplay);
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