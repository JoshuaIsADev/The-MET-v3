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

//GET RANDOM INDEX
function fetchRandomID(array) {
  const randomDecimal = Math.random();
  const randomIndex = Math.floor(randomDecimal * array.length);
  return randomIndex;
}

// // FETCH ARTWORK ID

// const fetchArtwork = (
//   url = 'https://collectionapi.metmuseum.org/public/collection/v1/search',
//   params = {}
// ) => {
//   return axios.get(url, {
//     params: (params = {
//       q: '',
//       departmentId: 11,
//       hasImages: 'true',
//     }),
//   });
// };

// async function fetchArtworkID() {
//   const res = await axios.get(
//     'https://collectionapi.metmuseum.org/public/collection/v1/search',
//     {
//       params: {
//         q: '',
//         departmentId: 11,
//         hasImages: 'true',
//       },
//     }
//   );
//   // console.log(res.data.objectIDs);
//   const returnedArray = await res.data.objectIDs;
//   const randomIndex = await fetchRandomID(returnedArray);
//   const returnedArtworkID = await `${returnedArray[`${randomIndex}`]}`;
//   // console.log(returnedArtworkID);
//   return showArtwork(returnedArtworkID);
// }

// async function showArtwork(returnedArtworkID) {
//   const artworkData = await axios.get(
//     `https://collectionapi.metmuseum.org/public/collection/v1/objects/${returnedArtworkID}`
//   );
//   // console.log(artworkData.data);
// }

// fetchArtworkID().catch((err) => {
//   console.log('Error');
// });

//NEW
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
  return (returnedArtworkData = await res.data);
}

async function showImage() {
  const artworkData = await fetchArtworkData();
  console.log(artworkData.primaryImage);
}

showImage().catch((err) => {
  console.log('Error');
});

async function artworkLoad() {
  await fetchObjectsArray();
  await fetchRandomID();
  await fetchArtworkData();
  // await showImage();
  // await showTitle();
  // await showArtist();
  // await showDate();
  // await showURL();
  // await showMedium();
}

//OLD

// axios
//   .get('https://collectionapi.metmuseum.org/public/collection/v1/search', {
//     params: {
//       q: '',
//       departmentId: 11,
//       hasImages: 'true',
//     },
//   })
//   .then((res) => {
//     const returnedArray = res.data.objectIDs;
//     const randomIndex = fetchRandomID(returnedArray);
//     const returnedArtwork = `${returnedArray[`${randomIndex}`]}`;
//     console.log(returnedArtwork);
//     // const fetchImage
//     return axios.get(
//       `https://collectionapi.metmuseum.org/public/collection/v1/objects/${returnedArtwork}`
//     );
//   })
//   .then((res) => {
//     const returnedImageURL = res.data.primaryImage;
//     const returnedTitle = res.data.title;
//     const returnedDate = res.data.objectDate;
//     const returnedArtist = res.data.artistDisplayName;
//     const returnedURL = res.data.objectURL;
//     const returnedMedium = res.data.medium;
//     console.log(res.data);
//   })
//   .catch((err) => {
//     console.log('ERROR', err);
//   });
