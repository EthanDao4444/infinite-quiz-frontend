import { useEffect, useRef, useState } from "react";

function getWaveY(x, i, t, freq, amp, degradation) {
  // Map degradation (0 to 1) into an integer wave index (0 to 9)
  const waveIndex = Math.floor(degradation * 10); // 0 to 9

  switch (waveIndex) {
    case 0: // 🌊 Classic sine-cos wobble
      return Math.sin(x * freq + t + i) * Math.cos((x + t * 10) * 0.01) * amp;

    case 1: // 🧠 Atan mutation
      return Math.atan(Math.sin(x * freq + t + i) + Math.cos(x * 0.1 - t)) * amp;

    case 2: // ⛓ Bouncy triangle wave
      return (((x + t * 100) % 200 < 100 ? x % 100 : 100 - (x % 100)) / 100 - 0.5) * amp * 2;

    case 3: // 🔳 Bitwise XOR glitch
      return (((x ^ (t * 50)) % 255) / 255 - 0.5) * amp * 2;

    case 4: // 🌪 Nested tangent distortion
      return Math.tan(Math.sin(x * freq + t + i) * 0.5) * Math.cos(t * 0.5) * amp * 0.2;

    case 5: // 🫧 Bubble wave
      return (Math.sin(x * freq + t + i) + Math.sin((x + t) * 0.2)) * amp * 0.5;

    case 6: // 🧬 DNA twister
      return Math.sin(x * freq + Math.sin(t + i)) * Math.cos((x + i) * 0.1 + t * 0.5) * amp;

    case 7: // ⚡ Chaotic pulse
      return (Math.atan(Math.sin(t + i) + Math.tan((x + t) * 0.01)) % 1) * amp;

    case 8: // 🦷 Sharp teeth wave
      return (((x * 0.5 + t * 10) % 50 < 25 ? x % 25 : 25 - (x % 25)) / 25 - 0.5) * amp * 2;

    case 9: // 🫀 Sin-cos chaos bloom
    default:
      return (
        Math.sin(x * freq + t + i) *
        Math.cos(x * 0.05 - t * 0.3 + Math.sin(i)) *
        amp * 0.8
      );
  }
}




export default function SineWavesBackground({
  backgroundColor = "black",
  degradation = 0, // 👈 new prop
}) {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState(backgroundColor);
  let transitionProgress = 0;
  let transitioning = false;

  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    let t = 0;

    // Helper: hex to RGB
    function hexToRgb(hex) {
      const bigint = parseInt(hex.replace("#", ""), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    }

    // Helper: interpolate colors
    function interpolateColor(color1, color2, factor) {
      const r = Math.round(color1.r + (color2.r - color1.r) * factor);
      const g = Math.round(color1.g + (color2.g - color1.g) * factor);
      const b = Math.round(color1.b + (color2.b - color1.b) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    }

    let fromColor = hexToRgb(currentColor);
    let toColor = hexToRgb(backgroundColor);

    function draw() {
      if (transitioning) {
        transitionProgress += 0.02;
        if (transitionProgress >= 1) {
          transitionProgress = 1;
          transitioning = false;
          setCurrentColor(backgroundColor);
        }
      }

      const bgColor = interpolateColor(fromColor, toColor, transitionProgress);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 16;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";

      const waveCount = 3 + degradation * 2; // more degradation = more waves
      const maxAmplitude = 100 + degradation * 10; // higher amplitude
      const freqJitter = degradation * 0.01; // chaotic frequency

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const baseFreq = 0.01 + i * 0.002;
          const freq = baseFreq + Math.random() * freqJitter; // add jitter
          const amp = maxAmplitude + Math.random() * 10 * degradation;
          const y = height / 2 + getWaveY(x, i, t, freq, amp, degradation);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      t += 0.01 + degradation * 0.002; // faster animation with more chaos
      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentColor, backgroundColor, degradation]);

  useEffect(() => {
    if (currentColor !== backgroundColor) {
      transitionProgress = 0;
      transitioning = true;
    }
  }, [backgroundColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
