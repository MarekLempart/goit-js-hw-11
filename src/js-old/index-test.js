// od Marcina
const queryString = 'yellow flowers';
const preparedQueryString = queryString.split(' ').join('+');
fetch(
  `https://pixabay.com/api/?key=42451517-7ac5a5d17c420ae469b144174&q=${input.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${currentPerPage}&page=${page}`
)
  .then(response => response.json())
  .then(({ hits }) => {
    const markupArray = hits.map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-cart">
        <img src=${webformatURL} alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
        <p class="info-item">
          <b>Views: ${views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${downloads}</b>
        </p>
      </div>
    </div>`
    );

    return markupArray;
  })
  .then(markupArray => {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = markupArray.join('');
  });
//koniec

// // Robione na zajęciach
// images.hits.map(
//   ({
//     webformatURL,
//     largeImageURL,
//     tags,
//     likes,
//     views,
//     comments,
//     downloads,
//   }) => `
// <div class="photo-card">
//   <a href="${largeImageURL}">
//     <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//   </a>
//   <div class="info">
//     <p class="info-item">
//       <b>Likes</b>
//       <br>${likes}
//     </p>
//     <p class="info-item">
//       <b>Views</b>
//       <br>${views}
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//       <br>${comments}
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//       <br>${downloads}
//     </p>
//   </div>
// </div>`
// );
// // koniec
