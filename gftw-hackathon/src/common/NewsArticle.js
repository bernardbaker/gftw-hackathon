import { array } from "./ExtraContent";

class NewsArticle extends HTMLElement {
  constructor() {
    super();

    this.repoDetails = null;

    this.id = this.getAttribute("id");
    console.log(this.id);
    this.endpoint = `https://api.github.com/gists/${this.id}`;

    this.getDetails = this.getDetails.bind(this);

    this.innerHTML = `<h1>Loading</h1>`;

    this.handleRequest = this.handleRequest.bind(this);
  }

  async connectedCallback() {
    //   TODO use this object for real details
    let repo = await this.getDetails();
    this.repoDetails = repo;
    console.log(repo);

    console.log(this.repoDetails);
    array.push(this.repoDetails);

    this.initShadowDom();
  }

  initShadowDom() {
    let shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = this.template;
  }

  handleRequest = (value) => {
    console.log(value + " this is my unique ID");
    let obj = array.find((obj) => obj.id === value);
    // console.log(obj, array);

    var tag = document.createElement("p");
    // TODO - use object keys to Array.pop() off the next data
    /**
     * Look at the obj.files in the debugger console.
     */
    var info = document.createTextNode(obj.files["Chapter 1"].content);
    //
    tag.appendChild(info);
    var element = document.createElement("div");
    element.setAttribute("class", "paragraph");
    element.appendChild(tag);
    document
      .querySelector("news-article")
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

  cardTemplate({ id, owner, files, created_at }) {
    return `
      <div class="Card">
        <aside>
          <img width="48" height="48" class="Avatar" src="${
            owner.avatar_url
          }" alt="Profile picture for ${owner.login}" />
        </aside>
        <header>
          <h2 class="Card__title">${files.Title.content}</h2>
          <span class="Card__meta">${new Date(
            created_at
          ).toLocaleDateString()} - ${new Date(
      created_at
    ).toLocaleTimeString()}</span>
          <br><br>
          <blockquote>${files["Chapter 1"].content}</blockquote>
          <br><br>
          <button id="showContentButton" onClick="document.activeElement.handleRequest('${id}')">Unlock Content</button>
        </header>
        <section id="content-${id}" class="content"></section>
      </div>
    `;
  }
}

window.customElements.define("news-article", NewsArticle);
