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

  get pixels(){
    let s = this.getAttribute('pixels');
    return s ? s : "custom-clock";
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
    return [hh, h - hh*10, mm, m - mm*10, ss, s - ss*10]
  }

  loopIteration(){
    if(this.customMatrix){
      for(let i in this.customMatrix){
        this.digits[i].displayMatrix(this.customMatrix[i])
      }
      return
    }
    if(this.customText){ this.showCustomText(); return}
    if(this.locked){ return}
    this.showTime()
  }

  showCustomText(){
    let i = 0
    const text = this.customText
    for(let digit of this.digits){
      digit.show(text[i])
      i += 1
    }
    setTimeout(()=>{
      this.loopIteration()
    }, 100)
  }

  showTime() {
    let i = 0
    let val = this.digitsVals()
    for(let digit of this.digits){
      digit.show(val[i])
      i += 1
    }
    setTimeout(()=>{
      this.loopIteration()
    }, 100)
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

    shadow.appendChild(style)
    while(i < this.digitsCount){
      digit = document.createElement("clock-digit")
      digit.setAttribute("rows", this.rows)
      digit.setAttribute("cols", this.cols)
      digit.setAttribute("pixels", this.pixels)
      shadow.appendChild(digit)
      this.digits.push(digit)
      i += 1
    }

    this.locked = false
    this.loopIteration()
    // this.digits[0].show(9)

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
          console.log(val, i)
          return digit.animate(val[i])
        })
      })

      p.then(()=>{
        this.locked = false
        setTimeout(()=>{this.loopIteration()}, 1000)
      })
    })
  }
}

document.registerElement('clock-display', ClockDisplay)

export default ClockDisplay
