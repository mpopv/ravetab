![ravetab logo](https://github.com/mpopv/ravetab/blob/master/website/assets/ravetab.jpg?raw=true)

# ravetab

**ravetab.com** is a lightweight audio visualizer that runs entirely in your web browser. It captures the audio from another Chrome tab and draws a responsive oscilloscope on a full page canvas. The whole visualizer is implemented in a single 170-line JavaScript file.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Development](#development)
- [Screenshots](#screenshots)
- [License](#license)

## Overview

ravetab is an experiment in using the latest web technologies—`getDisplayMedia`, the Web Audio API, and the HTML5 Canvas—to build an interactive visualizer with no server component. The page prompts you to share another tab, listens to the tab audio and then renders an animated waveform whose color pulses with the volume.

The site also includes a built-in fullscreen mode, a short set of on-page instructions, and a warning about flashing lights for users with photosensitive epilepsy.

## Features
- Browser-only implementation with no dependencies.
- Captures audio from another Chrome tab using [`navigator.mediaDevices.getDisplayMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia).
- Analyzes the sound using the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) and visualizes it on a `<canvas>`.
- Dynamic background color and waveform that react to the incoming audio.
- Optional fullscreen mode.
 - Adjustable color intensity and waveform style via a settings dialog.
- Optimized rendering with OffscreenCanvas and frame rate throttling.
- Approximately 170 lines of plain JavaScript located in [`website/index.js`](website/index.js).

## Requirements
- Google Chrome or any Chromium-based browser that supports screen capture (`getDisplayMedia`).
- Because the effect flashes rapidly, do **not** use ravetab if you are prone to photosensitive seizures.

## Getting Started
You can either visit [ravetab.com](https://ravetab.com) or run the page locally.

```bash
git clone https://github.com/mpopv/ravetab.git
cd ravetab
```

The simplest way to open it locally is to serve the `website` directory:

```bash
npx http-server ./website
```

Then navigate to `http://localhost:8080` in Chrome.

## Usage
1. In Chrome, open a tab that plays music (YouTube, Spotify, etc.). Tracks with heavy bass will produce the most dramatic effects.
2. In another tab open the ravetab page (either [ravetab.com](https://ravetab.com) or your local copy).
3. Click **About** to read the instructions and warning.
4. Click **Choose tab** and select the tab that is playing audio. Make sure the “Share tab audio” checkbox is enabled before clicking **Share**.
5. Focus will switch to that tab. Return to the ravetab tab and enjoy the visualizer. You can also click **Full screen** for an immersive display.

## Development
All of the client code lives inside the [`website`](website) folder:

- `index.html` – the static page with a `<canvas>` element and control buttons.
- `index.js` – the 170-line script that handles media capture, audio analysis and drawing.
- `style.css` – styles for the page, including the warning and About dialog.
- `assets/` – images used by the site.

Contributions are welcome via pull requests. The project uses the MIT license.

## Screenshots
![ravetab screenshot](website/assets/instructions.png)

## License
Licensed under the [MIT License](LICENSE).
