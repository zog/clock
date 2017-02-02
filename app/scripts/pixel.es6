class Pixel extends HTMLElement {

  get vals() {
    return this.matrix.allowedValues
  }

  get x() {
    return parseInt(this.getAttribute('x'))
  }

  get y() {
    return parseInt(this.getAttribute('y'))
  }

  select() {
    this.classList.add('selected')
  }

  unselect() {
    this.classList.remove('selected')
  }

  createdCallback() {
    this.text = document.createElement('div')
    this.text.classList.add('text')
    this.appendChild(this.text)
  }

  attachedCallback() {
    this.val = this.vals[0]
    this.valIndex = 0
    this.text.innerHTML = this.val
    this.addEventListener('mousedown', (e)=>{
      if(this.matrix.selector){ return }
      e.preventDefault()
      this.matrix.mousedown({x: this.x, y: this.y})
      return false
    })

    this.addEventListener('mouseup', (e)=>{
      if(this.matrix.selector){ return }
      e.preventDefault()
      this.matrix.mouseup({x: this.x, y: this.y})
      return false
    })

    this.addEventListener('mouseover', (e)=>{
      if(this.matrix.selector){ return }
      e.preventDefault()
      this.matrix.mouseover({x: this.x, y: this.y})
      return false
    })
    // this.addEventListener('click', ()=>{
    //   if(this.selector){return}
    //   this.showSelector()
    // })
  }
}

document.registerElement('matrix-pixel', Pixel)

export default Pixel
