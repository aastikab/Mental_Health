document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('quiz-form');
    const results = document.getElementById('results');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect answers
        const answers = {};
        const questions = document.querySelectorAll('.question-card');
        let allAnswered = true;
        
        questions.forEach(question => {
            const questionId = question.querySelector('input[type="radio"]').name.replace('q', '');
            const selectedOption = question.querySelector('input[type="radio"]:checked');
            
            if (selectedOption) {
                answers[questionId] = selectedOption.value;
            } else {
                allAnswered = false;
            }
        });

        if (!allAnswered) {
            alert('Please answer all questions before submitting.');
            return;
        }

        // Submit answers
        fetch('/submit_quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answers)
        })
        .then(response => response.json())
        .then(data => {
            // Hide form and show results
            form.style.display = 'none';
            results.style.display = 'block';
            
            // Update score
            document.getElementById('score-value').textContent = Math.round(data.score);
            
            // Update recommendations
            document.getElementById('status-message').textContent = data.recommendations.status;
            document.getElementById('recommendation-message').textContent = data.recommendations.message;
            
            // Update tips
            const tipsList = document.getElementById('tips-list');
            tipsList.innerHTML = '';
            data.recommendations.tips.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                tipsList.appendChild(li);
            });

            // Scroll to results
            results.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Add event listener for "Take Again" button
    document.querySelector('.action-btn.secondary').addEventListener('click', function() {
        // Clear all radio button selections
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });

        // Hide results and show form
        results.style.display = 'none';
        form.style.display = 'block';

        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth' });
    });
});

// Back to Top button functionality
window.onscroll = function() {
    const backToTopButton = document.getElementById("backToTop");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
};

document.getElementById("backToTop").onclick = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}; 