class AppModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  open() {
    // Append Template
    const template = document.querySelector("#app-modal-tpl");
    const templateContent = template.content.cloneNode(true);
    this.shadowRoot.appendChild(templateContent);

    // Set Heading
    const heading = this.shadowRoot.querySelector("#heading");
    heading.textContent = this.getAttribute("heading");

    this.shadowRoot.addEventListener("click", (event) => {
      if (event.target.closest("#close-btn")) {
        this.close();
      }
    });
  }
  close() {
    this.shadowRoot.innerHTML = "";
  }
}

customElements.define("app-modal", AppModal);
