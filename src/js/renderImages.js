import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox;

// Funkcja renderująca obrazy w galerii za pomocą map
const renderImages = images => {
  const galleryMarkup = images
    .map(image => {
      return `
      <div class="photo-card">
        <a href="${image.largeImageURL}" class="lightbox-item">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes:</b><br>${image.likes}</p>
          <p class="info-item"><b>Views:</b><br>${image.views}</p>
          <p class="info-item"><b>Comments:</b><br>${image.comments}</p>
          <p class="info-item"><b>Downloads:</b><br>${image.downloads}</p>
        </div>
      </div>`;
    })
    .join('');

  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = galleryMarkup;

  // Inicjalizuj lub odśwież SimpleLightbox po dodaniu nowych obrazków
  if (!lightbox) {
    lightbox = new SimpleLightbox('.lightbox-item');
  } else {
    lightbox.refresh();
  }
};

export default renderImages;
