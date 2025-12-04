// Mobile Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
        navbar.classList.replace('bg-brand-dark/90', 'bg-brand-dark');
    } else {
        navbar.classList.remove('shadow-lg');
        navbar.classList.replace('bg-brand-dark', 'bg-brand-dark/90');
    }
});

// Registration Form Handler
async function handleRegistrationSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const errorDiv = document.getElementById('form-error');
    const errorText = document.getElementById('form-error-text');

    errorDiv.classList.add('hidden');
    submitBtn.disabled = true;
    submitText.textContent = 'Odesílám...';

    try {
        const formData = new FormData(form);

        const response = await fetch('/api/registrace', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            window.location.href = '/registrace-email-odeslan.html';
        } else {
            errorText.textContent = data.error || 'Nastala neočekávaná chyba';
            errorDiv.classList.remove('hidden');

            if (typeof turnstile !== 'undefined') {
                turnstile.reset();
            }
        }
    } catch (error) {
        errorText.textContent = 'Nepodařilo se odeslat formulář. Zkuste to prosím znovu.';
        errorDiv.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitText.textContent = 'Registrovat se';
        lucide.createIcons();
    }
}

// Czech pluralization for "běžec"
function pluralizeBezec(count) {
    if (count === 1) {
        return 'běžec';
    } else if (count >= 2 && count <= 4) {
        return 'běžci';
    } else {
        return 'běžců';
    }
}

// Fetch and display registration stats
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();

        if (response.ok && data.count > 0) {
            const statsCounter = document.getElementById('stats-counter');
            const statsCount = document.getElementById('stats-count');
            const statsLabel = document.getElementById('stats-label');

            if (statsCounter && statsCount && statsLabel) {
                statsCount.textContent = data.count;
                statsLabel.textContent = pluralizeBezec(data.count);
                statsCounter.classList.remove('hidden');
                lucide.createIcons();
            }
        }
    } catch (error) {
        // Silently fail - stats are not critical
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Setup Registration Form Handler
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }

    // Load registration stats
    loadStats();
});