import React from "react";
import ReactDOM from "react-dom";
import { array } from "./ShoppingCart";
import Download from "./Download";

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
    this.toggleClass = this.toggleClass.bind(this);
  }

  async connectedCallback() {
    //   TODO use this object for real details
    let repo = await this.getDetails();
    this.repoDetails = repo;
    console.log(repo);

    console.log(this.repoDetails);
    array.push(this.repoDetails);

    const dom = this.initShadowDom();

    const controls = dom.getElementById("controls");
    controls.onclick = this.toggleClass;

    ReactDOM.render(<Download />, controls);
  }

  initShadowDom() {
    let shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = this.template;

    return shadowRoot;
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
    // return await fetch(this.endpoint, { mode: "cors" }).then((res) =>
    //   res.json()
    // );
    return JSON.parse(
      `{"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027","forks_url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/forks","commits_url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/commits","id":"eba1cbef76ebe0f945afa196f9fb3027","node_id":"MDQ6R2lzdGViYTFjYmVmNzZlYmUwZjk0NWFmYTE5NmY5ZmIzMDI3","git_pull_url":"https://gist.github.com/eba1cbef76ebe0f945afa196f9fb3027.git","git_push_url":"https://gist.github.com/eba1cbef76ebe0f945afa196f9fb3027.git","html_url":"https://gist.github.com/eba1cbef76ebe0f945afa196f9fb3027","files":{"Chapter 1":{"filename":"Chapter 1","type":"text/plain","language":null,"raw_url":"https://gist.githubusercontent.com/bernardbaker/eba1cbef76ebe0f945afa196f9fb3027/raw/4c571dd1c7e353b8c698b71950e1d25009478a33/Chapter%201","size":684,"truncated":false,"content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porta ante a tincidunt molestie. Maecenas dolor justo, semper sed venenatis in, condimentum quis est. Vestibulum mollis purus non nibh laoreet, at venenatis massa tincidunt. Quisque vel augue faucibus augue pellentesque fringilla. Curabitur vehicula magna nec maximus aliquam. Nam tellus quam, laoreet ac imperdiet eu, tristique ut leo. Donec tincidunt vel nibh sed molestie. Ut vitae tortor elit. Praesent aliquam elit id diam varius, et facilisis mi egestas. Nam rutrum, nulla ut commodo accumsan, felis ligula egestas eros, eu ullamcorper enim justo in leo. Sed ipsum nisl, mollis non erat ut, faucibus fringilla leo. "},"Chapter 2":{"filename":"Chapter 2","type":"text/plain","language":null,"raw_url":"https://gist.githubusercontent.com/bernardbaker/eba1cbef76ebe0f945afa196f9fb3027/raw/4c571dd1c7e353b8c698b71950e1d25009478a33/Chapter%202","size":684,"truncated":false,"content":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin porta ante a tincidunt molestie. Maecenas dolor justo, semper sed venenatis in, condimentum quis est. Vestibulum mollis purus non nibh laoreet, at venenatis massa tincidunt. Quisque vel augue faucibus augue pellentesque fringilla. Curabitur vehicula magna nec maximus aliquam. Nam tellus quam, laoreet ac imperdiet eu, tristique ut leo. Donec tincidunt vel nibh sed molestie. Ut vitae tortor elit. Praesent aliquam elit id diam varius, et facilisis mi egestas. Nam rutrum, nulla ut commodo accumsan, felis ligula egestas eros, eu ullamcorper enim justo in leo. Sed ipsum nisl, mollis non erat ut, faucibus fringilla leo. "},"Title":{"filename":"Title","type":"text/plain","language":null,"raw_url":"https://gist.githubusercontent.com/bernardbaker/eba1cbef76ebe0f945afa196f9fb3027/raw/9cf0c7ade37ad9cb6070ac7138b1a6efb95ee24f/Title","size":16,"truncated":false,"content":"News Story Title"}},"public":true,"created_at":"2020-05-17T17:21:13Z","updated_at":"2020-05-17T17:48:31Z","description":"0987654321","comments":0,"user":null,"comments_url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/comments","owner":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"forks":[],"history":[{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"4a06710780795cfdbbf014055b8d61d9b5808408","committed_at":"2020-05-17T17:48:30Z","change_status":{"total":8,"additions":3,"deletions":5},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/4a06710780795cfdbbf014055b8d61d9b5808408"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"496085e2adc6e66b6222f2c5118cdec24758f742","committed_at":"2020-05-17T17:37:50Z","change_status":{"total":21,"additions":5,"deletions":16},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/496085e2adc6e66b6222f2c5118cdec24758f742"},{"user":{"login":"bernardbaker","id":13556172,"node_id":"MDQ6VXNlcjEzNTU2MTcy","avatar_url":"https://avatars2.githubusercontent.com/u/13556172?v=4","gravatar_id":"","url":"https://api.github.com/users/bernardbaker","html_url":"https://github.com/bernardbaker","followers_url":"https://api.github.com/users/bernardbaker/followers","following_url":"https://api.github.com/users/bernardbaker/following{/other_user}","gists_url":"https://api.github.com/users/bernardbaker/gists{/gist_id}","starred_url":"https://api.github.com/users/bernardbaker/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bernardbaker/subscriptions","organizations_url":"https://api.github.com/users/bernardbaker/orgs","repos_url":"https://api.github.com/users/bernardbaker/repos","events_url":"https://api.github.com/users/bernardbaker/events{/privacy}","received_events_url":"https://api.github.com/users/bernardbaker/received_events","type":"User","site_admin":false},"version":"64f6e582242e25e63129f324d42348d01cdc37bb","committed_at":"2020-05-17T17:21:12Z","change_status":{"total":16,"additions":16,"deletions":0},"url":"https://api.github.com/gists/eba1cbef76ebe0f945afa196f9fb3027/64f6e582242e25e63129f324d42348d01cdc37bb"}],"truncated":false}`
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
          <div id="controls"></div>
          <br><br>
          <blockquote>${files["Chapter 1"].content}</blockquote>
          <br><br>
          <button id="showContentButton" onClick="document.activeElement.handleRequest('${id}')">Unlock Content</button>
        </header>
        <section id="content-${id}" class="content"></section>
      </div>
    `;
  }

  toggleClass = (e) => {
    const node = e.target.querySelector(".btn-download");
    if (node.classList.contains("downloaded")) {
      node.classList.remove("downloaded");
      //   TODO remove this news item from the shopping cart
    } else {
      node.classList.add("downloaded");
      //   TODO add this news item from the shopping cart
    }
  };
}

window.customElements.define("news-article", NewsArticle);
