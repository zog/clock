import ClockDisplay from './clock_display'

let pixels = "custom-clock"
let rows = 10
let cols = 6
let digits = 10

const displayClock = ()=>{
  const values = {
    pixels,
    rows,
    cols,
    digits
  }
  $('#display').html('')
  let out = document.createElement('clock-display')
  for(let k in values){
    out.setAttribute(k, values[k])
  }
  out.setAttribute("custom-text", $('input[name=custom-text]').val())

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

  $('input[name=digits]').change((e)=>{
    digits = $(e.target).val()
    displayClock()
  })

  $('input[name=rows]').change((e)=>{
    rows = $(e.target).val()
    displayClock()
  })

  $('input[name=custom-text]').change((e)=>{
    $('#display clock-display').attr('custom-text', $(e.target).val())
  })

  displayClock()

})
