import Clock from './clock'
import Cube from './cube'

class ClockDigit extends HTMLElement {
  get rows(){
    let s = this.getAttribute('rows');
    return s ? parseInt(s) : 8;
  }

  get cols(){
    let s = this.getAttribute('cols');
    return s ? parseInt(s) : 4;
  }

  get pixels(){
    let s = this.getAttribute('pixels');
    return s ? s : "custom-clock";
  }


  mapping(val) {
    const key = (val === undefined ? "" : `${val}`)
    return {
      "": `
      ..
      ..
      `,
      "0": `
      ⌜-⌝
      |.|
      ⌞-⌟
      `,
      "1": `
        ..|
        ..|
        ..|
      `,
      "2": `
        --⌝
        ..|
        ⌜-⌟
        |..
        |..
        ⌞--
      `,
      "3": `
        --⌝
        --|
        --⌟
      `,
      "4": `
        |..
        ⌞-⌝
        ..|
      `,
      "5": `
        ⌜--
        ⌞-⌝
        --⌟
      `,
      "6": `
        ⌜--
        ⊢-⌝
        ⌞-⌟
      `,
      "7": `
        --⌝
        ..|
        ..|
      `,
      "8": `
        ⌜-⌝
        |.|
        ⊢-⊣
        ⌞-⌟
      `,
      "9": `
        ⌜-⌝
        |.|
        ⌞-⊣
        ..|
        ..|
        ..|
        ..|
        ..|
      `
    }[key]
  }

  splitToMatrix(s) {
    let a = s.split("\n").map((e)=>{return e.trim().split('')})
    if(a[0].length == 0){ a.splice(0, 1) }
    if(a[a.length - 1].length == 0){ a.pop() }
    return a
  }

  initMatrix() {
    let i = 0
    let j = 0
    this.matrix = []
    while(i < this.rows){
      let row = document.createElement('div')
      row.classList.add('digit-row')
      if(!this.matrix[i]){ this.matrix[i] = [] }
      while(j < this.cols){
        var clock = document.createElement(this.pixels)
        clock.setAttribute("x", j)
        clock.setAttribute("y", i)
        row.appendChild(clock)
        this.matrix[i][j] = clock
        j += 1
      }
      this.appendChild(row)
      j = 0
      i += 1
    }
  }

  attachedCallback() {
    this.initMatrix()
  }

  mapPixel(x, y, matrix){
    // here we pam the clock coordinate to the corresponding piwel in the matrix
    let _x, _y

    const nbRows = matrix.length
    const nbCols = matrix[0].length
    // we test if we are on an edge
    if(x == 0){ _x = 0 }
    if(y == 0){ _y = 0 }

    if(x == this.cols-1){ _x = nbCols - 1 }
    if(y == this.rows-1){ _y = nbRows - 1 }

    // now we test if this pixel is on an "anchor"
    if(_x ===  undefined){
      for(let i=1; i < nbCols - 1; i++){
        if(x == parseInt(i / (nbCols-1) * this.cols)){ _x = i }
      }
    }
    if(_y ===  undefined){
      for(let i=1; i < nbRows - 1; i++){
        if(y == parseInt(i / (nbRows-1) * this.rows)){ _y = i }
      }
    }
    if(_x >= 0  && _y >= 0){
      return matrix[_y][_x]
    }

    if(_x >= 0 && _y===  undefined){
      // we are on a vertical edge, but not in a corner
      let i = 0;
      while(i < nbRows && y > parseInt(i / (nbRows-1) * this.rows)){
        i ++
      }
      const prevAnchor = matrix[i-1][_x]
      if(prevAnchor == "⌜" || prevAnchor == "⌝" || prevAnchor == "⊢" || prevAnchor == "⊥" || prevAnchor == "⊣" || prevAnchor == "⊤" || prevAnchor == "|"){
        return '|'
      }
      else {
        return ""
      }
    }
    if(_y >= 0 && _x ===  undefined){
      // we are on an horizontal edge, but not in a corner
      let i = 0;
      while(i < nbCols && x > parseInt(i / (nbCols-1) * this.cols)){
        i ++
      }
      const prevAnchor = matrix[_y][i-1]
      if(prevAnchor == "⌜" || prevAnchor == "⌞" || prevAnchor == "⊤" || prevAnchor == "⊥" || prevAnchor == "⊢" || prevAnchor == "⊣" || prevAnchor == "-"){
        return "-"
      }
      else {
        return ""
      }
    }

    return ""
  }

  lock() {
    for(let line of this.matrix){
      for(let clock of line){
        clock.lock()
      }
    }
  }

  animate(val) {
    let p = Promise.resolve()
    let matrix = val
    if(val.length == 1){
      // we don't have a matric but a char
      matrix = this.mapping(val)
    }
    matrix = this.splitToMatrix(matrix)
    let x = 0
    let y = 0
    let pixel
    for(let line of this.matrix){
      x = 0
      for(let clock of line){
        let pixel = this.mapPixel(x, y, matrix)
        p = p.then(()=>{
          return clock.animate(pixel)
        })
        x += 1
      }
      y += 1
    }
    return p
  }

  displayMatrix(string) {
    let x = 0
    let y = 0
    let pixel
    const matrix = this.splitToMatrix(string)
    for(let line of this.matrix){
      x = 0
      for(let clock of line){
        let pixel = this.mapPixel(x, y, matrix)
        clock.show(pixel)
        x += 1
      }
      y += 1
    }
  }

  show(val) {
    if(!this.matrix){ return }
    if(this.val == val){ return }
    this.val = val
    const matrix = this.mapping(val)
    this.displayMatrix(matrix)
  }
}

document.registerElement('clock-digit', ClockDigit)

export default ClockDigit
