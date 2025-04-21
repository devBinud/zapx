import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import AllProducts from "../../components/products/AllProducts";

const CategoriesWrapper = () => {
  return (
    <>
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <AllProducts/>
      </div>
    </>
  );
};

export default CategoriesWrapper;
