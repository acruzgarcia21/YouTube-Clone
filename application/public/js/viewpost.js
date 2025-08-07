const commentButton = document.getElementById('comment-button');

commentButton.addEventListener('click', async function (e) {
    e.preventDefault();

    var commentText = document.getElementById('comment-text').value.trim();
    const post_id = e.currentTarget.dataset.postid;

    if(!commentText) return alert("Comment CANNOT be empty!");

    return fetch('/comments/create', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: commentText,
            post_id: post_id
        })
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            const newComment = document.createElement('div');
            newComment.className = 'comment mb-3 p-2 rounded bg-dark text-white';
            newComment.innerHTML = `
            <p><strong>${data.username}</strong> <small>Just now</small></p>
            <p>${commentText}</p>`;
            commentList.prepend(newComment);

            document.getElementById('comment-text').value = "";  // Clear after success
        })
        .catch(err => console.log(err));
});

