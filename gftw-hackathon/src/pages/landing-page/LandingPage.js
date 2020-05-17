import React from "react";

const LandingPage = () => {
  const foo = async () => {
    await import("../../common/Repository");
  };
  foo();

  return (
    <>
      <p></p>
      <github-repo name="bernardbaker/lets-connect.xyz"></github-repo>
      <github-repo name="bibschan/drag-drop-project"></github-repo>
      <github-repo name="bernardbaker/visualising-geo-data-on-google-maps"></github-repo>
      <github-repo name="bibschan/react-and-typescript-app"></github-repo>
      <github-repo name="bernardbaker/beta.api.electron.react.app"></github-repo>
      <github-repo name="bibschan/ruby-stickies-app"></github-repo>
      <github-repo name="bernardbaker/oddschecker.betting.slip"></github-repo>
      <github-repo name="bibschan/BCIT-java-project"></github-repo>
    </>
  );
};

export default LandingPage;
