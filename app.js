const btnMin = document.querySelector('.btn-minimize');
const artDisplay = document.querySelector('.art-display');
const bodyDocument = document.body;

btnMin.addEventListener('click', function () {
  artDisplay.classList.toggle('min');
  btnMin.classList.toggle('rotate180');
  bodyDocument.classList.toggle('overflow');
});

//minimize image

// bodyDocument.style.overflowY = 'auto';
