const likeButton = document.getElementById('like-button');
const likeCountSpan = document.getElementById('like-count');
const postId = likeButton.dataset.postid;

likeButton.addEventListener('click', async () => {
    try {
        const response = await fetch('/likes/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId }),
        });

        const data = await response.json();
        if (data.liked) {
            likeButton.classList.add('liked');
            likeButton.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i> <span id="like-count">${parseInt(likeCountSpan.textContent) + 1}</span> Likes`;
        } else {
            likeButton.classList.remove('liked');
            likeButton.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> <span id="like-count">${parseInt(likeCountSpan.textContent) - 1}</span> Like`;
        }
    } catch (error) {
        console.error(error);
    }
});

const commentButton = document.getElementById('comment-button');
const commentList = document.getElementById('comment-list');
const commentTextArea = document.getElementById('comment-text');

commentButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const commentText = commentTextArea.value.trim();
    if (!commentText) return alert("Comment cannot be empty.");

    try {
        const response = await fetch('/comments/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: commentText, post_id: postId }),
        });
        const data = await response.json();

        // Prepend new comment
        const newCommentDiv = document.createElement('div');
        newCommentDiv.className = 'comment mb-3 p-2 rounded bg-dark text-white';
        newCommentDiv.innerHTML = `<p><strong>${data.username}</strong> <small>Just now</small></p><p>${commentText}</p>`;
        commentList.prepend(newCommentDiv);

        // Update comment counter
        const commentCountSpan = document.getElementById('comment-count');
        commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;

        commentTextArea.value = '';
    } catch (err) {
        console.error(err);
    }
});