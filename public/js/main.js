const addRequest = document.querySelector('.add-request');
const newRequest = document.querySelector('.new-request');
const body = document.querySelector('body');

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

// CALL sayHello callable function
const button = document.querySelector('.call');
button.addEventListener('click', () => {
  const sayHello = firebase.functions().httpsCallable('sayHello');
  sayHello({ name: 'Shaun' }).then(result => console.log(result.data));
});
