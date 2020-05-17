import { array } from "./ExtraContent";

class Repository extends HTMLElement {
  constructor() {
    super();

    this.repoDetails = null;

    this.name = this.getAttribute("name");
    console.log(this.name);
    this.endpoint = `https://api.github.com/repos/${this.name}`;
    this.getDetails = this.getDetails.bind(this);

    this.innerHTML = `<h1>Loading</h1>`;

    this.handleRequest = this.handleRequest.bind(this);
  }

  async connectedCallback() {
    //   TODO use this object for real details
    // let repo = await this.getDetails();
    // this.repoDetails = repo;

    // TODO use this object in development, it doesn't suffer from CORS cross origin request failure
    this.repoDetails = {
      owner: {
        avatar_url:
          "https://i1.pngguru.com/preview/137/834/449/cartoon-cartoon-character-avatar-drawing-film-ecommerce-facial-expression-png-clipart.jpg",
        login: "Bernard Baker",
      },
      id: 263711101,
      full_name: "Bernard Baker",
      description: "This is a short description",
    };
    this.initShadowDom();
  }

  initShadowDom() {
    let shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = this.template;
  }

  handleRequest = (value) => {
    console.log(value + " this is my unique ID");
    let obj = array.find((obj) => obj.id === value);
    console.log(obj, array);
    var tag = document.createElement("p");
    var info = document.createTextNode(obj.info);
    tag.appendChild(info);
    var element = document.createElement("div");
    element.setAttribute("class", "paragraph");
    element.appendChild(tag);
    document
      .querySelector("github-repo")
      .shadowRoot.querySelector(`#content-${value}`)
      .appendChild(element);
  };

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

        #showContentButton {
          background-color: #4CAF50; /* Green */
          border: none;
          color: white;
          padding: 5px 10px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 15px;
        }

        .content {
            float: left;
            margin: 1em 0;
        }

        .paragraph {
            padding: 1em 0;
        }

      </style>
    `;
  }

  get template() {
    let repo = this.repoDetails;

    if (repo.message) {
      return this.style + this.cardError(repo);
    } else {
      return this.style + this.cardTemplate(repo, this.root);
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

  cardTemplate({ id, owner, full_name, description }) {
    return `
      <div class="Card">
        <aside>
          <img width="48" height="48" class="Avatar" src="${owner.avatar_url}" alt="Profile picture for ${owner.login}" />
        </aside>
        <header>
          <h2 class="Card__title">${full_name}</h2>
          <span class="Card__meta">${description}</span>
          <br><br>
          <button id="showContentButton" onClick="console.log(document.activeElement.handleRequest(${id}))">Unlock Content</button>
        </header>
        <section id="content-${id}" class="content"></section>
      </div>
    `;
  }
}

window.customElements.define("github-repo", Repository);
