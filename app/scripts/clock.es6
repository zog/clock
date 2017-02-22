'use strict';

class Clock extends HTMLElement {
  draw() {
    this.minutes = document.createElement('div')
    this.minutes.classList.add('minutes')
    this.minutes.classList.add('hand')
    this.hours = document.createElement('div')
    this.hours.classList.add('hours')
    this.hours.classList.add('hand')
    this.appendChild(this.minutes)
    this.appendChild(this.hours)
  }

  createdCallback() {
    this.draw()
    this.val = null
  }

  lock(){
    this.val = null
    this.classList.add('locked')
  }

  animate(val) {
    return new Promise((res, rej)=>{
      this.hours.style.transform = "rotate3d(0,0,1,0deg)"
      this.minutes.style.transform = "rotate3d(0,0,1,360deg)"
      this.classList.remove('locked')
      this.classList.add('fast')

      setTimeout(()=>{
        this.hours.style.transform = "rotate3d(0,0,1,120deg)"
        this.minutes.style.transform = "rotate3d(0,0,1,240deg)"
      }, 100)
      setTimeout(()=>{
        this.hours.style.transform = "rotate3d(0,0,1,240deg)"
        this.minutes.style.transform = "rotate3d(0,0,1,120deg)"
      }, 200)
      setTimeout(()=>{
        this.classList.remove('fast')
      }, 300)
      setTimeout(()=>{
        this.show(val)
      }, 310)
      setTimeout(res, 10)
    })
  }

  show(val) {
    if(this.val == val){ return }
    this.val = val
    this.classList.add('active')
    this.classList.remove('locked')
    setTimeout(()=>{
      this.classList.remove('active')
    }, 500)
    if(val == "" || val == "."){
      this.classList.add("disabled")
      this.minutes.style.transform = "rotate3d(0,0,1,0deg)"
      this.hours.style.transform = "rotate3d(0,0,1,20deg)"
    }
    else{
      this.classList.remove("disabled")
      if(val == "|"){
        this.minutes.style.transform = "rotate3d(0,0,1,90deg)"
        this.hours.style.transform = "rotate3d(0,0,1,-90deg)"
      }
      else if(val == "-"){
        this.minutes.style.transform = "rotate3d(0,0,1,0deg)"
        this.hours.style.transform = "rotate3d(0,0,1,-180deg)"
      }
      else if(val == "⌜"){
        this.minutes.style.transform = "rotate3d(0,0,1,0deg)"
        this.hours.style.transform = "rotate3d(0,0,1,90deg)"
      } else if(val == "⊢" || val == "⊣"){
        this.minutes.style.transform = "rotate3d(0,0,1,-90deg)"
        this.hours.style.transform = "rotate3d(0,0,1,90deg)"

      } else if(val == "⊤" || val ==  "⊥"){
        this.minutes.style.transform = "rotate3d(0,0,1,0deg)"
        this.hours.style.transform = "rotate3d(0,0,1,180deg)"
      }
      else if(val == "⌝"){
        this.minutes.style.transform = "rotate3d(0,0,1,180deg)"
        this.hours.style.transform = "rotate3d(0,0,1,90deg)"
      }
      else if(val == "⌞"){
        this.minutes.style.transform = "rotate3d(0,0,1,00deg)"
        this.hours.style.transform = "rotate3d(0,0,1,-90deg)"
      }
      else if(val == "⌟"){
        this.minutes.style.transform = "rotate3d(0,0,1,180deg)"
        this.hours.style.transform = "rotate3d(0,0,1,-90deg)"
      }
    }
  }
}

document.registerElement('custom-clock', Clock)

export default Clock
