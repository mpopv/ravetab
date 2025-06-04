let choosetab = document.querySelector(".choosetab");
let fullscreen = document.querySelector(".fullscreen");
let settingsbtn = document.querySelector(".settingsbtn");
let aboutbtn = document.querySelector(".aboutbtn");
let about = document.querySelector(".about");
let closeabout = document.querySelector(".closeabout");
let settings = document.querySelector(".settings");
let closesettings = document.querySelector(".closesettings");
let darkMaxInput = document.getElementById("darkMax");
let waveStyleSelect = document.getElementById("waveStyle");
let screenConstraints = { video: true, audio: true };
let canvas = document.querySelector("canvas");
let canvasCtx = canvas.getContext("2d");
let offscreenCanvas = null;
let drawCtx = canvasCtx;
let darkMax = parseInt(darkMaxInput.value, 10);
let waveStyle = waveStyleSelect.value;
let rgb = [darkMax * 0.2, darkMax * 0.8, darkMax];
let rgbDir = [true, true, true];

if (window.OffscreenCanvas) {
  offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
  drawCtx = offscreenCanvas.getContext("2d");
}

darkMaxInput.addEventListener("input", (e) => {
  darkMax = parseInt(e.target.value, 10);
});

waveStyleSelect.addEventListener("change", (e) => {
  waveStyle = e.target.value;
});

const increment = function () {
  const [r2, g2, b2] = rgb.map((color, i) => {
    const up = rgbDir[i];
    if (up) {
      if (color === darkMax) {
        rgbDir[i] = false;
        return color - 1;
      }
      return color + 1;
    } else {
      if (color === 0) {
        rgbDir[i] = true;
        return color + 1;
      }
      return color - 1;
    }
  });
  rgb = [r2, g2, b2];
};

setInterval(increment, 50);

choosetab.addEventListener("click", () => {
  document.querySelector(".warning").classList.add("hide");
  startCapture();
});

fullscreen.addEventListener("click", () => {
  document.querySelector(".warning").classList.add("hide");
  canvas.requestFullscreen();
});

aboutbtn.addEventListener("click", () => {
  document.querySelector(".warning").classList.add("hide");
  about.classList.add("show");
});

closeabout.addEventListener("click", () => {
  about.classList.remove("show");
});

settingsbtn.addEventListener("click", () => {
  document.querySelector(".warning").classList.add("hide");
  settings.classList.add("show");
});

closesettings.addEventListener("click", () => {
  settings.classList.remove("show");
});

window.addEventListener("resize", () => {
  canvas = document.querySelector("canvas");
  if (offscreenCanvas) {
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
  }
});

const FRAME_INTERVAL = 1000 / 30;
let lastFrame = 0;

const startCapture = async function () {
  rgb = [darkMax * 0.2, darkMax * 0.8, darkMax];
  rgbDir = [true, true, true];

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia(
      screenConstraints
    );

    let audioCtx = new AudioContext();
    let analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    const gain = audioCtx.createGain();
    gain.gain.value = 1.0;
    source.connect(gain).connect(analyser);

    analyser.fftSize = 2048;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    const draw = function () {
      requestAnimationFrame(draw);

      const now = performance.now();
      if (now - lastFrame < FRAME_INTERVAL) {
        return;
      }
      lastFrame = now;

      if (Math.random() > 0.25) {
        increment();
      }

      analyser.getByteTimeDomainData(dataArray);

      drawCtx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      drawCtx.fillRect(0, 0, canvas.width, canvas.height);

      drawCtx.lineWidth = 4;
      drawCtx.strokeStyle = "rgb(255, 255, 255)";

      drawCtx.beginPath();

      let sliceWidth = (canvas.width * 1.0) / bufferLength;
      let max = Math.max(...Array.from(dataArray));

      let [r, g, b] = rgb;
      drawCtx.strokeStyle = `rgb(${r + 50}, ${g + 50}, ${b + 50})`;

      if (waveStyle !== "line" && max > 175) {
        [1, 2, 3, 4].forEach(function (n) {
          drawCtx.beginPath();
          drawCtx.arc(
            canvas.width / 2,
            canvas.height / 2,
            (canvas.height / n) * (max / 255),
            0,
            2 * Math.PI
          );
          drawCtx.stroke();
        });
      }

      if (waveStyle !== "circle") {
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          if (max > 200) {
            increment();
          }
          if (max > 225) {
            increment();
            increment();
          }

          let value = dataArray[i] * 1;
          let v = value / 128.0;
          let y = (v * canvas.height) / 2;

          drawCtx.strokeStyle = `rgb(255, 255, 255)`;
          if (max < 200) {
            drawCtx.strokeStyle = `rgb(${r + 200}, ${g + 200}, ${b + 200})`;
          }

          if (i === 0) {
            drawCtx.moveTo(x, y);
          } else {
            drawCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        drawCtx.lineTo(canvas.width, canvas.height / 2);
        drawCtx.lineWidth = 2;
        if (max > 100) {
          drawCtx.lineWidth = (max / 100) * 3;
        }
        drawCtx.stroke();
      }

      if (offscreenCanvas) {
        canvasCtx.drawImage(offscreenCanvas, 0, 0);
      }
    };

    draw();
  } catch (err) {
    console.error("Error: " + err);
  }
};
