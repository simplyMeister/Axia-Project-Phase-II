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
            
           
            const submitBtn = event.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;
            
            try {
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                
              
                showSuccessMessage(email);
                
               
                localStorage.setItem('resetEmail', email);
                
            } catch (error) {
                
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>Failed to Send';
                submitBtn.classList.remove('bg-cyan-600', 'hover:bg-cyan-700');
                submitBtn.classList.add('bg-red-500');
                
                alert('Failed to send reset link: ' + error.message);
               
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('bg-red-500');
                    submitBtn.classList.add('bg-cyan-600', 'hover:bg-cyan-700');
                    submitBtn.disabled = false;
                }, 2000);
            }
        }
        
        
        window.addEventListener('load', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email') || localStorage.getItem('resetEmail');
            if (email) {
                document.getElementById('email').value = email;
            }
        });