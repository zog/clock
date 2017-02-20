import Clock from './clock'

class Cube extends Clock {
  draw() {
    this.faceOn = document.createElement('div')
    this.faceOn.classList.add('face')
    this.faceOn.classList.add('on')
    this.appendChild(this.faceOn)

    this.faceOff = document.createElement('div')
    this.faceOff.classList.add('face')
    this.faceOff.classList.add('off')
    this.appendChild(this.faceOff)
  }
  animate(val) {
    return new Promise((res, rej)=>{
      this.show(val)
      this.classList.remove('locked')
      setTimeout(res, 10)
    })
  }

  show(input) {
    const val = !(input == "" || input == ".")
    if(this.val === val){ return }
    this.classList.add('active')
    this.val = val
    setTimeout(()=>{
      this.classList.remove('active')
    }, 500)

    this.classList.toggle("disabled", !val)
  }
}

document.registerElement('custom-cube', Cube)

export default Clock
