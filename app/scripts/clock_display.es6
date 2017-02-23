'use strict';

import ClockDigit from './clock_digit'

class ClockDisplay extends HTMLElement {
  get digitsCount(){
    let s = this.getAttribute('digits');
    return s ? JSON.parse(s) : 6;
  }

  get rows(){
    let s = this.getAttribute('rows');
    return s ? parseInt(s) : 8;
  }

  get cols(){
    let s = this.getAttribute('cols');
    return s ? parseInt(s) : 8;
  }

  get customText(){
    let s = this.getAttribute('custom-text');
    return s != undefined && s.length > 0 ? s : null;
  }

  get lowProfile(){
    return this.hasAttribute('low-profile');
  }

  get pixels(){
    let s = this.getAttribute('pixels');
    return s ? s : "custom-clock";
  }

  get large(){
   return this.cols * this.rows *  this.digitsCount > 6*5*6
  }

  displayMatrix(index, matrix){
    if(!this.customMatrix){ this.customMatrix = {}}
    this.customMatrix[index] = matrix
    if(this.locked){ return }
    this.digits[index].displayMatrix(matrix)
  }

  digitsVals() {
    if(this.customMatrix){
      let out = []
      for(let i in this.customMatrix){
        out.push(this.customMatrix[i])
      }
      return out
    }
    if(this.customText){
      return this.customText.split("")
    }
    const date = new Date()
    const h = date.getHours()
    const hh = parseInt(h/10)
    const m = date.getMinutes()
    const mm = parseInt(m/10)
    const s = date.getSeconds()
    const ss = parseInt(s/10)
    return [hh, h - hh*10, mm, m - mm*10, ss, s - ss*10].map((d)=>{ return `${d}` })
  }

  loopIteration(){
    this.scheduler = null
    if(this.locked){ return }
    if(!this.offset){ this.offset = 0 }
    if(this.customMatrix){ this.showCustomMatrix(); return}
    if(this.customText){ this.showCustomText(); return}
    this.showTime()
  }

  incrementOffset() {
    let len = 0
    if(this.customText){ len = this.customText.length }
    if(this.customMatrix){ len = this.customMatrix.length }
    if(len > this.digitsCount){
      this.offset += 1
      this.offset = this.offset % len
    } else {
      this.offset = 0
    }
  }

  scheduleNextIteration(duration=100) {
    if(this.scheduler){
      return
    }
    this.scheduler = setTimeout(()=>{
      this.loopIteration()
    }, duration)
  }

  showCustomMatrix() {
    for(let i in this.customMatrix){
      this.digits[i].displayMatrix(this.customMatrix[(i + this.offset) % this.customMatrix.length])
    }
    this.incrementOffset()
    this.scheduleNextIteration()
  }

  showCustomText(){
    let i = 0
    const text = this.customText
    for(let digit of this.digits){
      digit.show(text[(i  + this.offset) % text.length])
      i += 1
    }
    this.incrementOffset()
    this.scheduleNextIteration()
  }

  showTime() {
    let i = 0
    let val = this.digitsVals()
    for(let digit of this.digits){
      digit.show(val[i])
      i += 1
    }
    this.scheduleNextIteration()
  }

  lock() {
    for(let digit of this.digits){
      digit.lock()
    }
  }

  attachedCallback() {
    this.digits = []
    let i = 0
    let digit
    const shadow = this.createShadowRoot()
    const style = document.createElement("style")
    style.innerHTML = '@import "styles/clock.css";'

    if(this.large){
      this.classList.add('large')
    }

    shadow.appendChild(style)
    while(i < this.digitsCount){
      digit = document.createElement("clock-digit")
      digit.setAttribute("rows", this.rows)
      digit.setAttribute("cols", this.cols)
      digit.setAttribute("pixels", this.pixels)
      digit.setAttribute("low-profile", this.lowProfile)
      if(this.large){
        digit.classList.add('large')
      }
      shadow.appendChild(digit)
      this.digits.push(digit)
      i += 1
    }

    this.locked = false
    this.loopIteration()

    this.addEventListener('mousedown', ()=>{
      this.locked = true
      this.lock()
    })

    this.addEventListener('mouseup', ()=>{
      let p = Promise.resolve()
      let i = 0
      let val = this.digitsVals()
      this.digits.forEach((digit, i)=>{
        p = p.then(()=>{
          return digit.animate(val[i])
        })
      })

      p.then(()=>{
        this.locked = false
        this.scheduleNextIteration()
      })
    })
  }
}

document.registerElement('clock-display', ClockDisplay)

export default ClockDisplay
