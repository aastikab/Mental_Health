document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reminder-form');
    const methodSelect = form.querySelector('select[name="method"]');
    const emailInput = document.getElementById('email-input');

    // Show/hide email input based on notification method
    methodSelect.addEventListener('change', function() {
        emailInput.style.display = this.value === 'email' ? 'block' : 'none';
        if (this.value === 'email') {
            emailInput.querySelector('input').required = true;
        } else {
            emailInput.querySelector('input').required = false;
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            day: form.querySelector('select[name="day"]').value,
            time: form.querySelector('input[name="time"]').value,
            method: methodSelect.value,
            email: methodSelect.value === 'email' ? form.querySelector('input[name="email"]').value : null
        };

        // Send to backend
        fetch('/set_reminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update success message details
                document.getElementById('reminder-day').textContent = 
                    formData.day.charAt(0).toUpperCase() + formData.day.slice(1);
                document.getElementById('reminder-time').textContent = 
                    new Date('2000-01-01T' + formData.time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                document.getElementById('reminder-method').textContent = 
                    formData.method.charAt(0).toUpperCase() + formData.method.slice(1);

                // Hide form and show success message
                form.style.display = 'none';
                document.getElementById('success-message').style.display = 'block';
            } else {
                alert('Failed to set reminder. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
}); 