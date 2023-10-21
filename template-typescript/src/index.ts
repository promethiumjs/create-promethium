import { h, renderTemplateFn } from "promethium-js";
import { html } from "lit";
import App from "./App";
import "./index.css";

renderTemplateFn(() => html`${h(App)}`, { renderContainer: "body" });
