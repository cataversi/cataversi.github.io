    document.addEventListener('DOMContentLoaded', function () {
      const videoPlayerContainer = document.getElementById('videoPlayerContainer');
      const videoPlayer = document.getElementById('videoPlayer');
      const playlistItems = document.querySelectorAll('.playlist li');

      let hls;

      function playVideo(sourceUrl) {
        if (hls) {
          hls.destroy();
        }

        hls = new Hls();
        hls.loadSource(sourceUrl);
        hls.attachMedia(videoPlayer);
        videoPlayer.play();
      }

      // Function to check if HLS.js is loaded before initializing the playlist
      function initializePlaylist() {
        if (window.Hls) {
          playlistItems.forEach(item => {
            item.addEventListener('click', () => {
              const sourceUrl = item.getAttribute('data-src');
              playVideo(sourceUrl);
            });
          });
        } else {
          // Retry after 100ms if HLS.js is not loaded yet
          setTimeout(initializePlaylist, 100);
        }
      }

      // Call the function to initialize the playlist
      initializePlaylist();
    });