
function easeInOutQuad(t, b, c, d)  {
  t /= d / 2
  if(t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

function opts(options) {
  return {
    parent  : options.parent || window,
    distance: options.distance || 0,
    duration: options.duration || 400,
    offset  : options.offset || 0,
    callback: options.callback,
    easing  : options.easing || easeInOutQuad,
  };
}

function animateScrollLeft(options) {

  let cancel = false;
  let hasEnded = false;

  const opt = opts(options);

  const start = ( opt.parent === window ? opt.parent.pageXOffset : opt.parent.scrollLeft ) || 0;
  const duration = typeof opt.duration === 'function'
    ? opt.duration(opt.distance)
    : opt.duration;
  let timeStart, timeElapsed;

  const end = _ => {
    if ( hasEnded ) return;
    hasEnded = true;
    const x = start + opt.distance;
    if ( opt.parent === window ) {
      opt.parent.scrollTo(x, 0);
    } else {
      opt.parent.scrollLeft = x;
    }
    typeof opt.callback === 'function' && opt.callback();
  }

  const cancellable = _ => {
    cancel = true;
    if ( !hasEnded ) {
      hasEnded = true;
      typeof opt.callback === 'function' && opt.callback();
    }
  }

  const loop = time => {
    if ( cancel ) return;
    timeElapsed = time - timeStart;
    const x = opt.easing(timeElapsed, start, opt.distance, duration)
    if ( opt.parent === window ) {
      opt.parent.scrollTo(x, 0);
    } else {
      opt.parent.scrollLeft = x;
    }

    if ( timeElapsed < duration ) {
      requestAnimationFrame(loop);
    } else {
      end();
    }
  }

  requestAnimationFrame(time => {
    timeStart = time;
    loop(time);
  });

  return cancellable;
}

export function scrollLeft(options) {
  return animateScrollLeft(options);
}

export function scrollToLeft(parent, pos, options) {
  const start = ( parent === window ? parent.pageXOffset : parent.scrollLeft ) || 0;
  const distance = pos - start;
  return animateScrollLeft({
    ...options,
    parent,
    distance,
  });
}

