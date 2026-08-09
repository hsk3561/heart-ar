<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Explore the Heart</title>

  <link rel="stylesheet" href="./style.css" />

  <script
    type="module"
    src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js">
  </script>
</head>

<body>

  <main class="page">

    <h1>Explore the Human Heart</h1>

    <p>
      Rotate, zoom, and explore the heart in 3D or augmented reality.
    </p>

    <model-viewer
      src="./models/heart.glb"

      alt="3D model of the human heart"

      camera-controls

      touch-action="pan-y"

      auto-rotate

      autoplay

      animation-crossfade-duration="300"

      shadow-intensity="1"

      ar

      ar-modes="webxr scene-viewer quick-look"

      ar-scale="auto"

      environment-image="neutral">

      <button
        slot="ar-button"
        class="ar-button">
        View in AR
      </button>

    </model-viewer>

  </main>

</body>

</html>