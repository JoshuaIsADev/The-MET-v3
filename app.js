const btnMin = document.querySelector('.btn-minimize');
const btnNext = document.querySelector('.btn-next');
const artDisplay = document.querySelector('.art-display');
const artArtist = document.querySelector('.art-artist');
const artTitle = document.querySelector('.art-title');
const artDate = document.querySelector('.art-date');
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
btnNext.addEventListener('click', function () {
  collectArtwork().catch((err) => {
    console.log('Error');
    console.log(err);
  });
  console.log('next image');
});

bodyDocument.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    collectArtwork().catch((err) => {
      console.log('Error');
      console.log(err);
    });
    console.log('next image');
  }
});

//GET RANDOM INDEX
function fetchRandomID(array) {
  const randomDecimal = Math.random();
  const randomIndex = Math.floor(randomDecimal * array.length);
  return randomIndex;
}

// // FETCH ARTWORK ID

async function fetchObjectsArray() {
  const res = await axios.get(
    'https://collectionapi.metmuseum.org/public/collection/v1/search',
    {
      params: {
        q: '',
        departmentId: 11,
        hasImages: 'true',
      },
    }
  );
  // console.log(res.data.objectIDs);
  return (returnedObjectsArray = await res.data.objectIDs);
}

async function fetchRandomID() {
  const objectsArray = await fetchObjectsArray();
  const randomDecimal = await Math.random();
  const randomIndex = await Math.floor(randomDecimal * objectsArray.length);
  return (objectID = await objectsArray[randomIndex]);
}

async function fetchArtworkData() {
  const artworkIndex = await fetchRandomID();
  const res = await axios.get(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkIndex}`
  );
  // console.log(await res.data);
  return (returnedArtworkData = await res.data);
}

async function collectArtwork() {
  const artworkData = await fetchArtworkData();
  artDisplay.innerHTML = `
  <img src="${artworkData.primaryImage}" alt="Artwork image" class="art-img" />`;
  artTitle.innerHTML = artworkData.title;
  artArtist.innerHTML = artworkData.artistDisplayName;
  artDate.innerHTML = artworkData.objectDate;
  console.log(artworkData.objectURL);
  console.log(artworkData.medium);
}

collectArtwork().catch((err) => {
  console.log('Error');
  console.log(err);
});
