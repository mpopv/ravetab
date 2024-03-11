![](https://github.com/mpopv/ravetab/blob/master/website/assets/ravetab.jpg?raw=true)

# ravetab

[ravetab.com](https://ravetab.com) is an visualizer for one of your other Chrome tabs.

## What is this?

It's an experiment to create a visualizer entirely in the browser using new web technologies.

It uses [navigator.mediaDevices.getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) to record another tab, and then streams the recorded audio to the [Web Audio API](AudioContext) and extracts waveform data to [draw an oscilloscope to canvas](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API).

This all happens in [a single 170-line JavaScript file](https://github.com/mpopv/ravetab/blob/master/website/index.js).

## How to use

1. In Chrome, visit a page that is playing music, like YouTube or Spotify. You'll get the most dramatic results with a track that has a loud, fast bassline. Think happy hardcore.

2. In another Chrome tab, visit [ravetab.com](https://ravetab.com).

3. Click About in the top right corner to read instructions.

4. Click Choose Tab in the bottom left corner and follow instructions to select the tab playing music.

5. Focus will switch to that tab. Go back to ravetab.com's tab and the visualizer will be running.
