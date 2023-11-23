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

  document.getElementById("generateButton").click();
});

function processImage(imageSrc, canvas, text, color, textColor) {
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = function () {
    drawImageOnCanvas(img, ctx, canvas);
    drawCircularClip(ctx, canvas);
    drawBanner(ctx, canvas, color);
    drawCurvedText(ctx, canvas, text, textColor);
    updateImageSection(canvas);
  };

  img.src = imageSrc;
}

function drawImageOnCanvas(img, ctx, canvas) {
  const selectedSize = document.querySelector("#sizeSelect").value;
  const canvasSize = parseInt(selectedSize);
  let imgWidth, imgHeight;

  if (img.width > img.height) {
    imgHeight = canvasSize;
    imgWidth = (img.width / img.height) * canvasSize;
  } else {
    imgWidth = canvasSize;
    imgHeight = (img.height / img.width) * canvasSize;
  }

  const dx = (canvasSize - imgWidth) / 2;
  const dy = (canvasSize - imgHeight) / 2;

  canvas.width = canvasSize;
  canvas.height = canvasSize;
  ctx.drawImage(img, dx, dy, imgWidth, imgHeight);
}

function drawCircularClip(ctx, canvas) {
  const canvasSize = canvas.width;
  ctx.beginPath();
  ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 + 1, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();
}

function drawBanner(ctx, canvas, color) {
  const canvasSize = canvas.width;
  const bannerWidth = canvasSize * 0.16;
  const gradient = ctx.createLinearGradient(0, canvasSize, canvasSize * 0.97, -0.5 * canvasSize);

  gradient.addColorStop(0.26, color);
  gradient.addColorStop(0.3, color + "80");
  gradient.addColorStop(0.36, color + "1A");
  gradient.addColorStop(0.38, color + "00");

  ctx.beginPath();
  ctx.arc(canvasSize / 2, canvasSize / 2, canvasSize / 2 - bannerWidth / 2 + 1, 0, 1.2 * Math.PI, false);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = bannerWidth;
  ctx.stroke();
}

function drawCurvedText(ctx, canvas, text, textColor) {
  const canvasSize = canvas.width;
  const bannerWidth = canvasSize * 0.16;
  const textRadius = canvasSize / 1.7 - bannerWidth;
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
  const addToRotate = 0.88 + text.length * 0.016;

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
  const dataURL = canvas.toDataURL("image/jpeg");
  document.getElementById("generatedImage").src = dataURL;
  document.getElementById("generatedImage").classList.remove("hidden");
  document.getElementById("downloadLink").href = dataURL;
  document.getElementById("downloadLink").classList.remove("hidden");
  document.getElementById("downloadLink").download = "image_profil_personnalisee.jpeg";
}

function generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.padStart(6, "0");
}

document.addEventListener("DOMContentLoaded", function () {
  const sizeInput = document.getElementById("sizeSelect");

  sizeInput.addEventListener("input", function () {
    let value = parseInt(this.value, 10);

    if (value > 4000) {
      this.value = 4000;
    }
  });
});
