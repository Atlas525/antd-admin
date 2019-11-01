import styles from './DropListLinkage.less'

export default {
  animationCb(ev) {
    ev.preventDefault()

    const { target } = ev

    if (target.dataset.tag !== 'animate-tag') {
      return // 屏蔽冒泡
    }
    if (!target.visible) {
      target.classList.add(styles.displayNone)
    }
  },
  handleAnimate(el, visible) {
    if (!el) {
      return
    }
    el.visible = visible
    if (visible) {
      el.classList.remove(styles.displayNone)
      el.classList.remove(styles.animateClose)
      el.classList.add(styles.animateOpen)
    } else {
      el.classList.remove(styles.animateOpen)
      el.classList.add(styles.animateClose)
    }

    el.removeEventListener('animationend', this.animationCb)
    el.addEventListener('animationend', this.animationCb)
  },
}
