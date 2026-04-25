function openLightbox(index) {
  current = index;
  document.getElementById('lightbox-img').src = images[current];
  document.getElementById('lightbox-counter').textContent = (current + 1) + ' / ' + images.length;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function stepLightbox(dir) {
  current = (current + dir + images.length) % images.length;
  document.getElementById('lightbox-img').src = images[current];
  document.getElementById('lightbox-counter').textContent = (current + 1) + ' / ' + images.length;
}
function handleLightboxClick(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}
document.addEventListener('keydown', function(e) {
  const lb = document.getElementById('lightbox');
  if (!lb || !lb.classList.contains('open')) return;
  if (e.key === 'ArrowRight') stepLightbox(1);
  if (e.key === 'ArrowLeft') stepLightbox(-1);
  if (e.key === 'Escape') closeLightbox();
});
