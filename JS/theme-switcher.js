// Theme Switcher for Edu4u Technologies

document.addEventListener("DOMContentLoaded", function () {
  // Create theme elements
  createThemeElements();

  // Initialize theme from localStorage or default
  initializeTheme();

  // Set up event listeners for theme buttons
  setupThemeButtons();
});

// Create theme UI and effect elements
function createThemeElements() {
  // Create theme switcher UI
  const themeSwitcher = document.createElement("div");
  themeSwitcher.className = "theme-switcher";
  themeSwitcher.innerHTML = `
    <button class="theme-button theme-dark" data-theme="dark" title="Dark Theme">
      <i class="fas fa-moon"></i>
    </button>
    <button class="theme-button theme-sunny" data-theme="sunny" title="Ecclipse Theme">
      <i class="fas fa-sun"></i>
    </button>
    <button class="theme-button theme-emerald-wave" data-theme="emerald-wave" title="Emerald Theme">
      <i class="fas fa-water"></i>
    </button>
  `;
  document.body.appendChild(themeSwitcher);

  // Create sunny background effect
  const sunnyBg = document.createElement("div");
  sunnyBg.className = "sunny-bg";
  document.body.appendChild(sunnyBg);

  // Create emerald wave effect
  const waveContainer = document.createElement("div");
  waveContainer.className = "wave-container";
  waveContainer.innerHTML = `
    <div class="wave"></div>
    <div class="wave"></div>
    <div class="wave"></div>
  `;
  document.body.appendChild(waveContainer);

  // Add transition class to body
  document.body.classList.add("theme-transition");
}

// Initialize theme from localStorage or default
function initializeTheme() {
  const savedTheme = localStorage.getItem("edu4u-theme") || "dark";
  setTheme(savedTheme);
}

// Set up event listeners for theme buttons
function setupThemeButtons() {
  const themeButtons = document.querySelectorAll(".theme-button");

  themeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const theme = this.getAttribute("data-theme");
      setTheme(theme);
      localStorage.setItem("edu4u-theme", theme);
    });
  });
}

// Set the active theme
function setTheme(theme) {
  // Remove all theme classes
  document.body.classList.remove(
    "theme-dark",
    "theme-sunny",
    "theme-emerald-wave"
  );

  // Add the selected theme class
  document.body.classList.add(`theme-${theme}`);

  // Update active button
  const themeButtons = document.querySelectorAll(".theme-button");
  themeButtons.forEach((button) => {
    button.classList.remove("active");
    if (button.getAttribute("data-theme") === theme) {
      button.classList.add("active");
    }
  });
}
