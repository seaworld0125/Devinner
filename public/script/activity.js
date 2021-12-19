// guide function
const guideMent = document.getElementById('guide');
const guideBubble = document.getElementById('guide-bubble');

guideMent.addEventListener('mouseover' || 'focus', (e) => {
  guideBubble.style.display = 'block';
});
guideMent.addEventListener('mouseout' || 'blur', (e) => {
  guideBubble.style.display = 'none';
});

guideBubble.addEventListener('mouseover' || 'focus', (e) => {
  guideBubble.style.display = 'block';
});
guideBubble.addEventListener('mouseout' || 'blur', (e) => {
  guideBubble.style.display = 'none';
});