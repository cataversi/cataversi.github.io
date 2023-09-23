document.addEventListener('DOMContentLoaded', () => {
  const source = 'https://vod4ro.antenaplay.ro/antena1/2023/09/18/bca9908737bfd4779794e867b548e652f1db172d9bd7a9de9f7e1f5cf052b1f8_,480p-wide,720p-wide,.mp4.urlset/master.m3u8?starttime=1695466670&endtime=1695473870&source=web&token=H1PHNsKJY0yDGowE5Vk5H87NuSQ=';
  const video = document.querySelector('video');

  const defaultOptions = {};

  if (!Hls.isSupported()) {
    video.src = source;
    var player = new Plyr(video, defaultOptions);
  } else {
    // For more Hls.js options, see https://github.com/dailymotion/hls.js
    const hls = new Hls();
    hls.loadSource(source);

    // From the m3u8 playlist, hls parses the manifest and returns
    // all available video qualities. This is important, in this approach,
    // we will have one source on the Plyr player.
    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {

      // Transform available levels into an array of integers (height values).
      const availableQualities = hls.levels.map(l => l.height);
      availableQualities.unshift(0); //prepend 0 to quality array

      // Add new qualities to option
      defaultOptions.quality = {
        default: 0, //Default - AUTO
        options: availableQualities,
        forced: true,
        onChange: e => updateQuality(e) };

      // Add Auto Label 
      defaultOptions.i18n = {
        qualityLabel: {
          0: 'Auto' } };



      hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
        var span = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span");
        if (hls.autoLevelEnabled) {
          span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`;
        } else {
          span.innerHTML = `AUTO`;
        }
      });

      // Initialize new Plyr player with quality options
      var player = new Plyr(video, defaultOptions);
    });

    hls.attachMedia(video);
    window.hls = hls;
  }

  function updateQuality(newQuality) {
    if (newQuality === 0) {
      window.hls.currentLevel = -1; //Enable AUTO quality if option.value = 0
    } else {
      window.hls.levels.forEach((level, levelIndex) => {
        if (level.height === newQuality) {
          console.log("Found quality match with " + newQuality);
          window.hls.currentLevel = levelIndex;
        }
      });
    }
  }
});