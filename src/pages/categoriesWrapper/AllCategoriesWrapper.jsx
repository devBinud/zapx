import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import AllCategories from "../../components/categories/AllCategories";

const AllCategoriesWrapper = () => {
  return (
    <>
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <AllCategories />
      </div>
    </>
  );
};

export default AllCategoriesWrapper;
