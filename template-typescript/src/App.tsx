import { html } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { adaptState } from "promethium-js";

function App() {
  const [count, setCount] = adaptState(0);

  const fontStyles = {
    fontFamily: "sans-serif",
  };

  const containerStyles = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  };

  const headerStyles = {
    marginBottom: "10px",
  };

  const buttonStyles = {
    border: "2px solid black",
    borderRadius: "5px",
    backgroundColor: "#08759E",
    color: "white",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    fontSize: "24px",
  };

  const textStyles = {
    margin: "15px",
    fontSize: "22px",
    fontWeight: "600",
  };

  return () => html`
    <div style=${styleMap(containerStyles)}>
      <h1 style=${styleMap({ ...fontStyles, ...headerStyles })}>Counter</h1>
      <div>
        <button
          style=${styleMap({ ...fontStyles, ...buttonStyles })}
          @click=${() => setCount((count) => count - 1)}
        >
          -
        </button>
        <span style=${styleMap({ ...fontStyles, ...textStyles })}
          >${count()}</span
        >
        <button
          style=${styleMap({ ...fontStyles, ...buttonStyles })}
          @click=${() => setCount((count) => count + 1)}
        >
          +
        </button>
      </div>
    </div>
  `;
}

export default App;
