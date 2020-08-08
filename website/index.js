let [button, fullscreen] = Array.from(document.querySelectorAll("button"));
let screenConstraints = { video: true, audio: true };
let canvas = document.querySelector("canvas");
let canvasCtx = canvas.getContext("2d");

const DARK_MAX = 80;

setInterval(50, function () {
  increment(rgb);
});

button.addEventListener("click", () => {
  document.querySelector(".warning").classList.add("hide");
  startCapture();
});

fullscreen.addEventListener("click", () => {
  canvas.requestFullscreen();
});

window.addEventListener("resize", () => {
  canvas = document.querySelector("canvas");
});

const startCapture = async function () {
  let rgb = [DARK_MAX * 0.2, DARK_MAX * 0.8, DARK_MAX];
  let rgbDir = [true, true, true];
  const increment = function () {
    const [r2, g2, b2] = rgb.map((color, i) => {
      const up = rgbDir[i];
      if (up) {
        if (color === DARK_MAX) {
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
      requestAnimationFrame(draw.bind(this));

      if (Math.random() > 0.25) {
        increment();
      }

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "rgb(0, 0, 0)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 4;
      canvasCtx.strokeStyle = "rgb(255, 255, 255)";

      canvasCtx.beginPath();

      let sliceWidth = (canvas.width * 1.0) / bufferLength;
      let max = Math.max(...Array.from(dataArray)).toFixed(0);
      let bgColor = (parseFloat(max) / 1.25).toFixed(0);
      if (parseFloat(max) < 175) {
        bgColor = (parseFloat(max) / 3).toFixed(0);
      }
      if (parseFloat(max) < 125) {
        bgColor = (parseFloat(max) / 4).toFixed(0);
      }
      if (parseFloat(max) < 75) {
        bgColor = (parseFloat(max) / 5).toFixed(0);
      }

      let [r, g, b] = rgb;
      let multiplier = 255 - DARK_MAX;
      canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      let LINE_MAX = 255 - DARK_MAX;

      canvasCtx.strokeStyle = `rgb(${r + 50}, ${g + 50}, ${b + 50})`;
      if (max > 175) {
        [1, 2, 3, 4].forEach(function (n) {
          canvasCtx.beginPath();
          canvasCtx.arc(
            canvas.width / 2,
            canvas.height / 2,
            (canvas.height / n) * (parseFloat(max) / 255),
            0,
            2 * Math.PI
          );
          canvasCtx.stroke();
        });
      }

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
        let c = value.toFixed(0);

        canvasCtx.strokeStyle = `rgb(255, 255, 255)`;
        if (max < 200) {
          canvasCtx.strokeStyle = `rgb(${r + 200}, ${g + 200}, ${b + 200})`;
        }

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.lineWidth = 2;
      if (parseFloat(max) > 100) {
        canvasCtx.lineWidth = (parseFloat(max) / 100) * 3;
      }
      canvasCtx.stroke();
    };

    draw();
  } catch (err) {
    console.error("Error: " + err);
  }
};
