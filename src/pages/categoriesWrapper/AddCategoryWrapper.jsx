import React from 'react'
import Sidebar from '../../components/sidebar/Sidebar';
import AddCategory from "../../components/categories/AddCategory";


const AddCategoryWrapper = () => {  
  return (
    <>
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <AddCategory />
      </div>
    </>
  );
}

export default AddCategoryWrapper; 
