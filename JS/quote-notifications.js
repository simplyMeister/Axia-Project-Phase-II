// Educational Quotes Toast Notification System

// Array of educational quotes
const educationalQuotes = [
  "Education is the passport to the future, for tomorrow belongs to those who prepare for it today. - Malcolm X",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
  "Education is not the filling of a pail, but the lighting of a fire. - W.B. Yeats",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go. - Dr. Seuss",
  "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
  "Live as if you were to die tomorrow. Learn as if you were to live forever. - Mahatma Gandhi",
  "Knowledge is power. Information is liberating. Education is the premise of progress. - Kofi Annan",
  "The function of education is to teach one to think intensively and to think critically. Intelligence plus character – that is the goal of true education. - Martin Luther King Jr.",
  "Education is not preparation for life; education is life itself. - John Dewey",
  "The roots of education are bitter, but the fruit is sweet. - Aristotle",
];

// Create toast container if it doesn't exist
function createToastContainer() {
  let container = document.getElementById("toast-container");

  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  return container;
}

// Create and show toast notification
function showToast(message) {
  const container = createToastContainer();

  // Create toast element
  const toast = document.createElement("div");
  toast.className = "educational-toast";
  toast.style.backgroundColor = "rgba(16, 185, 129, 0.9)";
  toast.style.color = "white";
  toast.style.padding = "12px 20px";
  toast.style.borderRadius = "8px";
  toast.style.marginTop = "10px";
  toast.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  toast.style.fontFamily = "system-ui, -apple-system, sans-serif";
  toast.style.fontSize = "14px";
  toast.style.maxWidth = "350px";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease-in-out";

  // Add quote icon
  const content = document.createElement("div");
  content.style.display = "flex";
  content.style.alignItems = "flex-start";

  const icon = document.createElement("i");
  icon.className = "fas fa-quote-left";
  icon.style.marginRight = "10px";
  icon.style.marginTop = "3px";

  const text = document.createElement("span");
  text.textContent = message;

  content.appendChild(icon);
  content.appendChild(text);
  toast.appendChild(content);

  // Add to container
  container.appendChild(toast);

  // Trigger reflow for animation
  void toast.offsetWidth;

  // Show toast
  toast.style.opacity = "1";

  // Remove toast after 7 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 7000);
}

// Variables to track mouse activity
let mouseTimeout;
let isToastActive = false;
let currentQuoteIndex = 0;

// Function to handle mouse inactivity
function handleMouseInactivity() {
  if (!isToastActive) {
    isToastActive = true;

    // Show the current quote
    showToast(educationalQuotes[currentQuoteIndex]);

    // Update index for next quote
    currentQuoteIndex = (currentQuoteIndex + 1) % educationalQuotes.length;

    // Reset toast active status after it disappears
    setTimeout(() => {
      isToastActive = false;

      // If mouse is still inactive, schedule the next toast
      if (!mouseTimeout) {
        mouseTimeout = setTimeout(handleMouseInactivity, 30000);
      }
    }, 7300); // 7 seconds display + 0.3s fade out
  }
}

// Reset timer on mouse movement
function resetMouseTimer() {
  clearTimeout(mouseTimeout);
  mouseTimeout = setTimeout(handleMouseInactivity, 30000); // 30 seconds
}

// Initialize event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Add event listeners for mouse movement
  document.addEventListener("mousemove", resetMouseTimer);
  document.addEventListener("mousedown", resetMouseTimer);
  document.addEventListener("keypress", resetMouseTimer);
  document.addEventListener("touchmove", resetMouseTimer);
  document.addEventListener("scroll", resetMouseTimer);

  // Start the initial timer
  resetMouseTimer();
});
