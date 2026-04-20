document.getElementById('year').textContent = new Date().getFullYear();

document.querySelector('.nav__toggle').addEventListener('click', () => {
  document.querySelector('.nav__links').classList.toggle('open');
});

document.querySelectorAll('.nav__links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav__links').classList.remove('open');
  });
});

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const feedback = document.getElementById('formFeedback');
  feedback.textContent = 'Thanks! Your message was received.';
  feedback.hidden = false;
  e.target.reset();
  setTimeout(() => { feedback.hidden = true; }, 4000);
});
