document.addEventListener("DOMContentLoaded", () => {
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");
  const colorsContainer = document.getElementById("colorsContainer");

  imageInput.addEventListener("change", handleImageUpload);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const image = new Image();
      image.src = reader.result;

      image.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, 600, 600);

        imagePreview.src = canvas.toDataURL();

        const imageData = ctx.getImageData(0, 0, 600, 600).data;
        const colorMap = new Map();

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const hexValue = rgbToHex(r, g, b);

          // Group similar colors by rounding their RGB values
          const roundedColor = roundColor(r, g, b);
          colorMap.set(roundedColor, colorMap.has(roundedColor) ? colorMap.get(roundedColor) + 1 : 1);
        }

        const sortedColors = Array.from(colorMap.keys()).sort((a, b) => colorMap.get(b) - colorMap.get(a));
        const dominantColors = sortedColors.slice(0, 60);

        colorsContainer.innerHTML = "";
        dominantColors.forEach(color => {
          const colorSquare = document.createElement("div");
          colorSquare.className = "colorSquare";
          colorSquare.style.backgroundColor = color;

          const hexValue = document.createElement("span");
          hexValue.textContent = color;

          colorSquare.appendChild(hexValue);
          colorsContainer.appendChild(colorSquare);
        });
      };
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function roundColor(r, g, b) {
    const precision = 16; // You can adjust this value to control color grouping precision
    const roundedR = Math.floor(r / precision) * precision;
    const roundedG = Math.floor(g / precision) * precision;
    const roundedB = Math.floor(b / precision) * precision;
    return rgbToHex(roundedR, roundedG, roundedB);
  }
});
