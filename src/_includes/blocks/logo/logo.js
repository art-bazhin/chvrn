(function() {
  const LOOP_TIME = 300;

  const logo = document.getElementById('logo');
  const shifted = document.getElementById('logo-img-shifted');
  const shiftedAlt = document.getElementById('logo-img-shifted-alt');

  let counter = 0;
  let counterAlt = 0;

  const opacityCache = {};
  let iteration = 0;

  function getOpacity() {
    let value = opacityCache[iteration];

    if (!value) {
      value = 0.8 + Math.random() / 4;
      opacityCache[iteration] = value;
    }

    iteration++;
    iteration %= LOOP_TIME;

    return value;
  }

  function runFrame() {
    requestAnimationFrame(() => {
      logo.setAttribute('style', `opacity: ${getOpacity()}`);

      counter++;
      counter %= 250;

      if (counter > 240) shifted.setAttribute('style', 'visibility: visible');
      else shifted.setAttribute('style', 'visibility: hidden');

      counterAlt++;
      counterAlt %= 375;

      if (counterAlt > 368) shiftedAlt.setAttribute('style', 'visibility: visible');
      else shiftedAlt.setAttribute('style', 'visibility: hidden');

      runFrame();
    });
  }

  runFrame();
})();