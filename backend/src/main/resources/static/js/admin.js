/**
 * ===================================================================
 * MANASA M P - ADMIN PORTAL CONTROLLER
 * Connects to Spring Boot Security-protected APIs
 * Fetches, searches, inspects, and deletes contact inquiries
 * ===================================================================
 */

(function () {
  'use strict';

  const API_BASE = window.PORTFOLIO_API_URL ? window.PORTFOLIO_API_URL.replace('/api/contact', '') : 'http://localhost:8080';
  const CONTACT_API = `${API_BASE}/api/contact`;
  const ADMIN_API = `${API_BASE}/api/admin`;

  let currentMessages = [];
  let deleteTargetId = null;

  document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('admin-login-section');
    const dashboardSection = document.getElementById('admin-dashboard-section');
    const loginForm = document.getElementById('admin-login-form');
    const loginAlert = document.getElementById('login-alert');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const searchInput = document.getElementById('admin-search-input');
    const refreshBtn = document.getElementById('admin-refresh-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    // Check existing session
    const token = sessionStorage.getItem('portfolio_admin_token');
    if (token) {
      showDashboard();
      fetchMessages();
    } else {
      showLogin();
    }

    // Login Form Handler
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginAlert.style.display = 'none';

        const username = document.getElementById('admin-username').value.trim();
        const password = document.getElementById('admin-password').value;

        if (!username || !password) {
          showLoginError('Please enter both username and password.');
          return;
        }

        const loginSubmitBtn = document.getElementById('login-submit-btn');
        loginSubmitBtn.disabled = true;
        loginSubmitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Authenticating...';

        try {
          const response = await fetch(`${ADMIN_API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });

          const data = await response.json();

          if (response.ok && data.success && data.data && data.data.token) {
            sessionStorage.setItem('portfolio_admin_token', data.data.token);
            sessionStorage.setItem('portfolio_admin_user', data.data.username);
            showDashboard();
            fetchMessages();
          } else {
            showLoginError(data.message || 'Invalid username or password.');
          }
        } catch (err) {
          console.error('Login error:', err);
          showLoginError('Unable to connect to Spring Boot backend. Ensure backend is running at http://localhost:8080');
        } finally {
          loginSubmitBtn.disabled = false;
          loginSubmitBtn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i> Log In';
        }
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('portfolio_admin_token');
        sessionStorage.removeItem('portfolio_admin_user');
        showLogin();
      });
    }

    // Refresh
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        fetchMessages();
      });
    }

    // Search Input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          renderMessages(currentMessages);
          return;
        }
        const filtered = currentMessages.filter(m =>
          (m.name && m.name.toLowerCase().includes(query)) ||
          (m.email && m.email.toLowerCase().includes(query)) ||
          (m.subject && m.subject.toLowerCase().includes(query)) ||
          (m.message && m.message.toLowerCase().includes(query))
        );
        renderMessages(filtered);
      });
    }

    // Confirm Delete
    if (confirmDeleteBtn) {
      confirmDeleteBtn.addEventListener('click', async () => {
        if (!deleteTargetId) return;
        const modalEl = document.getElementById('deleteConfirmModal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);

        try {
          const token = sessionStorage.getItem('portfolio_admin_token');
          const response = await fetch(`${CONTACT_API}/${deleteTargetId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Basic ${token}`,
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            if (modalInstance) modalInstance.hide();
            fetchMessages();
          } else {
            alert('Failed to delete message from database.');
          }
        } catch (err) {
          console.error('Delete error:', err);
          alert('Network error while deleting message.');
        } finally {
          deleteTargetId = null;
        }
      });
    }

    function showLogin() {
      if (loginSection) loginSection.style.display = 'block';
      if (dashboardSection) dashboardSection.style.display = 'none';
      if (loginForm) loginForm.reset();
    }

    function showDashboard() {
      if (loginSection) loginSection.style.display = 'none';
      if (dashboardSection) dashboardSection.style.display = 'block';
      const userDisplay = document.getElementById('admin-user-display');
      if (userDisplay) {
        userDisplay.textContent = sessionStorage.getItem('portfolio_admin_user') || 'Admin';
      }
    }

    function showLoginError(msg) {
      if (loginAlert) {
        loginAlert.textContent = msg;
        loginAlert.style.display = 'block';
      }
    }

    async function fetchMessages() {
      const tbody = document.getElementById('admin-messages-tbody');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><span class="spinner-border text-info me-2"></span> Loading messages from database...</td></tr>';
      }

      const token = sessionStorage.getItem('portfolio_admin_token');
      if (!token) {
        showLogin();
        return;
      }

      try {
        const response = await fetch(CONTACT_API, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem('portfolio_admin_token');
          showLogin();
          showLoginError('Session expired. Please log in again.');
          return;
        }

        const resData = await response.json();
        if (response.ok && resData.success) {
          currentMessages = resData.data || [];
          renderMessages(currentMessages);
          updateMetrics(currentMessages);
        } else {
          tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">${resData.message || 'Failed to load messages.'}</td></tr>`;
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4"><i class="bi bi-wifi-off me-2"></i> Failed to connect to Spring Boot server. Please ensure backend is running.</td></tr>';
        }
      }
    }

    function updateMetrics(messages) {
      const totalCountEl = document.getElementById('metric-total-messages');
      const todayCountEl = document.getElementById('metric-today-messages');
      if (totalCountEl) totalCountEl.textContent = messages.length;

      if (todayCountEl) {
        const todayStr = new Date().toISOString().split('T')[0];
        const todayCount = messages.filter(m => m.createdAt && m.createdAt.startsWith(todayStr)).length;
        todayCountEl.textContent = todayCount;
      }
    }

    function renderMessages(messages) {
      const tbody = document.getElementById('admin-messages-tbody');
      if (!tbody) return;

      if (!messages || messages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-muted"><i class="bi bi-inbox fs-1 d-block mb-2"></i>No contact messages found.</td></tr>';
        return;
      }

      tbody.innerHTML = messages.map(msg => {
        const dateFormatted = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A';
        const isRead = msg.readStatus === true;
        const statusBadge = isRead
          ? '<span class="badge bg-secondary font-mono small">Read</span>'
          : '<span class="badge bg-info text-dark font-mono small">New</span>';

        return `
          <tr>
            <td><span class="badge bg-secondary font-mono">#${msg.id}</span> ${statusBadge}</td>
            <td><strong>${escapeHtml(msg.name)}</strong></td>
            <td><a href="mailto:${escapeHtml(msg.email)}" class="text-info text-decoration-none">${escapeHtml(msg.email)}</a></td>
            <td><span class="text-light">${escapeHtml(msg.subject)}</span></td>
            <td><span class="text-muted small">${dateFormatted}</span></td>
            <td class="text-end">
              <button class="btn-action-view me-1" onclick="window.viewMessageDetail(${msg.id})">
                <i class="bi bi-eye"></i> View
              </button>
              <button class="btn-action-delete" onclick="window.triggerDeleteMessage(${msg.id})">
                <i class="bi bi-trash"></i> Delete
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Modal Details Exposure
    window.viewMessageDetail = async function (id) {
      const msg = currentMessages.find(m => m.id === id);
      if (!msg) return;

      document.getElementById('modal-detail-id').textContent = `#${msg.id}`;
      document.getElementById('modal-detail-name').textContent = msg.name;
      document.getElementById('modal-detail-email').textContent = msg.email;
      document.getElementById('modal-detail-email-link').href = `mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`;
      document.getElementById('modal-detail-subject').textContent = msg.subject;
      document.getElementById('modal-detail-time').textContent = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'N/A';
      document.getElementById('modal-detail-message').textContent = msg.message;

      const modalEl = document.getElementById('messageDetailModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();

      // Automatically mark message as read in MySQL
      if (!msg.readStatus) {
        try {
          const token = sessionStorage.getItem('portfolio_admin_token');
          await fetch(`${CONTACT_API}/${id}/read?status=true`, {
            method: 'PATCH',
            headers: { 'Authorization': `Basic ${token}`, 'Accept': 'application/json' }
          });
          msg.readStatus = true;
          renderMessages(currentMessages);
        } catch (e) {
          console.warn('Could not update read status:', e);
        }
      }
    };

    window.triggerDeleteMessage = function (id) {
      deleteTargetId = id;
      document.getElementById('delete-target-id-span').textContent = `#${id}`;
      const modalEl = document.getElementById('deleteConfirmModal');
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    };

    function escapeHtml(string) {
      if (!string) return '';
      return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  });
})();
