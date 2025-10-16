let posts = {};
let currentPostId = 1;
const API_URL = "https://movie-api-nine-ebon.vercel.app"; // 你的後端 API 網址

async function fetchPosts() {
  try {
    const res = await fetch(`${API_URL}/posts`);
    posts = await res.json();
    renderPostList();
    renderPost(currentPostId);
  } catch (err) {
    alert("無法取得貼文資料，請確認後端有啟動");
  }
}

function renderPostList() {
  const listDiv = document.getElementById("postList");
  listDiv.innerHTML = "";
  for (const id in posts) {
    const post = posts[id];
    const card = document.createElement("div");
    card.className = "article-card border rounded-lg p-4 hover:bg-gray-50 cursor-pointer";
    card.innerHTML = `
      <h2 class="font-bold text-lg">${post.title}</h2>
      <p class="text-sm text-gray-600">導演：${post.director}</p>
      <p class="text-gray-700 mt-2">${post.content.slice(0, 20)}...</p>
      <p class="text-right text-blue-600 text-sm">閱讀更多 →</p>
    `;
    card.addEventListener("click", () => {
      currentPostId = id;
      renderPost(id);
    });
    listDiv.appendChild(card);
  }
}

function renderPost(id) {
  const post = posts[id];
  document.getElementById("moviePoster").src = post.poster;
  document.getElementById("postTitle").textContent = post.title;
  document.getElementById("postDirector").textContent = `導演：${post.director}`;
  document.getElementById("postContent").textContent = post.content;
  document.getElementById("likeCount").textContent = post.likes;
  document.getElementById("commentCount").textContent = post.comments.length;
  renderComments(post.comments);
}

function renderComments(commentArray) {
  const list = document.getElementById("commentList");
  list.innerHTML = "";
  commentArray.forEach(c => {
    const div = document.createElement("div");
    div.className = "border rounded-lg p-2 bg-white flex items-start space-x-2";
    div.innerHTML = `<div class="text-gray-400 text-xl">👤</div><p class="text-gray-800">${c.user}: ${c.text}</p>`;
    list.appendChild(div);
  });
  document.getElementById("commentCount").textContent = commentArray.length;
}

document.getElementById("likeBtn").addEventListener("click", async () => {
  try {
    const res = await fetch(`${API_URL}/posts/${currentPostId}/like`, { method: "POST" });
    const data = await res.json();
    posts[currentPostId].likes = data.likes;
    document.getElementById("likeCount").textContent = data.likes;
  } catch {
    alert("按讚失敗");
  }
});

document.getElementById("commentBtn").addEventListener("click", () => {
  document.getElementById("commentInputArea").classList.toggle("hidden");
});

document.getElementById("sendComment").addEventListener("click", async () => {
  const text = document.getElementById("commentText").value.trim();
  if (!text) return;
  try {
    const res = await fetch(`${API_URL}/posts/${currentPostId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: "K", text })
    });
    const data = await res.json();
    posts[currentPostId].comments = data.comments;
    renderComments(data.comments);
    document.getElementById("commentText").value = "";
  } catch {
    alert("留言失敗");
  }
});

window.onload = fetchPosts;
