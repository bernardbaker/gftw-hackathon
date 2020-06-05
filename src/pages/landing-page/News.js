import React from "react";
import "./News.css";

const News = () => {
  const importWebComponents = async () => {
    await import("../../common/NewsArticle");
  };
  importWebComponents();

  return (
    <>
      <section>
        <div className="column">
          <news-article id="eba1cbef76ebe0f945afa196f9fb3027"></news-article>
        </div>
        <div class="column">
          <news-article id="9719373229cdbc235ef88bb4d693d53c"></news-article>
        </div>
        <div class="column">
          <news-article id="ba9e844de1b0c6f8f8135154a8480d76"></news-article>
        </div>
      </section>
    </>
  );
};

export default News;
