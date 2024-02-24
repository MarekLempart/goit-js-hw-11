// renderImages.js
const renderImages = data => {
  const { images } = data; // Pobierz tablicę obrazków z obiektu data

  // Upewnij się, że images jest tablicą i ma co najmniej jeden element
  if (Array.isArray(images) && images.length > 0) {
    const gallery = document.querySelector('.gallery');

    images.forEach(image => {
      const imgElement = document.createElement('img');
      imgElement.src = image.webformatURL;
      imgElement.alt = image.tags;
      imgElement.classList.add('photo-card');

      gallery.appendChild(imgElement);
    });
  } else {
    console.error('No images to render.');
  }
};

export default renderImages;
