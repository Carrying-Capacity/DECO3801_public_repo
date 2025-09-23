(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))l(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const u of e.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&l(u)}).observe(document,{childList:!0,subtree:!0});function o(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function l(t){if(t.ep)return;t.ep=!0;const e=o(t);fetch(t.href,e)}})();document.querySelector("#app").innerHTML=`
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
`;const display=document.getElementById("display");let currentInput="";document.querySelectorAll(".btn").forEach(a=>{a.addEventListener("click",()=>{const n=a.getAttribute("data-value");n&&(currentInput+=n,display.value=currentInput)})});document.getElementById("equals").addEventListener("click",()=>{try{display.value=eval(currentInput),currentInput=display.value}catch{display.value="Error",currentInput=""}});document.getElementById("clear").addEventListener("click",()=>{currentInput="",display.value="0"});
