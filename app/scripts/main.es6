

import ClockDisplay from './clock_display'

let pixels = "custom-clock"
let rows = 8
let cols = 4

const displayClock = ()=>{
  const values = {
    pixels,
    rows,
    cols
  }
  $('#display').html('')
  let out = document.createElement('clock-display')
  for(let k in values){
    out.setAttribute(k, values[k])
  }

  $('#display')[0].appendChild(out)
}

$(document).ready(()=>{
  $('input[name=pixels]').change((e)=>{
    pixels = $(e.target).val()
    displayClock()
  })

  $('input[name=cols]').change((e)=>{
    cols = $(e.target).val()
    displayClock()
  })

  $('input[name=rows]').change((e)=>{
    rows = $(e.target).val()
    displayClock()
  })

  displayClock()

})
