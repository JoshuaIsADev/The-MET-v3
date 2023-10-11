const btnNext = document.querySelector('.btn-next');
const btnMin = document.querySelector('.btn-minimize');
const btnInfo = document.querySelector('.btn-info');
const artInfo = document.querySelector('#art-info');
const artDisplay = document.querySelector('.art-display');
const artArtist = document.querySelector('.art-artist');
const artTitle = document.querySelector('.art-title');
const artDate = document.querySelector('.art-date');
const bodyDocument = document.body;
const documentSize = [document.body.clientWidth, document.body.clientHeight];
const usedIndices = [];

//////SHOW LOADING SPINNER//////
const renderSpinner = function (parentEl) {
  const markup = `
    <div class="loading">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 58 58" fill="none" class="spinner">
        <line y1="28.5" x2="20" y2="28.5" stroke="#E7DEC1"/>
        <line x1="38" y1="28.5" x2="58" y2="28.5" stroke="#E7DEC1"/>
        <line x1="29.5" y1="2.18557e-08" x2="29.5" y2="20" stroke="#E7DEC1"/>
        <line x1="29.5" y1="38" x2="29.5" y2="58" stroke="#E7DEC1"/>
        <line x1="8.84769" y1="8.14059" x2="22.9898" y2="22.2827" stroke="#E7DEC1"/>
        <line x1="35.7168" y1="35.0107" x2="49.859" y2="49.1528" stroke="#E7DEC1"/>
        <line x1="49.8594" y1="8.84769" x2="35.7173" y2="22.9898" stroke="#E7DEC1"/>
        <line x1="22.9903" y1="35.7178" x2="8.84814" y2="49.8599" stroke="#E7DEC1"/>
      </svg>
    </div>`;
  parentEl.insertAdjacentHTML('afterbegin', markup);
};

//////REMOVE LOADING SPINNER//////
function removeSpinner() {
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach((element) => {
    console.log('remove element', element);
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
}

//////FADE-OUT IN//////
function fadeIn() {
  removeHide();
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
  artTitle.classList.remove('fade-in');
  artDate.classList.remove('fade-in');
  artArtist.classList.remove('fade-in');
  artDisplay.classList.remove('fade-in');
}

//////TOGGLE ARTWORK INFO//////
function toggleInfo() {
  artTitle.classList.toggle('hide');
  artDate.classList.toggle('hide');
  artArtist.classList.toggle('hide');
}

//////REMOVE HIDE//////
function removeHide() {
  artTitle.classList.remove('hide');
  artDate.classList.remove('hide');
  artArtist.classList.remove('hide');
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
  btnMin.classList.toggle('btn-expand');
  bodyDocument.classList.toggle('overflow');
  // setDivHeight();
  removeHide();
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
  toggleInfo();
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

//////SHOW ARTWORK ON DOM//////
async function collectArtwork() {
  renderSpinner(bodyDocument);
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
  removeSpinner();
  artTitle.innerHTML = artworkData.title;
  artArtist.innerHTML = artworkData.artistDisplayName;
  artDate.innerHTML = artworkData.objectDate;
  fadeIn();
}

collectArtwork().catch((err) => {
  console.log('Error');
  console.log(err);
});
