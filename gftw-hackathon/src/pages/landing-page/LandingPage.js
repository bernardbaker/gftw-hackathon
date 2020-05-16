import React from "react";

const LandingPage = () => {
  const foo = async () => {
    await import("../../common/Repository");
  };
  foo();
  return (
    <>
      <h1>Hello BiBi</h1>
      <github-repo name="bernardbaker/lets-connect.xyz"></github-repo>
    </>
  );
};

export default LandingPage;
