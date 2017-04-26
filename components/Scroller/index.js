
function easeInOutQuad(t, b, c, d)  {
  t /= d / 2
  if(t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

function animateScrollLeft(options) {

  let element;

  let start;            // where scroll starts                    (px)
  let stop;             // where scroll stops                     (px)
  let offset;           // adjustment from the stop position      (px)
  let distance;         // distance of scroll                     (px)

  let easing;           // easing function                        (function)
  let duration;         // scroll duration                        (ms)

  let timeStart;        // time scroll started                    (ms)
  let timeElapsed;      // time spent scrolling thus far          (ms)

  let next;             // next scroll position                   (px)
  let callback;         // to call when done scrolling            (function)

  let autoCancel;

  let requestID;
  let cancelled;

  const requestAnimationFrame = (_ => {
    return window.requestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.mozRequestAnimationFrame
      || ( callback => window.setTimeout(callback, 1000 / 60) );
  })();

  const cancelAnimationFrame = (_ => {
    return window.cancelAnimationFrame
      || window.webkitCancelAnimationFrame
      || window.mozRequestAnimationFrame
      || ( id => window.clearTimeout(id) );
  })();

  function location() {
    const x = element === window
      ? ( window.scrollX || window.pageXOffset )
      : ( element.scrollLeft )
    return x || 0;
  }

  function scrollTo(x) {
    element === window
      ? element.scrollTo(x, 0)
      : ( element.scrollLeft = x );
  }

  function isCancelled() {
    return !!cancelled;
  }

  function loop(timeCurrent) {
    // store time scroll started, if not started already
    if ( !timeStart ) {
      timeStart = timeCurrent;
    }
    // determine time spent scrolling so far
    timeElapsed = timeCurrent - timeStart;
    // calculate next scroll position
    next = easing(timeElapsed, start, distance, duration);
    if ( isCancelled() ) return;
    // scroll to it
    scrollTo(next);
    // check progress
    if ( timeElapsed < duration ) {
      // continue scroll loop
      requestID = requestAnimationFrame(loop);
    } else {
      // scrolling is done
      done();
    }
  }

  function done() {
    // account for rAF time rounding inaccuracies
    scrollTo(start + distance);
    // if it exists, fire the callback
    if ( typeof callback === 'function' ) {
      callback();
    }
    // reset time for next jump
    timeStart = false;
    post();
  }

  function cancel() {
    if ( isCancelled() ) return;
    timeStart = false;
    cancelled = true;
    cancelAnimationFrame(requestID);
    post();
  }

  function post() {
    removeEventListener();
    // if it exists, fire the callback
    if ( typeof callback === 'function' ) {
      callback();
    }
  }

  function addEventListener() {
    if ( !autoCancel ) return;
    window.addEventListener('wheel', cancel, false);
    window.addEventListener('touchstart', cancel, false);
  }

  function removeEventListener() {
    if ( !autoCancel ) return;
    window.removeEventListener('wheel', cancel, false);
    window.removeEventListener('touchstart', cancel, false);
  }

  function scroll(next) {

    element     = options.element  || window;
    distance    = options.distance || 0;
    duration    = options.duration || 500;
    offset      = options.offset   || 0;
    easing      = options.easing   || easeInOutQuad;
    callback    = options.after || ( _ => { } );
    autoCancel  = typeof options.autoCancel === 'boolean'
      ? options.autoCancel
      : true;

    if ( distance === 0 ) return;
    if ( typeof options.before === 'function' ) options.before();

    start       = location();
    stop        = start + distance + offset;

    addEventListener();
    requestID = requestAnimationFrame(loop);
  }

  return {
    scroll,
    cancel,
    isCancelled,
  };
}

export function scrollLeft(options) {
  return animateScrollLeft(options);
}

export function scrollToLeft(element, pos, options) {
  const start = ( element === window ? element.pageXOffset : element.scrollLeft ) || 0;
  const distance = pos - start;
  return new animateScrollLeft({
    ...options,
    element,
    distance,
  });
}

