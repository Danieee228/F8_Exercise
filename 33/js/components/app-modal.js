class AppModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .modal-overlay {
          position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5);
          display: flex; justify-content: center; align-items: center; z-index: 1000;
          opacity: 0; transition: opacity 0.3s ease;
        }
        
        .modal-inner {
          min-width: 400px; background-color: #ffffff; border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          display: flex; flex-direction: column; overflow: hidden;
          transform: scale(0.5); opacity: 0;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
        }
        
        .modal-overlay.show { opacity: 1; }
        .modal-inner.show { transform: scale(1); opacity: 1; }
        
        .header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid #f0f0f0; }
        .header h2 { font-size: 1.25rem; font-family: sans-serif; color: #222; }
        .close-btn { background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: #999; transition: color 0.2s; }
        .close-btn:hover { color: #ff4d4f; }
        .content { padding: 24px; font-family: sans-serif; color: #444; line-height: 1.6; }
        .footer { padding: 16px 24px; border-top: 1px solid #f0f0f0; display: flex; justify-content: flex-end; gap: 12px; }
        
        .btn { padding: 8px 20px; border: none; border-radius: 6px; cursor: pointer; font-family: sans-serif; font-weight: 500; transition: all 0.2s; }
        .btn-cancel { background: #f5f5f5; color: #555; }
        .btn-cancel:hover { background: #e8e8e8; }
        .btn-confirm { background: #1677ff; color: #fff; }
        .btn-confirm:hover { background: #4096ff; }
      </style>

      <div class="modal-overlay">
        <div class="modal-inner">
          <div class="header">
            <h2 id="heading">Modal</h2>
            <button class="close-btn" id="x-btn">&times;</button>
          </div>
          <div class="content">
            <slot></slot>
          </div>
          <div class="footer">
            <button class="btn btn-cancel" id="cancel-btn">Cancel</button>
            <button class="btn btn-confirm">Confirm</button>
          </div>
        </div>
      </div>
    `;
    return template;
  }

  _handleClick = (event) => {
    if (
      event.target.closest("#cancel-btn") ||
      event.target.closest("#x-btn") ||
      event.target.classList.contains("modal-overlay")
    ) {
      this.close();
    }
  };

  open() {
    // Append Template
    const template = this.getTemplate();
    const templateContent = template.content.cloneNode(true);
    this.shadowRoot.appendChild(templateContent);

    // Set Heading
    const heading = this.shadowRoot.querySelector("#heading");
    heading.textContent = this.getAttribute("heading");

    this.shadowRoot.addEventListener("click", this._handleClick);

    const overlay = this.shadowRoot.querySelector(".modal-overlay");
    const inner = this.shadowRoot.querySelector(".modal-inner");

    setTimeout(() => {
      overlay.classList.add("show");
      inner.classList.add("show");
    }, 10);

    window.addEventListener("keydown", this.handleKeyDown);

    this.dispatchEvent(
      new CustomEvent("open", { bubbles: true, composed: true }),
    );
  }
  close() {
    const overlay = this.shadowRoot.querySelector(".modal-overlay");
    const inner = this.shadowRoot.querySelector(".modal-inner");

    if (overlay) overlay.classList.remove("show");
    if (inner) inner.classList.remove("show");

    if (inner) {
      inner.addEventListener("transitionend", () => {
        this.shadowRoot.innerHTML = "";
      });
    } else {
      this.shadowRoot.innerHTML = "";
    }

    this.shadowRoot.removeEventListener("click", this._handleClick);
    window.removeEventListener("keydown", this.handleKeyDown);

    this.dispatchEvent(
      new CustomEvent("close", { bubbles: true, composed: true }),
    );
  }
  handleKeyDown = (event) => {
    if (event.key === "Escape") {
      this.close();
    }
  };
}

customElements.define("app-modal", AppModal);
