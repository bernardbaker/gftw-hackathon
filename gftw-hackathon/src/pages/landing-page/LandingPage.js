import React from "react";

const LandingPage = () => {
  const importWebComponents = async () => {
    await import("../../common/NewsArticle");
  };
  importWebComponents();

  return (
    <>
      <news-article id="eba1cbef76ebe0f945afa196f9fb3027"></news-article>
    </>
  );
};

export default LandingPage;
