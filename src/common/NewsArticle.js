import React from "react";
import ReactDOM from "react-dom";
import { array, cart } from "./ShoppingCart";
import Download from "./Download";

class NewsArticle extends HTMLElement {
  constructor() {
    super();

    this.length = 0;
    this.selectedContent = null;
    this.paragraphCount = 1;

    this.repoDetails = null;

    this.id = this.getAttribute("id");
    console.log(this.id);
    this.endpoint = `https://api.github.com/gists/${this.id}`;

    this.getDetails = this.getDetails.bind(this);

    this.innerHTML = `<h1>Loading</h1>`;

    this.handleRequest = this.handleRequest.bind(this);
    this.handleArticleSelection = this.handleArticleSelection.bind(this);
    this.toggleClass = this.toggleClass.bind(this);
    this.getNextParagraph = this.getNextParagraph.bind(this);
  }

  async connectedCallback() {
    let repo = await this.getDetails();
    this.repoDetails = repo;
    console.log(repo);

    console.log(this.repoDetails);
    array.push(this.repoDetails);

    this.length = parseInt(repo.files.Length.content);

    console.log(`There are ${this.length} paragraphs in this article`);

    const dom = this.initShadowDom();

    const controls = dom.getElementById("controls");
    controls.onclick = this.handleArticleSelection;
    controls.setAttribute("data-id", this.repoDetails.id);

    ReactDOM.render(<Download />, controls);
  }

  initShadowDom() {
    let shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = this.template;

    return shadowRoot;
  }

  handleArticleSelection = (e) => {
    e.target.onclick = null;

    this.toggleClass(e);
    const id = e.target.getAttribute("data-id");

    if (cart.indexOf(id) === -1) {
      cart.push(id);
    }

    console.log(cart);
  };

