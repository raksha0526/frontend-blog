async function loadPosts() {
  try {
    const res = await fetch('https://backend-blog-dnjq.onrender.com/api/posts');
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

// Comment Section Logic
const token = localStorage.getItem('token');
const postId = new URLSearchParams(window.location.search).get('id');

// Show comment form only if user is logged in
if (token) {
  const form = document.getElementById('comment-form-container');
  if (form) form.style.display = 'block';
}

// Submit comment
const submitBtn = document.getElementById('submit-comment');
if (submitBtn) {
  submitBtn.addEventListener('click', async () => {
    const text = document.getElementById('comment-text').value.trim();
    if (!text) {
      alert("Comment can't be empty");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
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
      renderComments(data); // this should be `loadComments()` ideally

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  });
}

// Load comments
async function loadComments() {
  try {
    const res = await fetch(`/api/posts/${postId}`);
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

// Run
window.onload = () => {
  loadPosts();
  loadComments();
};
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const registerBtn = document.getElementById('register-btn');
  const userInfo = document.getElementById('user-info');

  if (token) {
    // Decode token to get username
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userInfo.textContent = `Welcome, ${payload.username || 'User'}`;
    } catch {
      userInfo.textContent = 'Welcome!';
    }

    loginBtn.style.display = 'none';
    registerBtn.style.display = 'none';
    logoutBtn.style.display = 'inline';
  } else {
    loginBtn.style.display = 'inline';
    registerBtn.style.display = 'inline';
    logoutBtn.style.display = 'none';
    userInfo.textContent = '';
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    location.reload();
  });
});
