const btnMin = document.querySelector('.btn-minimize');
const btnNext = document.querySelector('.btn-next');
const artInfo = document.querySelector('#art-info');
const artDisplay = document.querySelector('.art-display');
const artArtist = document.querySelector('.art-artist');
const artTitle = document.querySelector('.art-title');
const artDate = document.querySelector('.art-date');
const bodyDocument = document.body;
const documentSize = [document.body.clientWidth, document.body.clientHeight];
const usedIndices = [];

//////FADE-OUT IN//////
function fadeOut() {
  artTitle.classList.remove('fade-in');
  artDate.classList.remove('fade-in');
  artArtist.classList.remove('fade-in');
  artDisplay.classList.remove('fade-in');
}

function fadeIn() {
  artDisplay.classList.add('fade-in');
  setTimeout(() => {
    artTitle.classList.add('fade-in');
  }, 500);
  setTimeout(() => {
    artDate.classList.add('fade-in');
  }, 800);
  setTimeout(() => {
    artArtist.classList.add('fade-in');
  }, 1100);
}

//////MOVE ARTWORK INFO UP//////
function moveArtInfo() {
  let currentPosition = window.getComputedStyle(artInfo).justifyContent;
  console.log(currentPosition);

  if (currentPosition === 'center') {
    artInfo.style.justifyContent = 'flex-start';
    artInfo.style.paddingTop = '10rem';
  } else {
    artInfo.style.justifyContent = 'center';
  }
}

//////SCALE ARTWORK//////
function setDivHeight() {
  let artArtistDivHeight = document.querySelector(
    '.art-artist-container'
  ).clientHeight;
  let artTitleDivHeight = document.querySelector(
    '.art-title-container'
  ).clientHeight;
  let artInfoDivHeight = artArtistDivHeight + artTitleDivHeight + 170;
  let currentTop = parseInt(window.getComputedStyle(artDisplay).top);

  if (currentTop <= 0) {
    artDisplay.style.top = `${artInfoDivHeight}px`;
  } else {
    artDisplay.style.top = '';
  }
}

function scaleImage() {
  artDisplay.classList.toggle('art-display-min');
  btnMin.classList.toggle('btn-expand');
  bodyDocument.classList.toggle('overflow');
  setDivHeight();
}

//////SCALE ARTWORK EVENT LISTENER//////
btnMin.addEventListener('click', function () {
  scaleImage();
  moveArtInfo();
});

bodyDocument.addEventListener('keydown', function (e) {
  if (e.key === ' ') {
    scaleImage();
    moveArtInfo();
  }
});

//////NEXT ARTWORK EVENT LISTENER//////
btnNext.addEventListener('click', function () {
  collectArtwork().catch((err) => {
    console.log('Error');
    console.log(err);
  });
  fadeOut();
});

bodyDocument.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    collectArtwork().catch((err) => {
      console.log('Error');
      console.log(err);
    });
  }
});

//////FETCH ARTWORK ID//////
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

//////GET RANDOM INDEX//////
async function fetchRandomID() {
  // const objectsArray = await fetchObjectsArray();
  // const randomDecimal = await Math.random();
  // const randomIndex = await Math.floor(randomDecimal * objectsArray.length);
  // return (objectID = await objectsArray[randomIndex]);
  const objectsArray = await fetchObjectsArray();

  if (usedIndices.length === objectsArray.length) {
    usedIndices.length = 0;
  }

  let randomIndex;
  do {
    const randomDecimal = Math.random();
    randomIndex = Math.floor(randomDecimal * objectsArray.length);
  } while (usedIndices.includes(randomIndex));

  usedIndices.push(randomIndex);
  const objectID = objectsArray[randomIndex];
  return objectID;
}

//////FETCH ARTWORK DATA//////
async function fetchArtworkData() {
  const artworkIndex = await fetchRandomID();
  const res = await axios.get(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${artworkIndex}`
  );
  // console.log(await res.data);
  return (returnedArtworkData = await res.data);
}

//////SHOW ARTWORK ON DOM//////
async function collectArtwork() {
  const artworkData = await fetchArtworkData();
  const deviceSize =
    documentSize[0] <= 450 || documentSize[1] <= 450
      ? artworkData.primaryImageSmall
      : artworkData.primaryImage;
  const imageLoadPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = deviceSize;
    img.onload = resolve;
    img.onerror = reject;
  });
  await imageLoadPromise;
  console.log('Image loaded:', deviceSize);

  artDisplay.innerHTML = `
  <img src="${deviceSize}" alt="Artwork image" class="art-img" loading="lazy"/>`;
  artTitle.innerHTML = artworkData.title;
  artArtist.innerHTML = artworkData.artistDisplayName;
  artDate.innerHTML = artworkData.objectDate;
  fadeIn();
}

collectArtwork().catch((err) => {
  console.log('Error');
  console.log(err);
});
