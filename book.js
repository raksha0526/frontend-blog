// ✅ Put this at the very top of your JS file
const BACKEND_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://blogsiter.onrender.com';

// Your existing function
async function loadBook() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  const container = document.getElementById('post-detail');

  if (!postId) {
    container.innerHTML = '<p>Post ID not found.</p>';
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/posts/${postId}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const post = await res.json();

    container.innerHTML = `
      <h1>${post.title}</h1>
      <p><strong>Author:</strong> ${post.bookAuthor || 'Unknown'}</p>
      <p><em>${new Date(post.date).toDateString()}</em></p>
      <div>${post.content.replace(/\n/g, '<br>')}</div>
    `;
  } catch (err) {
    console.error("Failed to load blog post:", err);
    container.innerHTML = '<p>Error loading post.</p>';
  }
}

window.onload = loadBook;
