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

  updatePixel(pixel){
    this.vals[pixel.y][pixel.x] = pixel.val

    const event = new Event('change')
    this.dispatchEvent(event)
  }

  stringValue(){
    return this.vals.map((line)=>{return line.join('')}).join("\n")
  }

  mousedown(e){
    this.hoverOrigin = e
    this.pixels[e.y][e.x].select()
    this.selectedPixels = [this.pixels[e.y][e.x]]
  }

  computeVal(prev, pixel, next){
    if(prev.x == pixel.x){
      if(next){
        if(next.x > pixel.x){
          if(prev.y < pixel.y){
            return "⌞"
          }
          else{
            return "⌜"
          }
        }
        else if(next.x < pixel.x){
          if(prev.y < pixel.y){
            return "⌟"
          }
          else{
            return "⌝"
          }
        }
      }
      return "|"
    } else{
      if(next){
        if(next.y > pixel.y){
          // going downward
          if(prev.x < pixel.x){
            return "⌝"
          }
          else{
            return "⌜"
          }
        }
        else if(next.y < pixel.y){
          // going upward
          if(prev.x < pixel.x){
            return "⌟"
          }
          else{
            return "⌞"
          }
        }
      }
      return "-"
    }
  }

  composeVal(prevVal, newVal){
    // if(prevVal == "" || prevVal == "." || prevVal == newVal){ return newVal}

    return newVal
  }

  mouseup(e){
    if(this.selectedPixels.length == 1){
      this.showSelector(this.pixels[e.y][e.x])
    }
    else{
      let prev = this.selectedPixels.splice(0,1)[0]
      let i = 0
      let newVal = this.computeVal(this.selectedPixels[0], prev, null)
      prev.val = this.composeVal(prev.val, newVal)
      prev.unselect()
      this.updatePixel(prev)
      for(let pixel of this.selectedPixels){
        console.log(pixel)
        pixel.val = this.computeVal(prev, pixel, this.selectedPixels[i+1])
        console.log(prev, pixel, this.selectedPixels[i+1], this.computeVal(prev, pixel, this.selectedPixels[i+1]))
        prev = pixel
        this.updatePixel(pixel)
        i ++
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
        const newVal = e.target.getAttribute("value")
        for(let p of this.selectedPixels){
          p.val = newVal
          p.text.innerHTML = newVal
          this.updatePixel(p)
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
    let p = this.pixels[e.y][e.x]
    if(this.selectedPixels[this.selectedPixels.length - 1] != p){
      this.selectedPixels.push(p)
      p.select()
    }
    // if(e.x == this.hoverOrigin.x){
    //   this.hoverDirection = "vertical"
    //   this.unselectPixels()
    //   let i = Math.min(e.y, this.hoverOrigin.y)
    //   const end = Math.max(e.y, this.hoverOrigin.y)
    //   while(i <= end){
    //     let p = this.pixels[i][e.x]
    //     this.selectedPixels.push(p)
    //     p.select()
    //     i ++
    //   }
    // }
    // else if(e.y == this.hoverOrigin.y){
    //   this.hoverDirection = "horizontal"
    //   this.unselectPixels()
    //   let i = Math.min(e.x, this.hoverOrigin.x)
    //   const end = Math.max(e.x, this.hoverOrigin.x)
    //   while(i <= end){
    //     let p = this.pixels[e.y][i]
    //     this.selectedPixels.push(p)
    //     p.select()
    //     i ++
    //   }
    // }
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
