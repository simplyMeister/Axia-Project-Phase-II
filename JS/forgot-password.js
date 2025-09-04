function showResetForm() {
            document.getElementById('reset-form-container').classList.remove('hidden');
            document.getElementById('success-container').classList.add('hidden');
            document.getElementById('email').value = '';
        }
        
        function showSuccessMessage(email) {
            document.getElementById('reset-form-container').classList.add('hidden');
            document.getElementById('success-container').classList.remove('hidden');
            document.getElementById('sent-email').textContent = email;
        }
        
        async function handleForgotPassword(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const email = formData.get('email');
            
            // Show loading state
            const submitBtn = event.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call for password reset
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Mock successful response
                showSuccessMessage(email);
                
                // Store email for potential retry
                localStorage.setItem('resetEmail', email);
                
            } catch (error) {
                // Show error
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Failed to Send';
                submitBtn.classList.remove('bg-cyan-600', 'hover:bg-cyan-700');
                submitBtn.classList.add('bg-red-500');
                
                alert('Failed to send reset link: ' + error.message);
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('bg-red-500');
                    submitBtn.classList.add('bg-cyan-600', 'hover:bg-cyan-700');
                    submitBtn.disabled = false;
                }, 2000);
            }
        }
        
        // Auto-fill email if coming from login page
        window.addEventListener('load', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email') || localStorage.getItem('resetEmail');
            if (email) {
                document.getElementById('email').value = email;
            }
        });