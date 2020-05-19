import React from "react";
import "./Download.css";

const Download = () => {
  const toggleClass = (e) => {
    console.log("clicked download");
    if (e.target.parentNode.classList.contains("downloaded")) {
      e.target.parentNode.classList.remove("downloaded");
      //   TODO remove this news item from the shopping cart
    } else {
      e.target.parentNode.classList.add("downloaded");
      //   TODO add this news item from the shopping cart
    }
  };

  return (
    <div className="btn-download" onClick={toggleClass}>
      <svg width="22px" height="16px" viewBox="0 0 22 16">
        <path
          d="M2,10 L6,13 L12.8760559,4.5959317 C14.1180021,3.0779974 16.2457925,2.62289624 18,3.5 L18,3.5 C19.8385982,4.4192991 21,6.29848669 21,8.35410197 L21,10 C21,12.7614237 18.7614237,15 16,15 L1,15"
          id="check"
        ></path>
        <polyline points="4.5 8.5 8 11 11.5 8.5" className="svg-out"></polyline>
        <path d="M8,1 L8,11" className="svg-out"></path>
      </svg>
    </div>
  );
};

export default Download;
