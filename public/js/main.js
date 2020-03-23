const addRequest = document.querySelector('.add-request');
const newRequest = document.querySelector('.new-request');
const body = document.querySelector('body');

addRequest.addEventListener('click', () => {
  newRequest.classList.add('open');
});

newRequest.addEventListener('click', e => {
  if (e.target.classList.contains('new-request')) {
    newRequest.classList.remove('open');
  }
});
