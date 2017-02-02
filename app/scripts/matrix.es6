import Pixel from './pixel'

class Matrix extends HTMLElement {
   get allowedValues() {
    return [".", "|", "-", "⌜", "⌝", "⌞", "⌟", '⊣', "⊢", "⊤", "⊥"]
  }

  get rows(){
    let s = this.getAttribute('rows');
    return s ? parseInt(s) : 8;
  }

  get cols(){
    let s = this.getAttribute('cols');
    return s ? parseInt(s) : 8;
  }

  updatePixel(data){
    console.log('updatePixel', data)

    this.vals[data.y][data.x] = data.val
    console.log(this.vals)

    const event = new Event('change')
    this.dispatchEvent(event)
  }

  stringValue(){
    return this.vals.map((line)=>{return line.join('')}).join("\n")
  }

  mousedown(e){
    console.log("mousedown", e)
    this.hoverOrigin = e
    this.pixels[e.y][e.x].select()
    this.selectedPixels = [this.pixels[e.y][e.x]]
  }

  mouseup(e){
    console.log("mouseup", e)
    if(e.x == this.hoverOrigin.x && e.y == this.hoverOrigin.y){
      this.showSelector(this.pixels[e.y][e.x])
    }
    else{
      let newVal
      if(this.hoverDirection == "vertical"){
        newVal = "|"
      }
      else if(this.hoverDirection == "horizontal"){
        newVal = "-"
      }

      if(newVal){
        for(let p of this.selectedPixels){
          p.val = newVal
          p.text.innerHTML = newVal
          this.updatePixel({x: p.x, y: p.y, val: newVal})
        }
      }
      this.unselectPixels()
    }
    this.hoverDirection = null
    this.hoverOrigin = null
  }

  showSelector(pixel) {
    this.selector = document.createElement('div')
    this.selector.classList.add('selector')
    const placeholder = document.createElement('div')
    placeholder.innerHTML = pixel.val
    placeholder.addEventListener('click', (e)=>{
      pixel.removeChild(this.selector)
      this.selector = null
      this.unselectPixels()
      return false
    })
    this.selector.appendChild(placeholder)
    for(let val of this.allowedValues){
      let valInput = document.createElement('div')
      valInput.setAttribute('value', val)
      valInput.innerHTML = val
      this.selector.appendChild(valInput)
      valInput.addEventListener('click', (e)=>{
        e.stopImmediatePropagation()
        console.log('Here', e)
        const newVal = e.target.getAttribute("value")
        for(let p of this.selectedPixels){
          p.val = newVal
          p.text.innerHTML = newVal
          this.updatePixel({x: p.x, y: p.y, val: newVal})
        }
        pixel.removeChild(this.selector)
        this.selector = null
        this.unselectPixels()
        return false
      })
    }
    pixel.appendChild(this.selector)
  }

  mouseover(e){
    if(!this.hoverOrigin){ return }
    if(!this.selectedPixels){ this.selectedPixels = [] }
    console.log("mouseover", e)
    if(e.x == this.hoverOrigin.x){
      this.hoverDirection = "vertical"
      this.unselectPixels()
      let i = Math.min(e.y, this.hoverOrigin.y)
      const end = Math.max(e.y, this.hoverOrigin.y)
      while(i <= end){
        let p = this.pixels[i][e.x]
        this.selectedPixels.push(p)
        p.select()
        i ++
      }
    }
    else if(e.y == this.hoverOrigin.y){
      this.hoverDirection = "horizontal"
      this.unselectPixels()
      let i = Math.min(e.x, this.hoverOrigin.x)
      const end = Math.max(e.x, this.hoverOrigin.x)
      while(i <= end){
        let p = this.pixels[e.y][i]
        this.selectedPixels.push(p)
        p.select()
        i ++
      }
    }
  }

  unselectPixels() {
    for(let p of this.selectedPixels){ p.unselect() }
    this.selectedPixels = []
  }

  attachedCallback() {
    let i = 0
    let j = 0
    this.pixels = []
    this.vals = []
    while(i < this.rows){
      let row = document.createElement('div')
      row.classList.add('pixels-row')
      if(!this.pixels[i]){ this.pixels[i] = [] }
      if(!this.vals[i]){ this.vals[i] = [] }
      while(j < this.cols){
        var pixel = document.createElement("matrix-pixel")
        pixel.setAttribute("x", j)
        pixel.setAttribute("y", i)
        pixel.matrix = this
        row.appendChild(pixel)
        this.pixels[i][j] = pixel
        this.vals[i][j] = this.allowedValues[0]
        j += 1
      }
      this.appendChild(row)
      j = 0
      i += 1
    }
  }
}

document.registerElement('custom-matrix', Matrix)

export default Clock
