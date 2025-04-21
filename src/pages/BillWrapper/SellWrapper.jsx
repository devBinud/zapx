import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Sell from "../../components/bill/Sell";

const SellWrapper = () => {
  return (
    <>
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <Sell/>
      </div>
    </>
  );
};

export default SellWrapper;
