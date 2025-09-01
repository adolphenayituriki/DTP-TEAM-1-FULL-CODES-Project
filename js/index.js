const AUTH_KEY = 'dts_user';
      const defaultNotifs = [
            { id: 1, text: 'Delivery #A-123 confirmed in Gasabo.', unread: true },
            { id: 2, text: 'New issue reported in Kicukiro.', unread: true },
            { id: 3, text: 'Monthly report is ready.', unread: false }
      ];
function getUser() {
      try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch { return null; }
}
function setUser(u) { localStorage.setItem(AUTH_KEY, JSON.stringify(u)); }
function renderAuthUI() {
      const user = getUser();
      const signedEls = document.querySelectorAll('[data-auth="signed"]');
      const roleLeaderEls = document.querySelectorAll('[data-auth-role="leader"]');
      const signOutBtn = document.getElementById('demoSignOut');
      const label = document.getElementById('navUserLabel');
      const notifWrapper = document.getElementById('notifWrapper');

      if (user?.signedIn) {
            signedEls.forEach(el => el.classList.remove('d-none'));
            signOutBtn.classList.remove('d-none');
            label.textContent = user.name ? user.name : (user.role === 'leader' ? 'Leader' : 'Citizen');
            if (user.role === 'leader') { roleLeaderEls.forEach(el => el.classList.remove('d-none')); }
            else { roleLeaderEls.forEach(el => el.classList.add('d-none')); }
            notifWrapper?.classList.remove('d-none');
            renderNotifications(user);
      } else {
            signedEls.forEach(el => el.classList.add('d-none'));
            roleLeaderEls.forEach(el => el.classList.add('d-none'));
            signOutBtn.classList.add('d-none');
            label.textContent = 'Sign in';
            notifWrapper?.classList.add('d-none');
      }
}
    // --- Notifications ---
function renderNotifications(user) {
      const list = document.getElementById('notifList');
      const badge = document.getElementById('notifBadge');
      const data = user.notifications || defaultNotifs;
      const unreadCount = data.filter(n => n.unread).length;
      badge.textContent = unreadCount;
      list.innerHTML = '';
      data.forEach(n => {
            const li = document.createElement('li');
            li.className = n.unread ? 'unread' : '';
            li.innerHTML = `<span>${n.text}</span>`;
            li.addEventListener('click', () => {
            n.unread = false; setUser({ ...user, notifications: data }); renderNotifications(getUser());
      });
            list.appendChild(li);
      });
}
    // Panel open/close
const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');
const markAllRead = document.getElementById('markAllRead');
const closeNotif = document.getElementById('closeNotif');
notifBtn?.addEventListener('click', () => {
      const open = getComputedStyle(notifPanel).display !== 'none';
      notifPanel.style.display = open ? 'none' : 'block';
      notifBtn.setAttribute('aria-expanded', (!open).toString());
});
closeNotif?.addEventListener('click', () => { notifPanel.style.display = 'none'; notifBtn?.setAttribute('aria-expanded','false'); });
markAllRead?.addEventListener('click', () => {
      const user = getUser();
      if (!user) return;
      const data = (user.notifications || defaultNotifs).map(n => ({...n, unread:false}));
      setUser({ ...user, notifications: data });
      renderNotifications(getUser());
});
window.addEventListener('click', (e) => {
      if (!notifPanel || !notifBtn) return;
      if (!notifPanel.contains(e.target) && !notifBtn.contains(e.target)) notifPanel.style.display = 'none';
});

    // Demo sign-in/out (for now)
document.getElementById('demoSignInCitizen')?.addEventListener('click', () => {
      setUser({ signedIn: true, role: 'citizen', name: 'Citizen', notifications: defaultNotifs });
      renderAuthUI();
});
document.getElementById('demoSignInLeader')?.addEventListener('click', () => {
      setUser({ signedIn: true, role: 'leader', name: 'Leader', notifications: defaultNotifs });
      renderAuthUI();
});
document.getElementById('demoSignOut')?.addEventListener('click', () => {
      localStorage.removeItem(AUTH_KEY);
      renderAuthUI();
});
    // Initialize on load
document.addEventListener('DOMContentLoaded', () => {
      renderAuthUI();
      // Open Bootstrap modals via custom buttons
      document.querySelectorAll('[data-modal-target]')?.forEach(btn => {
            btn.addEventListener('click', () => {
                  const sel = btn.getAttribute('data-modal-target');
                  const modalEl = document.querySelector(sel);
                  if (modalEl) new bootstrap.Modal(modalEl).show();
            });
      });
});
    // --- Chat widget ---
const chatToggle2 = document.getElementById('chatToggle2');
const chatToggle = document.getElementById('chatToggle');
const chatBoard  = document.getElementById('chatBoard');
const closeChat  = document.getElementById('closeChat');
const chatInput  = document.getElementById('chatInput');
const sendBtn    = document.getElementById('sendBtn');
const chatHistory= document.getElementById('chatHistory');
function openChat(){ chatBoard.style.display = 'block'; chatToggle.setAttribute('aria-expanded','true'); chatInput?.focus(); }
function closeChatFn(){ chatBoard.style.display = 'none'; chatToggle.setAttribute('aria-expanded','false'); }
chatToggle2?.addEventListener('click', openChat)
chatToggle?.addEventListener('click', openChat);
closeChat?.addEventListener('click', closeChatFn);
function addChatMessage(author, text){
      const p = document.createElement('p');
      p.innerHTML = `<strong>${author}:</strong> ${text}`;
      chatHistory.appendChild(p);
      chatHistory.scrollTop = chatHistory.scrollHeight;
}
sendBtn?.addEventListener('click', () => {
      const val = chatInput.value.trim();
      if (!val) return;
      addChatMessage('You', val);
      chatInput.value = '';
      setTimeout(() => addChatMessage('Support', 'Thanks! We\'ll get back to you shortly.'), 600);
});
chatInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendBtn.click(); });