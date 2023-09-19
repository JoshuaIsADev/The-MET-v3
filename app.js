const btnMin = document.querySelector('.btn-minimize');
const artDisplay = document.querySelector('.art-display');
const bodyDocument = document.body;

function scaleImage() {
  artDisplay.classList.toggle('min');
  btnMin.classList.toggle('rotate180');
  bodyDocument.classList.toggle('overflow');
}

//SCALE IMAGE EVENT LISTENER
btnMin.addEventListener('click', function () {
  scaleImage();
});

bodyDocument.addEventListener('keydown', function (e) {
  if (e.key === ' ') {
    scaleImage();
  }
});

//NEXT IMAGE EVENT LISTENER
bodyDocument.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    console.log('next image');
  }
});

// FETCH ARTWORK
// const fetchArtwork = async () => {
//   const responseArtwork = await axios.get(
//     'https://collectionapi.metmuseum.org/public/collection/v1/search',
//     {
//       params: {
//         q: '',
//         medium: 'Paintings',
//         hasImages: 'true',
//         isOnView: 'true',
//       },
//     }
//   );
// };

// axios
//   .get('https://collectionapi.metmuseum.org/public/collection/v1/search', {
//     params: {
//       q: '',
//       medium: 'Paintings',
//       hasImages: 'true',
//       isOnView: 'true',
//     },
//   })
//   .then((res) => {
//     console.log(res);
//   });
