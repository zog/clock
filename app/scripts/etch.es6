import ClockDisplay from './clock_display'
import Matrix from './matrix'

let pixels = "custom-clock"
let rows = 10
let cols = 10
let digits = 1
let index = 0

const nextFrame = ()=>{
  $('clock-display')[0].displayMatrix(0, $('custom-matrix')[index].stringValue())
  index ++
  index = index % $('custom-matrix').length
}

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

  $('#display')[0].appendChild(out)
  out.displayMatrix(0, $('custom-matrix')[0].stringValue())
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

  $('input[name=customText]').change((e)=>{
    $('#display clock-display').attr('custom-text', $(e.target).val())
  })

  // $('custom-matrix').on('change', (e)=>{
  //   $('clock-display')[0].displayMatrix(0, e.target.stringValue())
  // })

  displayClock()
  setInterval(nextFrame, 1000)
})
