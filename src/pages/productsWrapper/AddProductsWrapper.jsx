import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import AddProducts from "../../components/products/AddProducts";

const ProductsWrapper = () => {
  return (
    <>
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <AddProducts/>
      </div>
    </>
  );
};

export default ProductsWrapper;
