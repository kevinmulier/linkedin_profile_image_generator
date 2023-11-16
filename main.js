document.getElementById("imageForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const imageInput = document.getElementById("imageInput");
  const textInput = document.getElementById("textInput").value;
  const colorInput = document.getElementById("colorInput").value;
  const textColorInput = document.getElementById("textColorInput").value;
  const canvas = document.getElementById("imageCanvas");

  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      processImage(e.target.result, canvas, textInput, colorInput, textColorInput);
    };
    reader.readAsDataURL(imageInput.files[0]);
  }
});

document.getElementById("randomColorButton").addEventListener("click", function () {
  const randomColor = generateRandomColor();
  const randomTextColor = generateRandomColor();

  document.getElementById("colorInput").value = randomColor;
  document.getElementById("textColorInput").value = randomTextColor;

  document.getElementById("imageForm").dispatchEvent(new Event("submit"));
});

function processImage(imageSrc, canvas, text, color, textColor) {
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = function () {
    drawImageOnCanvas(img, canvas, ctx);
    drawCircularClip(ctx, canvas);
    drawBanner(ctx, canvas, color);
    drawCurvedText(ctx, canvas, text, textColor);
    updateImageSection(canvas);
  };

  img.src = imageSrc;
}

function drawImageOnCanvas(img, canvas, ctx) {
  const canvasSize = 280;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
}

function drawCircularClip(ctx, canvas) {
  const canvasSize = canvas.width;
  ctx.beginPath();
  ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
}

function drawBanner(ctx, canvas, color) {
  const canvasSize = canvas.width;
  const bannerWidth = canvasSize * 0.16;
  const gradient = ctx.createLinearGradient(-5, canvasSize, canvasSize * 0.97, -0.4 * canvasSize);
  gradient.addColorStop(0.28, color);
  gradient.addColorStop(0.4, "transparent");

  ctx.beginPath();
  ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - bannerWidth / 2, 2.16 * Math.PI, 1.2 * Math.PI, false);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = bannerWidth;
  ctx.stroke();
}

function drawCurvedText(ctx, canvas, text, textColor) {
  const canvasSize = canvas.width;
  const bannerWidth = canvasSize * 0.16;
  const textRadius = canvasSize / 1.725 - bannerWidth;
  const startAngle = -0.8 * Math.PI;
  const endAngle = 0.8 * Math.PI;
  const reversedText = text.split("").reverse().join("");

  ctx.fillStyle = textColor;
  ctx.font = `bold ${bannerWidth / 2}px monospace`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  drawTextOnPath(ctx, reversedText, canvasSize / 2, canvasSize / 2, textRadius, startAngle, endAngle);
}

function drawTextOnPath(ctx, text, centerX, centerY, radius, startAngle, endAngle) {
  const arcLength = endAngle - startAngle;
  const angleIncrement = arcLength / (text.length + 20);
  const addToRotate = 0.8 + text.length * 0.0214;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(-addToRotate * Math.PI);

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const angle = angleIncrement * i;

    ctx.save();
    ctx.rotate(angle);
    ctx.translate(0, -radius);
    ctx.rotate(Math.PI);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

function updateImageSection(canvas) {
  const dataURL = canvas.toDataURL("image/png");
  document.getElementById("generatedImage").src = dataURL;
  document.getElementById("generatedImage").classList.remove("hidden");
  document.getElementById("downloadLink").href = dataURL;
  document.getElementById("downloadLink").classList.remove("hidden");
  document.getElementById("downloadLink").download = "image_profil_personnalisee.png";
}

function generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.padStart(6, "0");
}
