const btnNext = document.querySelector('.btn-next');
const btnMin = document.querySelector('.btn-minimize');
const btnInfo = document.querySelector('.btn-info');
const artInfo = document.querySelector('#art-info');
const artDisplay = document.querySelector('.art-display');
const artArtist = document.querySelector('.art-artist');
const artTitle = document.querySelector('.art-title');
const artDate = document.querySelector('.art-date');
const artImg = document.querySelector('.art-img');
const bodyDocument = document.body;
const documentSize = [document.body.clientWidth, document.body.clientHeight];
const usedIndices = [];

//////SHOW LOADING SPINNER//////
const renderSpinner = function (parentEl) {
  const markup = `
    <div class="loading">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" class="spinner">
    <circle cx="1.5" cy="1.5" r="1.5" fill="#D9D9D9"/>
    <circle cx="28.5" cy="28.5" r="1.5" fill="#D9D9D9"/>
    </svg>
    </div>`;
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

//////REMOVE LOADING SPINNER//////
function removeSpinner() {
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach((element) => {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
}

//////FADE-OUT IN//////
function fadeIn() {
  removeHideInfo();
  fadeOut();
  removeSpinner();
  artDisplay.classList.add('fade-in');
  setTimeout(() => {
    artTitle.classList.add('fade-in');
  }, 700);
  setTimeout(() => {
    artDate.classList.add('fade-in');
  }, 1200);
  setTimeout(() => {
    artArtist.classList.add('fade-in');
  }, 1500);
}

function fadeOut() {
  const elementsToRemoveFade = [artTitle, artDate, artArtist, artDisplay];
  elementsToRemoveFade.forEach((element) =>
    element.classList.remove('fade-in')
  );
}

//////TOGGLE ARTWORK INFO//////
function toggleHideInfo() {
  const elementsTotoggleHideInfo = [artTitle, artDate, artArtist];
  elementsTotoggleHideInfo.forEach((element) =>
    element.classList.toggle('hide')
  );
}

//////REMOVE HIDE//////
function removeHideInfo() {
  const elementsToremoveHideInfo = [artTitle, artDate, artArtist];
  elementsToremoveHideInfo.forEach((element) =>
    element.classList.remove('hide')
  );
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
// function setDivHeight() {
//   let artArtistDivHeight = document.querySelector(
//     '.art-artist-container'
//   ).clientHeight;
//   let artTitleDivHeight = document.querySelector(
//     '.art-title-container'
//   ).clientHeight;
//   let artInfoDivHeight = artArtistDivHeight + artTitleDivHeight + 170;
//   let currentTop = parseInt(window.getComputedStyle(artDisplay).top);

//   if (currentTop <= 0) {
//     artDisplay.style.top = `${artInfoDivHeight}px`;
//   } else {
//     artDisplay.style.top = '';
//   }
// }

function scaleImage() {
  artDisplay.classList.toggle('art-display-min');
  artInfo.classList.toggle('art-info-min');
  btnMin.classList.toggle('btn-expand');
  bodyDocument.classList.toggle('overflow');
  // artImg.classList.toggle('art-img-min');
  // setDivHeight();
  removeHideInfo();
}

//////SCALE ARTWORK EVENT LISTENER//////
btnMin.addEventListener('click', function () {
  scaleImage();
});

bodyDocument.addEventListener('keydown', function (e) {
  if (e.key === ' ') {
    scaleImage();
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
  fadeOut();
});

//////HIDE INFO EVENT LISTENER//////
btnInfo.addEventListener('click', function () {
  toggleHideInfo();
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

//////FETCH ARTWORK DIMENSIONS//////
function artworkDimension(artworkResolution) {
  let img = new Image();
  img.src = artworkResolution;

  // img.onload = function () {
  //   let height = img.height;
  //   let width = img.width;
  //   const windowRatio = window.innerHeight / window.innerWidth;
  //   const artworkRatio = height / width;
  //   if (windowRatio < artworkRatio) {
  //     console.log('portrait');
  //     return 'art-display-vertical';
  //   } else {
  //     console.log('landscape');
  //     return 'art-display';
  //   }
  // };
}

//////SHOW ARTWORK ON DOM//////
async function collectArtwork() {
  renderSpinner(bodyDocument);
  const artworkData = await fetchArtworkData();
  const artworkResolution =
    documentSize[0] <= 450 || documentSize[1] <= 450
      ? artworkData.primaryImageSmall
      : artworkData.primaryImage;
  // const deviceOrientation =
  //   window.innerWidth < window.innerHeight ? 'art-img-min' : 'art-img';
  const imageLoadPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = artworkResolution;
    img.onload = resolve;
    img.onerror = reject;
  });
  await imageLoadPromise;
  artDisplay.innerHTML = `
  <img src="${artworkResolution}" alt="Artwork image" class="art-img" loading="lazy"/>`;
  removeSpinner();
  artTitle.innerHTML = artworkData.title;
  artArtist.innerHTML = artworkData.artistDisplayName;
  artDate.innerHTML = artworkData.objectDate;
  fadeIn();
  // artworkDimension(artworkResolution);
}

collectArtwork().catch((err) => {
  console.log('Error');
  console.log(err);
});
