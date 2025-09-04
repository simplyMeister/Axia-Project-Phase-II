 function togglePassword() {
        const passwordInput = document.getElementById("password");
        const passwordIcon = document.getElementById("password-icon");

        if (passwordInput.type === "password") {
          passwordInput.type = "text";
          passwordIcon.classList.remove("fa-eye");
          passwordIcon.classList.add("fa-eye-slash");
        } else {
          passwordInput.type = "password";
          passwordIcon.classList.remove("fa-eye-slash");
          passwordIcon.classList.add("fa-eye");
        }
      }

      async function handleLogin(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");
        const remember = formData.get("remember");

        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin mr-2"></i>Signing In...';
        submitBtn.disabled = true;

        try {
          console.log("[v0] Testing ReqRes API...");

          const testResponse = await fetch("https://reqres.in/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "eve.holt@reqres.in",
              password: "cityslicka",
            }),
          });

          console.log("[v0] Test response status:", testResponse.status);
          const testData = await testResponse.text();
          console.log("[v0] Test response body:", testData);

          if (testResponse.ok) {
            console.log("[v0] ReqRes API works without API key!");
            const data = JSON.parse(testData);

            // Store auth token
            if (data.token) {
              localStorage.setItem("authToken", data.token);
              if (remember) {
                localStorage.setItem("rememberMe", "true");
                localStorage.setItem("rememberedEmail", email);
              }

              // Show success message
              submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Success!';
              submitBtn.classList.remove("bg-cyan-600", "hover:bg-cyan-700");
              submitBtn.classList.add("bg-emerald-500");

              showNotification("Login successful! Redirecting...", "success");

              // Redirect to dashboard
              setTimeout(() => {
                window.location.href = "dashboard.html";
              }, 1000);
              return;
            }
          }

          console.log("[v0] Trying with API key...");
          const response = await fetch("https://reqres.in/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "reqres-free-v1",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });

          console.log("[v0] API key response status:", response.status);
          const responseText = await response.text();
          console.log("[v0] API key response body:", responseText);

          if (response.ok) {
            const data = JSON.parse(responseText);
            console.log("[v0] Login successful with API key:", data);

            // Store auth token
            if (data.token) {
              localStorage.setItem("authToken", data.token);
              if (remember) {
                localStorage.setItem("rememberMe", "true");
                localStorage.setItem("rememberedEmail", email);
              }

              // Show success message
              submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Success!';
              submitBtn.classList.remove("bg-cyan-600", "hover:bg-cyan-700");
              submitBtn.classList.add("bg-emerald-500");

              showNotification("Login successful! Redirecting...", "success");

              // Redirect to dashboard
              setTimeout(() => {
                window.location.href = "dashboard.html";
              }, 1000);
            } else {
              throw new Error("No token received from server");
            }
          } else {
            throw new Error(`HTTP ${response.status}: ${responseText}`);
          }
        } catch (error) {
          console.error("[v0] Login error:", error);

          // Show error
          submitBtn.innerHTML =
            '<i class="fas fa-exclamation-triangle mr-2"></i>Login Failed';
          submitBtn.classList.remove("bg-cyan-600", "hover:bg-cyan-700");
          submitBtn.classList.add("bg-red-500");

          let errorMessage = "Login failed: User not found.";
          // Try to parse error for user not found
          if (error && error.message) {
            if (error.message.includes("user")) {
              errorMessage = "Login failed: User not found.";
            } else if (error.message.includes("HTTP 400")) {
              errorMessage = "Login failed: Invalid credentials.";
            } else {
              errorMessage = `Login failed: ${error.message}`;
            }
          }

          showNotification(errorMessage, "error");

          // Reset button after 3 seconds
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove("bg-red-500", "bg-emerald-500");
            submitBtn.classList.add("bg-cyan-600", "hover:bg-cyan-700");
            submitBtn.disabled = false;
          }, 3000);
        }
      }

      function showNotification(message, type = "info") {
        // Use the custom toast notification system from index.html
        if (typeof showToast === "function") {
          showToast(message, type);
          return;
        }
        // Fallback if showToast is not available
        const notification = document.createElement("div");
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
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
                </div>
            `;
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 5000);
      }

      // Custom Toast Notification System 
      function showToast(message, type = "info", duration = 4000) {
        let container = document.getElementById("toast-container");
        if (!container) {
          container = document.createElement("div");
          container.id = "toast-container";
          container.className = "toast-container fixed";
          document.body.appendChild(container);
        }
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

      // Auto-fill email if remembered
      window.addEventListener("load", () => {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail && rememberedEmail !== "eve.holt@reqres.in") {
          document.getElementById("email").value = rememberedEmail;
        }
      });