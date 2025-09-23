import './style.css'

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Simple Calculator</h1>
    <div class="calculator">
      <input type="text" id="display" disabled value="0" />
      <div class="buttons">
        <button class="btn" data-value="7">7</button>
        <button class="btn" data-value="8">8</button>
        <button class="btn" data-value="9">9</button>
        <button class="btn" data-value="/">/</button>
        
        <button class="btn" data-value="4">4</button>
        <button class="btn" data-value="5">5</button>
        <button class="btn" data-value="6">6</button>
        <button class="btn" data-value="*">*</button>
        
        <button class="btn" data-value="1">1</button>
        <button class="btn" data-value="2">2</button>
        <button class="btn" data-value="3">3</button>
        <button class="btn" data-value="-">-</button>
        
        <button class="btn" data-value="0">0</button>
        <button class="btn" data-value=".">.</button>
        <button class="btn" id="equals">=</button>
        <button class="btn" data-value="+">+</button>

        <button class="btn" id="clear">C</button>
      </div>
    </div>
  </div>
`;

// Calculator logic
const display = document.getElementById('display')
let currentInput = ''

document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.getAttribute('data-value')
    if (!value) return
    currentInput += value
    display.value = currentInput
  })
})

document.getElementById('equals').addEventListener('click', () => {
  try {
    display.value = eval(currentInput)  // simple evaluation
    currentInput = display.value
  } catch {
    display.value = 'Error'
    currentInput = ''
  }
})

document.getElementById('clear').addEventListener('click', () => {
  currentInput = ''
  display.value = '0'
})
