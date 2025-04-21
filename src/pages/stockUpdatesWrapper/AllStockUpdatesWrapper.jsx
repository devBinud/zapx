import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import StockUpdates from "../../components/stockUpdates/StockUpdates";

const CategoriesWrapper = () => {
  return (
    <>
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <StockUpdates />
      </div>
    </>
  );
};

export default CategoriesWrapper;
