document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.delete-post-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const postId = e.currentTarget.dataset.postid;

      if (!confirm('Are you sure you want to delete this post?')) {
        return;
      }

      try {
        const response = await fetch(`/posts/${postId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (response.ok) {
          alert(data.message);
          // Reload the page so the deleted post disappears
          window.location.reload();
        } else {
          alert(data.error || 'Failed to delete post');
        }
      } catch (err) {
        console.error('Delete failed:', err);
        alert('An error occurred while deleting the post.');
      }
    });
  });
});
