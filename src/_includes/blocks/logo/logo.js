(function() {
  const logo = document.getElementById('logo');
  const shifted = document.getElementById('logo-img-shifted');
  const shiftedAlt = document.getElementById('logo-img-shifted-alt');

  let counter = 0;
  let counterAlt = 0;

  function getOpacity() {
    return 0.8 + Math.random() / 4;
  }

  function runFrame() {
    requestAnimationFrame(() => {
      logo.setAttribute('style', `opacity: ${getOpacity()}`);

      counter++;
      counter %= 250;

      if (counter > 240) shifted.setAttribute('style', 'opacity: 1');
      else shifted.setAttribute('style', 'opacity: 0');

      counterAlt++;
      counterAlt %= 375;

      if (counterAlt > 368) shiftedAlt.setAttribute('style', 'opacity: 1');
      else shiftedAlt.setAttribute('style', 'opacity: 0');

      runFrame();
    });
  }

  runFrame();
})();