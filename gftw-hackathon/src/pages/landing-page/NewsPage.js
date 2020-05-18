import React from "react";
import "./NewsPage.css";

const NewsPage = () => {
  return (
    <div id="parent-div">
      <div class="flex-grid" id="top">
        <h1>GFTW HACKATHON</h1>
      </div>
      <div class="flex-grid">
        <div class="col">
          <news-article id="eba1cbef76ebe0f945afa196f9fb3027"></news-article>
        </div>
        <div class="col">
          <news-article id="9719373229cdbc235ef88bb4d693d53c"></news-article>
        </div>
        <div class="col"></div>
      </div>
      <div class="flex-grid">
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
      </div>
    </div>
  );
};

export default NewsPage;
