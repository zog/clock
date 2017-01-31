'use strict';

import ClockDigit from './clock_digit'

class ClockDisplay extends HTMLElement {
  get digitsCount(){
    let s = this.getAttribute('digits');
    return s ? JSON.parse(s) : 6;
  }

  get rows(){
    let s = this.getAttribute('rows');
    return s ? JSON.parse(s) : 8;
  }

  get cols(){
    let s = this.getAttribute('cols');
    return s ? JSON.parse(s) : 8;
  }

  get pixels(){
    let s = this.getAttribute('pixels');
    return s ? s : "custom-clock";
  }

  digitsVals() {
    const date = new Date()
    const h = date.getHours()
    const hh = parseInt(h/10)
    const m = date.getMinutes()
    const mm = parseInt(m/10)
    const s = date.getSeconds()
    const ss = parseInt(s/10)
    return [hh, h - hh*10, mm, m - mm*10, ss, s - ss*10]
  }

  showTime() {
    let i = 0
    let val = this.digitsVals()
    for(let digit of this.digits){
      digit.show(val[i])
      i += 1
    }
    setTimeout(()=>{
      if(this.locked){ return}
      this.showTime()
    }, 1000)
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
    while(i < this.digitsCount){
      digit = document.createElement("clock-digit")
      digit.setAttribute("rows", this.rows)
      digit.setAttribute("cols", this.cols)
      digit.setAttribute("pixels", this.pixels)
      this.appendChild(digit)
      this.digits.push(digit)
      i += 1
    }

    this.locked = false
    this.showTime()
    // this.digits[0].show(2)

    this.addEventListener('mousedown', ()=>{
      console.log("down")
      this.locked = true
      this.lock()
    })

    this.addEventListener('mouseup', ()=>{
      let p = Promise.resolve()
      let i = 0
      let val = this.digitsVals()
      console.log("up", val)
      this.digits.forEach((digit, i)=>{
        p = p.then(()=>{
          console.log(val, i)
          return digit.animate(val[i])
        })
      })

      p.then(()=>{
        this.locked = false
        setTimeout(()=>{this.showTime()}, 1000)
      })
    })
  }
}

document.registerElement('clock-display', ClockDisplay)

export default ClockDisplay
