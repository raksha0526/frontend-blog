async function loadPosts() {
  try {
    const res = await fetch('http://localhost:5000/api/posts');
    const posts = await res.json();

    const container = document.getElementById('blog-list');
    container.innerHTML = '';

    posts.forEach(post => {
      const card = document.createElement('article');
      card.className = 'post-card';

      card.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <h3><a href="bookname.html?id=${post._id}">${post.title}</a></h3>
        <p class="date">${new Date(post.date).toDateString()}</p>
        <p>${post.content.substring(0, 100)}...</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading posts:', err);
  }
}window.onload = function() {
  fetch('/api/posts')
    .then(res => res.json())
    .then(data => {
      const blogList = document.getElementById('blog-list');
      if (data.length === 0) {
        document.getElementById('message').textContent = 'No posts yet!';
      } else {
        data.forEach(post => {
          const postElement = document.createElement('div');
          postElement.classList.add('blog-preview');
          postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.excerpt || post.content.substring(0, 100)}...</p>
            <a href="bookname.html?id=${post._id}">Read more</a>
          `;
          blogList.appendChild(postElement);
        });
      }
    })
    .catch(err => {
      document.getElementById('message').textContent = 'Error loading posts.';
      console.error(err);
    });
};

window.onload = loadPosts;
