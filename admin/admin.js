// /frontend/admin/admin.js

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
  const image = document.getElementById('image').value.trim();
  const content = document.getElementById('content').value.trim();
  const token = localStorage.getItem('token');

  if (!title || !content) return alert("Title and content are required!");

  try {
    const res = await fetch('https://backend-blog-dnjq.onrender.com/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, image, content })
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
    const res = await fetch('https://backend-blog-dnjq.onrender.com/api/posts');
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

// DELETE POST
async function deletePost(postId) {
  const token = localStorage.getItem('token');
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    const res = await fetch(`https://backend-blog-dnjq.onrender.com/api/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      alert('Failed to delete post');
      return;
    }

    alert('Post deleted');
    loadPosts();
  } catch (err) {
    console.error('Error deleting post:', err);
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
