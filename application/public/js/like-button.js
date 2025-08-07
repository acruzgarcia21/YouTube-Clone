document.addEventListener("DOMContentLoaded", function () {
  const likeButton = document.getElementById("like-button");

  if (likeButton) {
    likeButton.addEventListener("click", async function () {
      const postId = this.dataset.postid;
      try {
        const res = await fetch("/likes/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post_id: postId }),
        });

        const data = await res.json();
        const liked = data.liked;

        likeButton.classList.toggle("btn-outline-light", !liked);
        likeButton.classList.toggle("btn-light", liked);

        const icon = likeButton.querySelector("i");
        icon.classList.toggle("bi-hand-thumbs-up-fill", liked);
        icon.classList.toggle("bi-hand-thumbs-up", !liked);

        const likeCount = document.getElementById("like-count");
        let count = parseInt(likeCount.innerText, 10);
        likeCount.innerText = liked ? count + 1 : count - 1;

        likeButton.querySelector("span").innerText = liked ? "Liked" : "Like";
      } catch (err) {
        console.error("Error liking post:", err);
      }
    });
  }
});
