/**
 * ===================================================================
 * MANASA M P - CONTACT SYSTEM FRONTEND CONTROLLER
 * Real REST API integration with Spring Boot (/api/contact)
 * Validates inputs, handles HTTP statuses & displays interactive feedback
 * ===================================================================
 */

(function () {
  'use strict';

  // Configurable REST API endpoint - defaults to Spring Boot localhost:8080
  const API_BASE_URL = window.PORTFOLIO_API_URL || 'http://localhost:8080/api/contact';

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('portfolio-contact-form');
    if (!contactForm) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('contact-submit-btn');
    const statusBox = document.getElementById('contact-status-box');

    // Email Regex Pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Reset validation states on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous status
      clearStatus();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      // Client-side Validation
      let isValid = true;

      if (!name || name.length < 2) {
        showFieldError(nameInput, 'Please enter your name (at least 2 characters).');
        isValid = false;
      }

      if (!email || !emailPattern.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!subject || subject.length < 3) {
        showFieldError(subjectInput, 'Please enter a subject (at least 3 characters).');
        isValid = false;
      }

      if (!message || message.length < 10) {
        showFieldError(messageInput, 'Please enter your message (at least 10 characters).');
        isValid = false;
      }

      if (!isValid) {
        showStatus('error', 'Please correct the highlighted fields before submitting.');
        return;
      }

      // Prepare payload matching Spring Boot ContactMessageDTO
      const payload = {
        name: name,
        email: email,
        subject: subject,
        message: message
      };

      // Set UI State: Sending...
      setSubmittingState(true);
      showStatus('sending', '<i class="bi bi-arrow-repeat spin-icon"></i> Sending message to Spring Boot server...');

      try {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && (response.status === 201 || response.status === 200)) {
          // Success Response
          showStatus(
            'success',
            `<i class="bi bi-check-circle-fill"></i> ${data.message || 'Message sent successfully! Thank you for reaching out.'}`
          );
          contactForm.reset();
        } else if (response.status === 400 && data.data) {
          // Field Validation Errors from Spring Boot GlobalExceptionHandler
          let errorMsg = data.message || 'Validation error:';
          Object.keys(data.data).forEach(field => {
            const fieldEl = document.getElementById(`contact-${field}`);
            if (fieldEl) showFieldError(fieldEl, data.data[field]);
          });
          showStatus('error', `<i class="bi bi-exclamation-triangle-fill"></i> ${errorMsg}`);
        } else {
          // Other HTTP Error
          showStatus(
            'error',
            `<i class="bi bi-x-circle-fill"></i> Unable to send message. ${data.message || 'Please try again.'}`
          );
        }
      } catch (networkError) {
        console.error('Contact API Network Error:', networkError);
        showStatus(
          'error',
          '<i class="bi bi-wifi-off"></i> Unable to send message. Please make sure the Spring Boot backend is running on <strong>http://localhost:8080</strong> and MySQL is active.'
        );
      } finally {
        setSubmittingState(false);
      }
    });

    function showFieldError(inputEl, msg) {
      inputEl.classList.add('is-invalid');
      const feedbackEl = inputEl.nextElementSibling;
      if (feedbackEl && feedbackEl.classList.contains('invalid-feedback-custom')) {
        feedbackEl.textContent = msg;
      }
    }

    function showStatus(type, htmlContent) {
      statusBox.className = `form-status-box status-${type}`;
      statusBox.innerHTML = htmlContent;
      statusBox.style.display = 'flex';
    }

    function clearStatus() {
      statusBox.className = 'form-status-box';
      statusBox.innerHTML = '';
      statusBox.style.display = 'none';
    }

    function setSubmittingState(isSubmitting) {
      if (isSubmitting) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Sending...';
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i> Send Message';
      }
    }
  });
})();
