import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import SalesReport from "../../components/products/SalesReport";

const SalesReportWrapper = () => {
  return (
    <>
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <SalesReport/>
      </div>
    </>
  );
};

export default SalesReportWrapper;
