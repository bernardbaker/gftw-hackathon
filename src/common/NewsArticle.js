/* eslint-disable no-restricted-globals */
import React from "react";
import ReactDOM from "react-dom";
import Download from "./Download";
import { array, cart } from "./ShoppingCart";
import { getData } from "./MockData";

class NewsArticle extends HTMLElement {
  constructor() {
    super();

    // This will hold the number of article paragraphs in the Gist.
    this.length = 0;

    // This is the content which has been selected.
    this.selectedContent = null;

    // Start counting paragraphs of an article to be read at 1 being the 1st paragraph
    this.paragraphCount = 1;

    // The Gist URL response will be store in this variable.
    this.repoDetails = null;

    // The ID of the Gist extracted from the Gist GitHub URL.
    this.id = this.getAttribute("data-article-ref");

    // The GitHub API endpoint.
    this.endpoint = `https://api.github.com/gists/${this.id}`;

    // What to show while loading the Gists.
    this.innerHTML = `<h1>Loading</h1>`;

    // A function which requests the Gist GitHub data.
    this.getDetails = this.getDetails.bind(this);

    // When the "read next paragraph" button is pressed.
    this.handleRequest = this.handleRequest.bind(this);

    // To further the experience, this would store the GitHub Gist ID in localstorage.
    this.handleArticleSelection = this.handleArticleSelection.bind(this);

    // Toggle a CSS class on an SVG graphic.
    this.toggleClass = this.toggleClass.bind(this);

    // Get the next Chapter X from the repository object stored in memory.
    this.getNextParagraph = this.getNextParagraph.bind(this);
  }

  /**
   * When the custom Web Component is ready.
   */
  async connectedCallback() {
    let repo = await this.getDetails();

    this.repoDetails = repo;

    array.push(this.repoDetails);

    this.length = parseInt(repo.files.Length.content);

    const dom = this.initShadowDom();

    const controls = dom.getElementById("controls");

    controls.onclick = this.handleArticleSelection;

    controls.setAttribute("data-id", this.repoDetails.id);

    ReactDOM.render(<Download />, controls);
  }

  /**
   * Prepare the shadow DOM and keep it open for changes.
   */
  initShadowDom() {
    let shadowRoot = this.attachShadow({ mode: "open" });

    shadowRoot.innerHTML = this.template;

    return shadowRoot;
  }

  /**
   * To further the experience store content IDs.
   */
  handleArticleSelection = (e) => {
    e.target.onclick = null;

    this.toggleClass(e);

    const id = e.target.getAttribute("data-id");

    if (cart.indexOf(id) === -1) {
      cart.push(id);
    }
  };

  /**
   * When the "Read next paragraph" button is pressed.
   */
  handleRequest = (pointer, contentId) => {
    document
      .querySelector("meta[name='monetization']")
      .setAttribute("content", pointer);

    let obj = array.find((obj) => obj.id === contentId);

    this.selectedContent = obj;

    const paragraph = this.getNextParagraph();

    if (paragraph) {
      var tag = document.createElement("p");

      var info = document.createTextNode(paragraph);

      tag.appendChild(info);

      var element = document.createElement("div");

      element.setAttribute("class", "paragraph");

      element.appendChild(tag);

      document
        .querySelector(`[data-article-ref='${contentId}']`)
        .shadowRoot.querySelector(`#content-${contentId}`)
        .appendChild(element);
    }
  };

  /**
   * Styles for the Web Component.
   */
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

        .paragraph p {
          word-break: break-word;
        }

        .btn-download {
          cursor: pointer;
          display: block;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          -webkit-tap-highlight-color: transparent;
          pointer-events: none;
        }

        .btn-download:hover {
          background: rgba(0, 0, 0, 0.03);
        }

        .btn-download svg {
          margin: 16px 0 0 16px;
          fill: none;
          transform: translate3d(0, 0, 0);
          pointer-events: none;
        }

        .btn-download svg polyline,
        .btn-download svg path {
          stroke: #000000;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          transition: all 0.3s ease;
          transition-delay: 0.3s;
          pointer-events: none;
        }

        .btn-download svg path#check {
          stroke-dasharray: 38;
          stroke-dashoffset: 114;
          transition: all 0.4s ease;
        }

        .btn-download.downloaded svg .svg-out {
          opacity: 0;
          animation: drop 0.3s linear;
          transition-delay: 0.4s;
        }

        .btn-download.downloaded svg path#check {
          stroke: #000000;
          stroke-dashoffset: 174;
          transition-delay: 0.4s;
        }

        @keyframes drop {
          20% {
            transform: translate(0, -3px);
          }
          80% {
            transform: translate(0, 2px);
          }
          95% {
            transform: translate(0, 0);
          }
        }


      </style>
    `;
  }

  /**
   * Which template should be rendered.
   */
  get template() {
    let repo = this.repoDetails;

    if (repo.message) {
      return this.style + this.cardError(repo);
    } else {
      return this.style + this.cardTemplate(repo);
    }
  }

  /**
   * Load data from GitHub Gist online or a mocked
   * version of the data locally.
   */
  async getDetails() {
    if (location.host.indexOf(/localhost/i) !== -1) {
      return getData();
    } else {
      return await fetch(this.endpoint, {
        mode: "cors",
      }).then((res) => res.json());
    }
  }

  /**
   * Template shown on error.
   */
  cardError({ message }) {
    return `<div class="Card Card--error">Error: ${message}</div>`;
  }

  /**
   * Template shown.
   */
  cardTemplate({ description, id, owner, files, created_at }) {
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
          <div id="controls"></div>
          <br><br>
          <blockquote>${files["Snippet"].content}</blockquote>
          <br><br>
          <button id="showContentButton" onClick="document.activeElement.handleRequest('${description}','${id}')">Read next paragraph</button>
        </header>
        <section id="content-${id}" class="content"></section>
      </div>
    `;
  }

  /**
   * SVG CSS class toggler.
   */
  toggleClass = (e) => {
    const node = e.target.querySelector(".btn-download");

    if (node.classList.contains("downloaded")) {
      node.classList.remove("downloaded");
    } else {
      node.classList.add("downloaded");
    }
  };

  /**
   * Lookup the content to be displayed.
   */
  getNextParagraph = () => {
    if (this.paragraphCount <= this.length) {
      const content = this.selectedContent.files[
        `Chapter ${this.paragraphCount++}`
      ].content;

      return content;
    } else if (this.paragraphCount++ === this.length + 1) {
      return "Thanks for reading - from the author";
    } else {
      return null;
    }
  };
}

/**
 * Register the custom Web Component.
 */
window.customElements.define("news-article", NewsArticle);
