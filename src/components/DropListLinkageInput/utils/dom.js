function animateHandle(ev) {
  const { target: el } = ev

  el.classList.add('display-none')

  el.removeEventListener('animationend', animateHandle)
}

function animate({ el, visible }) {
  if (!(el instanceof HTMLElement)) {
    console.error(`Invalid props "el", expected HTMLElement.`)
    return
  }

  if (visible) {
    el.classList.remove('display-none')
    el.classList.add('animate-open')
  } else {
    el.removeEventListener('animationend', animateHandle)
    el.addEventListener('animationend', animateHandle)
  }
}

export default {
  animate,
}
