// /frontend/admin/admin.js
const BACKEND_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://blogsiter.onrender.com';

// TAB SWITCHING
document.getElementById('view-posts-tab').addEventListener('click', () => {
  document.getElementById('posts-section').classList.add('active');
  document.getElementById('create-post-section').classList.remove('active');
  loadPosts();
});

document.getElementById('create-post-tab').addEventListener('click', () => {
  document.getElementById('posts-section').classList.remove('active');
  document.getElementById('create-post-section').classList.add('active');
});

// POST FORM SUBMIT
document.getElementById('post-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const bookAuthor = document.getElementById('bookAuthor').value.trim();  // Get value
  const image = document.getElementById('image').value.trim();
  const content = document.getElementById('content').value.trim();
  const token = localStorage.getItem('token');

  if (!title || !content || !bookAuthor) return alert("Title, Book Author, and content are required!");

  try {
    const res = await fetch(`${BACKEND_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, bookAuthor, image, content })  // Send bookAuthor here
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.errors?.[0]?.msg || data.message || 'Failed to create post');
      return;
    }

    alert('Post created successfully!');
    document.getElementById('post-form').reset();
    loadPosts();
  } catch (err) {
    console.error('Error:', err);
    alert('Something went wrong.');
  }
});


// LOAD POSTS
async function loadPosts() {
  const container = document.getElementById('post-list');
  container.innerHTML = '';

  try {
    const res = await fetch(`${BACKEND_URL}/api/posts`);
    const posts = await res.json();

    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'post-card';
      card.innerHTML = `
        <h4>${post.title}</h4>
        <p>${post.content.substring(0, 100)}...</p>
        <button onclick="deletePost('${post._id}')">Delete</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load posts:', err);
  }
}

async function deletePost(postId) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to delete posts.');
    return;
  }

  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    const res = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || 'Failed to delete post');
      return;
    }

    alert('Post deleted');
    loadPosts();
  } catch (err) {
    console.error('Error deleting post:', err);
    alert('Error deleting post');
  }
}

// LOGOUT
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  alert("Logged out");
  window.location.href = '/index.html'; // or login page
});

// Initial load
window.onload = loadPosts;