  handleRequest = (pointer, contentId) => {
    console.log(pointer + " this is my unique payment pointer ID");

    // Update the meta data content for the payment pointer
    document
      .querySelector("meta[name='monetization']")
      .setAttribute("content", pointer);

    let obj = array.find((obj) => obj.id === contentId);

    this.selectedContent = obj;

    const paragraph = this.getNextParagraph();

    if (paragraph) {
      var tag = document.createElement("p");

      var info = document.createTextNode(paragraph);
      //
      tag.appendChild(info);
      var element = document.createElement("div");
      element.setAttribute("class", "paragraph");
      element.appendChild(tag);
      document
        .querySelector(`#${contentId}`)
        .shadowRoot.querySelector(`#content-${contentId}`)
        .appendChild(element);
    }
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

  get template() {
    let repo = this.repoDetails;

    if (repo.message) {
      return this.style + this.cardError(repo);
    } else {
      return this.style + this.cardTemplate(repo);
    }
  }

  async getDetails() {
    /**
     * Use live GitHub Gist data
     */
    return await fetch(this.endpoint, {
      mode: "cors",
    }).then((res) => res.json());

    /**
     * Using a local copy of the data due to GitHub Gist quota limits
     */
    // return JSON.parse(
    //   `{"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027","forks_url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/forks","commits_url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/commits","id":"eba1cbef76ebe0f945afa196f9fb3027","node_id":"MDQ6R2lzdGViYTFjYmVmNzZlYmUwZjk0NWFmYTE5NmY5ZmIzMDI3","git_pull_url":"https://gist.github.com/eba1cbef76ebe0f945afa196f9fb3027.git","git_push_url":"https://gist.github.com/eba1cbef76ebe0f945afa196f9fb3027.git","html_url":"https://gist.github.com/eba1cbef76ebe0f945afa196f9fb3027","files":{"Chapter 1":{"filename":"Chapter 1","type":"text/plain","language":null,"raw_url":"https://gist.githubusercontent.com/bernardbaker/eba1cbef76ebe0f945afa196f9fb3027/raw/3e3e997ce757edd51dc7e5e6a91357d4bbf1aed7/Chapter%201","size":173,"truncated":false,"content":"Our aim is to research, design, develop and showcase a seamless solution to the 🕸️💰 experience. By demonstration of a web component and a working moneztized website."},"Chapter 2":{"filename":"Chapter 2","type":"text/plain","language":null,"raw_url":"https://gist.githubusercontent.com/bernardbaker/eba1cbef76ebe0f945afa196f9fb3027/raw/c85c317180e9fd0ebf997f0fc8e4776a13ee1587/Chapter%202","size":480,"truncated":false,"content":"Our innovations team members Bibiana @bibschan , Bernard @bernardbaker + hopefully more to come... plan on building a hybrid DTD which by default organises the DOM where HTML WM tags are handled in a united nature amongst other sibling and or parent tags. Using this new technique the web browser will ultimately handle content changes by default. We will venture into the realm of web components, take a deep dive into the HTML DTD. And marvel at what we find in the rabbit hole."},"Length":{"filename":"Length","type":"text/plain","language":null,"raw_url":"https://gist.githubusercontent.com/bernardbaker/eba1cbef76ebe0f945afa196f9fb3027/raw/d8263ee9860594d2806b0dfd1bfd17528b0ba2a4/Length","size":1,"truncated":false,"content":"2"},"Snippet":{"filename":"Snippet","type":"text/plain","language":null,"raw_url":"https://gist.githubusercontent.com/bernardbaker/eba1cbef76ebe0f945afa196f9fb3027/raw/9ac5d27682b1f8cc3aa9793fb397809403b02459/Snippet","size":435,"truncated":false,"content":"Grant for the Web is a collaboration between Mozilla, Creative Commons, and Coil. They are working towards a healthier internet, using open standards to give people more independence and control over how they distribute and monetize content. It’s a future where creators and their publishers can leverage open standards and protocols like Web Monetization instead of relying on invasive ads, paywalls, and the abuse of personal data."},"Title":{"filename":"Title","type":"text/plain","language":null,"raw_url":"https://gist.githubusercontent.com/bernardbaker/eba1cbef76ebe0f945afa196f9fb3027/raw/d6091576e0785abb12e876a7a1f7ecb6019cc609/Title","size":31,"truncated":false,"content":"News on Grant For Web Hackathon"}},"public":true,"created_at":"2020-05-17T17:21:13Z","updated_at":"2020-06-05T13:56:33Z","description":"$ilp.uphold.com/pmFKKEYKm3rk","comments":0,"user":null,"comments_url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/comments","owner":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"forks":[],"history":[{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"62e9e436681419132560440b88d8ce766a9fed3f","committed_at":"2020-06-05T13:56:33Z","change_status":{"total":2,"additions":1,"deletions":1},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/62e9e436681419132560440b88d8ce766a9fed3f"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"61f6732dd536061244164979eb171ad290e0c765","committed_at":"2020-06-05T10:21:31Z","change_status":{"total":8,"additions":4,"deletions":4},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/61f6732dd536061244164979eb171ad290e0c765"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"773886659b0a8c29fc74313dda94ef00331a3a88","committed_at":"2020-06-05T09:07:11Z","change_status":{"total":0,"additions":0,"deletions":0},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/773886659b0a8c29fc74313dda94ef00331a3a88"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"c66bd3656294161375cdf45a9defd2d6a9764d75","committed_at":"2020-06-05T08:32:22Z","change_status":{"total":0,"additions":0,"deletions":0},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/c66bd3656294161375cdf45a9defd2d6a9764d75"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"dc15d09be11af8f6272272d1201c3a89d0c3ffd3","committed_at":"2020-06-04T07:45:15Z","change_status":{"total":1,"additions":1,"deletions":0},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/dc15d09be11af8f6272272d1201c3a89d0c3ffd3"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"ffffba362d38cddf2b87c971e08fd16dcd727798","committed_at":"2020-06-04T07:35:24Z","change_status":{"total":1,"additions":1,"deletions":0},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/ffffba362d38cddf2b87c971e08fd16dcd727798"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"4a06710780795cfdbbf014055b8d61d9b5808408","committed_at":"2020-05-17T17:48:30Z","change_status":{"total":8,"additions":3,"deletions":5},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/4a06710780795cfdbbf014055b8d61d9b5808408"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"496085e2adc6e66b6222f2c5118cdec24758f742","committed_at":"2020-05-17T17:37:50Z","change_status":{"total":21,"additions":5,"deletions":16},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/496085e2adc6e66b6222f2c5118cdec24758f742"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"64f6e582242e25e63129f324d42348d01cdc37bb","committed_at":"2020-05-17T17:21:12Z","change_status":{"total":16,"additions":16,"deletions":0},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/64f6e582242e25e63129f324d42348d01cdc37bb"}],"truncated":false}`
    // );
  }

  cardError({ message }) {
    return `<div class="Card Card--error">Error: ${message}</div>`;
  }

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

  toggleClass = (e) => {
    const node = e.target.querySelector(".btn-download");
    if (node.classList.contains("downloaded")) {
      node.classList.remove("downloaded");
    } else {
      node.classList.add("downloaded");
    }
  };

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

window.customElements.define("news-article", NewsArticle);
