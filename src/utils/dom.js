export default {
  createContainer(tagName = 'div') {
    const el = window.document.createElement(tagName)

    el.style.position = 'absolute'
    el.style.top = '0'
    el.style.left = '0'
    el.style.width = '100%'

    return el
  },
  getElement() {
    return window.document
  },
  getBody() {
    return this.getElement().body
  },
}
