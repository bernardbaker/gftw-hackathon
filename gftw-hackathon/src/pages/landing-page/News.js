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
        <div class="column">
          <news-article id="eba1cbef76ebe0f945afa196f9fb3027"></news-article>
          {/* <news-article id="9719373229cdbc235ef88bb4d693d53c"></news-article>
          <news-article id="eba1cbef76ebe0f945afa196f9fb3027"></news-article>
          <news-article id="9719373229cdbc235ef88bb4d693d53c"></news-article> */}
        </div>
        {/* <div class="column">
          <news-article id="9719373229cdbc235ef88bb4d693d53c"></news-article>
        </div>
        <div class="column">
          <news-article id="9719373229cdbc235ef88bb4d693d53c"></news-article>
          <news-article id="eba1cbef76ebe0f945afa196f9fb3027"></news-article>
        </div> */}
      </section>
    </>
  );
};

export default News;
