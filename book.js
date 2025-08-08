

async function loadBook() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  if (!postId) {
    document.getElementById('post-detail').innerHTML = '<p>Post ID not found.</p>';
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}`);
    const post = await res.json();

    const container = document.getElementById('post-detail');
    container.innerHTML = `
      <article>
        <h2>${post.title}</h2>
        <p class="date">${new Date(post.date).toDateString()}</p>
        <img src="${post.image}" alt="${post.title}">
        <p>${post.content.replace(/\n/g, '<br>')}</p>
      </article>
    `;
   } catch (err) {
    console.error("Failed to load blog post:", err);  // ✅ Add this
    document.getElementById('post-detail').innerHTML = '<p>Error loading post.</p>';
  }

}

window.onload = loadBook;
