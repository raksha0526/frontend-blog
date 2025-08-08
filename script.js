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

window.onload = loadPosts;
