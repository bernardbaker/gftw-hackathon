class Repository extends HTMLElement {
  constructor() {
    super();

    this.repoDetails = null;

    this.name = this.getAttribute("name");
    this.endpoint = `https://api.github.com/repos/${this.name}`;
    this.getDetails = this.getDetails.bind(this);

    this.innerHTML = `<h1>Loading</h1>`;
  }

  async connectedCallback() {
    let repo = await this.getDetails();
    this.repoDetails = repo;
    this.initShadowDom();
  }

  initShadowDom() {
    let shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = this.template;
  }

  get style() {
    return `
      <style>
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: system-ui;
        }

        .Card {
          margin: 0 0 8px;
          padding: 16px;
          border: 1px solid #c5c5c5;
        }

        .Card::after {
          content: "";
          clear: both;
          display: table;
        }

        .Card aside {
          float: left;
        }

        .Card header {
          float: left;
        }

        .Card__title {
          margin-bottom: 4px;
          font-weight: 400;
          font-size: 16px;
        }

        .Card__meta {
          color: #4F4F4F;
          font-size: 12px;
        }

        .Card--error {
          background: #D23923;
          color: white;
          font-weight: 700;
          border: 0;
        }

        .Avatar {
          display: block;
          margin-right: 16px;
          border-radius: 50%;
        }
      </style>
    `;
  }

  get template() {
    let repo = this.repoDetails;

    if (repo.message) {
      return this.style + this.cardError(repo);
    } else {
      return this.style + this.cardTemplate(repo);
    }
  }

  async getDetails() {
    return await fetch(this.endpoint, { mode: "cors" }).then((res) =>
      res.json()
    );
  }

  cardError({ message }) {
    return `<div class="Card Card--error">Error: ${message}</div>`;
  }

  cardTemplate({ owner, full_name, description }) {
    return `
      <div class="Card">
        <aside>
          <img width="48" height="48" class="Avatar" src="${owner.avatar_url}" alt="Profile picture for ${owner.login}" />
        </aside>
        <header>
          <h2 class="Card__title">${full_name}</h2>
          <span class="Card__meta">${description}</span>
        </header>
      </div>
    `;
  }
}

window.customElements.define("github-repo", Repository);
