import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import BillGenerator from "../../components/bill/BillGenerator";

const BillGeneratorWrapper = () => {
  return (
    <>
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <BillGenerator/>
      </div>
    </>
  );
};

export default BillGeneratorWrapper;
