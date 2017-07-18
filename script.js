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
    const errStr = `<pre class="--app-err">${e.error.message}\n${e.error.stack}</pre>`;
    preview.innerHTML = errStr;
  });


  let queued = false;
  function update() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const code = input.value;
      localStorage.setItem('code', code);
      run(code);
    });
  }

  input.addEventListener('keydown', e => {
    if (e.keyCode === 9) {
      e.preventDefault();
      const before = input.value.slice(0, input.selectionStart);
      const after = input.value.slice(input.selectionEnd);
      input.value = `${before}  ${after}`;
      input.selectionEnd = before.length + 2;
      update();
    }
  });

  input.addEventListener('input', update);

  const code = localStorage.getItem('code') || '▲ App\n  ↳ Header\n  ↳ Content\n\n▲ Header\n  ↳ h1\n    ↳ ("Hello world!")\n\n▲ Content\n  ↳ section\n    ↳ p\n      ↳ ("This is some content. Here\'s a ")\n      ↳ a\n          < href←("https://en.wikipedia.org")\n        ↳ ("link")\n      ↳ (".")\n';
  input.value = code;
  run(code);
})();
