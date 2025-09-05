
document.addEventListener("DOMContentLoaded", function () {
        const animationPlayer = document.getElementById("hero-animation");
        if (animationPlayer) {
          fetch("./assets/education-animation.json")
            .then((response) => response.json())
            .then((animationData) => {
              animationPlayer.load(animationData);
            })
            .catch((error) => {
              console.error("Error loading animation:", error);
              // Fallback to a simple animation if the file fails to load
              animationPlayer.src =
                "https://assets3.lottiefiles.com/packages/lf20_V9t630.json";
            });
        }
      });

      
      function toggleMobileMenu() {
        const menu = document.getElementById("mobile-menu");
        menu.classList.toggle("hidden");
      }

      function scrollToServices() {
        document
          .getElementById("services")
          .scrollIntoView({ behavior: "smooth" });
      }

     
      function showLogin() {
        hideAllModals();
        document.getElementById("auth-overlay").classList.remove("hidden");
        document.getElementById("login-modal").classList.remove("hidden");
      }

      function showSignup() {
        hideAllModals();
        document.getElementById("auth-overlay").classList.remove("hidden");
        document.getElementById("signup-modal").classList.remove("hidden");
      }

      function showForgotPassword() {
        hideAllModals();
        document.getElementById("auth-overlay").classList.remove("hidden");
        document.getElementById("forgot-modal").classList.remove("hidden");
      }

      function hideAuth() {
        hideAllModals();
        document.getElementById("auth-overlay").classList.add("hidden");
      }

      function hideAllModals() {
        document.getElementById("login-modal").classList.add("hidden");
        document.getElementById("signup-modal").classList.add("hidden");
        document.getElementById("forgot-modal").classList.add("hidden");
      }

      
      async function handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email =
          formData.get("email") ||
          event.target.querySelector('input[type="email"]').value;
        const password =
          formData.get("password") ||
          event.target.querySelector('input[type="password"]').value;

        showToast("Loading...", "info", 1200);
        console.log("[v0] Attempting login with API key header");

        try {
          const response = await fetch("https://reqres.in/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "reqres-free-v1",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          console.log("[v0] Login response:", data);

          if (response.ok) {
            localStorage.setItem("authToken", data.token);
            hideAuth();
            showToast("Login successful! Redirecting...", "success");
            setTimeout(() => {
              window.location.href = "dashboard.html";
            }, 1500);
          } else {
            showToast(
              "Login failed: " + (data.error || "Invalid credentials"),
              "error"
            );
          }
        } catch (error) {
          console.error("[v0] Login error:", error);
          showToast("Login error: " + error.message, "error");
        }
      }

      async function handleSignup(event) {
        event.preventDefault();
        const inputs = event.target.querySelectorAll("input");
        const name = inputs[0].value;
        const email = inputs[1].value;
        const password = inputs[2].value;
        const confirmPassword = inputs[3].value;

        if (password !== confirmPassword) {
          showToast("Passwords do not match!", "error");
          return;
        }

        showToast("Loading...", "info", 1200);
        console.log("[v0] Attempting signup with API key header");

        try {
          const response = await fetch("https://reqres.in/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "reqres-free-v1",
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
            showToast(
              "Account created successfully! Please sign in.",
              "success"
            );
            setTimeout(() => showLogin(), 1500);
          } else {
            showToast(
              "Registration failed: " + (data.error || "Please try again"),
              "error"
            );
          }
        } catch (error) {
          console.error("[v0] Signup error:", error);
          showToast("Registration error: " + error.message, "error");
        }
      }

      async function handleForgotPassword(event) {
        event.preventDefault();
        const email = event.target.querySelector('input[type="email"]').value;

        showToast("Loading...", "info", 1200);
       

        // Mock API call for forgot password
        try {
          
          await new Promise((resolve) => setTimeout(resolve, 1000));
          showToast("Password reset link sent to " + email, "success");
          hideAuth();
        } catch (error) {
          console.error(" Forgot password error:", error);
          showToast("Error sending reset link: " + error.message, "error");
        }
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

      
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        });
      });