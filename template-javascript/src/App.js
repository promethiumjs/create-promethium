import { adaptState, html } from "promethium-js";
import "./App.css";

const App = () => {
  const [count, setCount] = adaptState(0);

  return () =>
    html`<div id="app">
      <h1>Promethium App</h1>
      <div class="counter">Counter: ${count()}</div>
      <button @click=${() => setCount(count() + 1)}>Increment</button>
      <div class="ack">
        Powered by
        <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer"
          >Vite</a
        >
        and
        <a
          href="https://lit.dev/docs/libraries/standalone-templates/"
          target="_blank"
          rel="noopener noreferrer"
          >Lit-html</a
        >
      </div>
    </div>`;
};

export default App;
