const input = document.getElementById('source');
const preview = document.getElementById('preview');


function run(code) {
  const ast = parse(code);
  const children = render(ast);
  preview.innerHTML = '';
  children.forEach(child =>
    preview.appendChild(child));
}


(function init() {
  window.addEventListener('error', e => {
    const errStr = `<pre class="--app-err">${e.error.stack}</pre>`;
    preview.innerHTML = errStr;
  });


  let queued = false;
  function update() {
    queued = false;
    const code = input.value;
    localStorage.setItem('code', code);
    run(code);
  }

  input.addEventListener('input', e => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  });

  const code = localStorage.getItem('code') || '▲ App\n  ↳ Header\n  ↳ section\n    ↳ p\n      ↳ ("sup")\n\n▲ Header\n  ↳ h1\n    ↳ ("Hello world!")\n';
  input.value = code;
  run(code);
})();
