import { adaptState, html } from "promethium-js";
import "./App.css";

const App = () => {
  const [count, setCount] = adaptState(0);

  return () =>
    html`<div id="app">
      <h1>Promethium App - TS</h1>
      <div class="counter">Counter: ${count()}</div>
      <button @click=${() => setCount(count() + 1)}>Increment</button>
      <div class="ack">
        Powered by
        <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer"
          >Vite</a
        >,
        <a
          href="https://lit.dev/docs/libraries/standalone-templates/"
          target="_blank"
          rel="noopener noreferrer"
          >Lit-html</a
        >
        and
        <a
          href="https://www.typescriptlang.org/"
          target="_blank"
          rel="noopener noreferrer"
          >TypeScript</a
        >
      </div>
    </div>`;
};

export default App;
