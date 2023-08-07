document.addEventListener('DOMContentLoaded', function () {
  const videoPlayerContainer = document.getElementById('videoPlayerContainer');
  const videoPlayer = document.getElementById('videoPlayer');
  const playlistItems = document.querySelectorAll('.playlist li');

  // Function to play the video using HLS.js
  function playVideoWithHls(sourceUrl) {
    if (Hls.isSupported()) {
      let hls = new Hls();
      hls.loadSource(sourceUrl);
      hls.attachMedia(videoPlayer);
      videoPlayer.play();
    } else {
      console.error('HLS is not supported in this browser.');
    }
  }

  // Function to play the video directly in Safari
  function playVideoInSafari(sourceUrl) {
    if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
      videoPlayer.src = sourceUrl;
      videoPlayer.play();
    } else {
      console.error('M3U8 video format is not supported in this browser.');
    }
  }

  // Function to initialize the playlist
  function initializePlaylist() {
    playlistItems.forEach(item => {
      item.addEventListener('click', () => {
        const sourceUrl = item.getAttribute('data-src');

        // Check if the browser is Safari, then play the video directly
        if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
          playVideoInSafari(sourceUrl);
        } else {
          // For other browsers, play the video using HLS.js
          playVideoWithHls(sourceUrl);
        }
      });
    });
  }

  // Call the function to initialize the playlist
  initializePlaylist();
});
