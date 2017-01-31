import Clock from './clock'

class ClockDigit extends HTMLElement {
  get rows(){
    let s = this.getAttribute('rows');
    return s ? parseInt(JSON.parse(s)) : 8;
  }

  get cols(){
    let s = this.getAttribute('cols');
    return s ? parseInt(JSON.parse(s)) : 4;
  }

  mapping(val) {
    return {
      0: [
        ["⌜", "-", "⌝"],
        ["|", "", "|"],
        ["⌞", "-", "⌟"]
      ],
      1: [
        ["", "", "|"],
        ["", "", "|"],
        ["", "", "|"]
      ],
      2: [
        ["-", "-", "⌝"],
        ["⌜", "-", "⌟"],
        ["⌞", "-", "-"]
      ],
      3: [
        ["-", "-", "⌝"],
        ["-", "-", "|"],
        ["-", "-", "⌟"]
      ],
      4: [
        ["|", "", "|"],
        ["⌞", "-", "⌟"],
        ["", "", "|"]
      ],
      5: [
        ["⌜", "-", "-"],
        ["⌞", "-", "⌝"],
        ["-", "-", "⌟"]
      ],
      6: [
        ["⌜", "-", "-"],
        ["|", "-", "⌝"],
        ["⌞", "-", "⌟"]
      ],
      7: [
        ["-", "-", "⌝"],
        ["", "", "|"],
        ["", "", "|"]
      ],
      8: [
        ["⌜", "-", "⌝"],
        ["|", "-", "|"],
        ["⌞", "-", "⌟"]
      ],
      9: [
         ["⌜", "-", "⌝"],
         ["⌞", "-", "|"],
         ["", "", "|"]
      ]
    }[val]
  }

  attachedCallback() {
    let i = 0
    let j = 0
    this.matrix = []
    while(i < this.rows){
      let row = document.createElement('div')
      row.classList.add('row')
      if(!this.matrix[i]){ this.matrix[i] = [] }
      while(j < this.cols){
        var clock = document.createElement('custom-clock')
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

  mapPixel(x, y, matrix){
    // here we pam the clock coordinate to the corresponding piwel in the matrix
    let _x, _y
    if(x == 0){ _x = 0 }
    if(y == 0){ _y = 0 }
    if(x == this.cols-1){ _x = 2 }
    if(y == this.rows-1){ _y = 2 }
    if(x == this.cols/2){ _x = 1 }
    if(y == this.rows/2){ _y = 1 }

    // console.log(x, y, _x, _y, _y == undefined)
    if(_x >= 0  && _y >= 0){
      // console.log("_x != undefined && _y != undefined")
      return matrix[_y][_x]
    }
    if(matrix[1][1] == "|" && x == this.cols/2){
      return "|"
    }
    if(matrix[1][1] == "-" && y == this.rows/2){
      return "-"
    }
    if(_x >= 0 && _y == undefined){
      // we are on a vertical edge, but not in a corner
      // console.log("_x && _y == undefined", _x, 1)
      if(y <= this.rows/2){
        if(matrix[0][_x] == "⌜" || matrix[0][_x] == "⌝" || matrix[0][_x] == "|"){
          // console.log('HERE', x, y)
          return "|"
        }
        else{
          return ""
        }
      } else {
        if(matrix[2][_x] == "⌞" || matrix[2][_x] == "⌟" || matrix[2][_x] == "|"){
          return "|"
        }
        else{
          return ""
        }
      }
      return matrix[1][_x]
    }
    if(_y >= 0 && _x == undefined){
      // we are on an horizontal edge, but not in a corner
      // console.log("_y && _x == undefined", 1, _y)
      return matrix[_y][1]
    }

    // console.log("fallback")
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
    const matrix = this.mapping(val)
    let x = 0
    let y = 0
    let pixel
    // console.log("matrix: ", matrix)
    for(let line of this.matrix){
      x = 0
      for(let clock of line){
        let pixel = this.mapPixel(x, y, matrix)
        // console.log(x, y, clock, pixel)
        p = p.then(()=>{
          return clock.animate(pixel)
        })
        x += 1
      }
      y += 1
    }
    return p
  }



  show(val) {
    // console.log("showing: " + val)
    const matrix = this.mapping(val)
    let x = 0
    let y = 0
    let pixel
    // console.log("matrix: ", matrix)
    for(let line of this.matrix){
      x = 0
      for(let clock of line){
        let pixel = this.mapPixel(x, y, matrix)
        // console.log(x, y, clock, pixel)
        clock.show(pixel)
        x += 1
      }
      y += 1
    }
  }
}

document.registerElement('clock-digit', ClockDigit)

export default ClockDigit
