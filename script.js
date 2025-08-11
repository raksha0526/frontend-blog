const BACKEND_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://blogsiter.onrender.com';

const token = localStorage.getItem('token');

// Load all posts for homepage or blog list
async function loadPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/posts`);
    const posts = await res.json();

    const container = document.getElementById('blog-list');
    const message = document.getElementById('message');
    container.innerHTML = '';

    if (posts.length === 0) {
      if (message) message.textContent = 'No posts yet!';
      return;
    }

    posts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'post-card';

      card.innerHTML = `
        <img src="${post.image}" alt="${post.title}" onerror="this.style.display='none'">
        <h3><a href="bookname.html?id=${post._id}">${post.title}</a></h3>
        <p><strong>Author:</strong> ${post.bookAuthor || 'Unknown'}</p>
        <p class="date">${new Date(post.date).toDateString()}</p>
        <p>${post.content.substring(0, 100)}...</p>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error('Error loading posts:', err);
    const message = document.getElementById('message');
    if (message) message.textContent = 'Error loading posts.';
  }
}

// Load a single post (for post detail page)
async function loadSinglePost() {
  const postId = new URLSearchParams(window.location.search).get('id');
  if (!postId) return;

  try {
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const res = await fetch(`${BACKEND_URL}/api/posts/${postId}`, { headers });

    if (!res.ok) throw new Error('Failed to load post');

    const post = await res.json();

    const container = document.getElementById('post-detail');
    if (container) {
      container.innerHTML = `
        <h2>${post.title}</h2>
        <p><strong>Author:</strong> ${post.bookAuthor || 'Unknown'}</p>
        <img src="${post.image}" alt="${post.title}" onerror="this.style.display='none'"/>
        <p>${post.content.replace(/\n/g, '<br>')}</p>
      `;
    }
  } catch (err) {
    console.error(err);
    const container = document.getElementById('post-detail');
    if (container) container.innerHTML = '<p>Error loading post.</p>';
  }
}

// Show comment form only if user is logged in
function setupCommentForm() {
  if (!token) return;

  const form = document.getElementById('comment-form-container');
  if (form) form.style.display = 'block';

  const submitBtn = document.getElementById('submit-comment');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', async () => {
    const text = document.getElementById('comment-text').value.trim();
    if (!text) {
      alert("Comment can't be empty");
      return;
    }

    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ text })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.errors?.[0]?.msg || data.error || "Failed to post comment");
        return;
      }

      document.getElementById('comment-text').value = '';
      // Reload comments fresh after posting
      await loadComments();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  });
}

// Load comments for a single post
async function loadComments() {
  const postId = new URLSearchParams(window.location.search).get('id');
  if (!postId) return;

  try {
    const res = await fetch(`${BACKEND_URL}/api/posts/${postId}`);
    const post = await res.json();
    renderComments(post.comments);
  } catch (err) {
    console.error("Error loading comments:", err);
  }
}

// Render comment list
function renderComments(comments = []) {
  const list = document.getElementById('comments-list');
  if (!list) return;

  list.innerHTML = '';
  comments.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.username || 'Anonymous'}: ${c.text}`;
    list.appendChild(li);
  });
}

// Setup login/logout/register buttons and greeting
function setupUserUI() {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const registerBtn = document.getElementById('register-btn');
  const userInfo = document.getElementById('user-info');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userInfo.textContent = `Welcome, ${payload.username || payload.email || 'User'}`;
    } catch {
      userInfo.textContent = 'Welcome!';
    }
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline';
    if (registerBtn) registerBtn.style.display = 'inline';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (userInfo) userInfo.textContent = '';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      location.reload();
    });
  }
}

// On window load, run relevant functions based on page
window.onload = () => {
  if (document.getElementById('blog-list')) loadPosts();

  if (document.getElementById('post-detail')) {
    loadSinglePost();
    loadComments();
    setupCommentForm();
  }

  setupUserUI();
};
