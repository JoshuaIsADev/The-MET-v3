const btnMin = document.querySelector('.btn-minimize');
const artDisplay = document.querySelector('.art-display');
const bodyDocument = document.body;

function scaleImage() {
  artDisplay.classList.toggle('min');
  btnMin.classList.toggle('rotate180');
  bodyDocument.classList.toggle('overflow');
}

//SCALE ARTWORK EVENT LISTENER
btnMin.addEventListener('click', function () {
  scaleImage();
});

bodyDocument.addEventListener('keydown', function (e) {
  if (e.key === ' ') {
    scaleImage();
  }
});

//NEXT ARTWORK EVENT LISTENER
bodyDocument.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    console.log('next image');
  }
});

// FETCH ARTWORK

//GET RANDOM INDEX
function getRandomIndex(array) {
  const randomDecimal = Math.random();
  const randomIndex = Math.floor(randomDecimal * array.length);
  return randomIndex;
}

//GET ARTWORK ID

// FETCH ARTWORK
axios
  .get('https://collectionapi.metmuseum.org/public/collection/v1/search', {
    params: {
      q: '',
      departmentId: 11,
      hasImages: 'true',
    },
  })
  .then((res) => {
    const returnedArray = res.data.objectIDs;
    const randomIndex = getRandomIndex(returnedArray);
    const returnedArtwork = `${returnedArray[`${randomIndex}`]}`;
    console.log(returnedArtwork);
    // const fetchImage
    // axios
    //   .get(
    //     'https://collectionapi.metmuseum.org/public/collection/v1/objects/437060',
    //     {
    //       params: `${returnedArtwork}`,
    //     }
    //   )
    //   .then((res) => {
    //     const returnedImage = res.data.primaryImage;
    //     console.log(returnedImage);
    //   });
  });
