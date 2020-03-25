const addRequest = document.querySelector('.add-request');
const newRequest = document.querySelector('.new-request');
const requestForm = document.querySelector('.new-request form');

// OPEN MODAL
addRequest.addEventListener('click', () => {
  newRequest.classList.add('open');
});

// CLOSE MODAL
newRequest.addEventListener('click', e => {
  if (e.target.classList.contains('new-request')) {
    newRequest.classList.remove('open');
  }
});

// ADD REQUEST
requestForm.addEventListener('submit', e => {
  e.preventDefault();

  const addRequest = firebase.functions().httpsCallable('addRequest');
  addRequest({
    text: requestForm.request.value
  })
    .then(() => {
      requestForm.reset();
      newRequest.classList.remove('open');
      requestForm.querySelector('.error').textContent = '';
    })
    .catch(error => {
      requestForm.querySelector('.error').textContent = error.message;
    });
});
