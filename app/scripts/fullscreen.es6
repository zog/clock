

import ClockDisplay from './clock_display'

let pixels = "custom-clock"
let rows = 5
let cols = 4

const displayClock = ()=>{
  const values = {
    pixels,
    rows,
    cols
  }
  document.getElementById('display').innerHTML = ''
  let out = document.createElement('clock-display')
  const query = window.location.search.substring(1)
  const vars = query.split('&')

  for(let k in vars){
    let pair = vars[k].split('=');
    if(pair[0].length > 0){
      out.setAttribute(pair[0], pair[1])
    }
  }

  document.getElementById('display').appendChild(out)
}

(()=>{
  displayClock()
})()
