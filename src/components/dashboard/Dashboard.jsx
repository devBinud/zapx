import React from 'react'
import Sidebar from '../sidebar/Sidebar';
import Main from '../main/Main';

const Dashboard = () => {
  return (
    <>
       <div class="layout-wrapper layout-content-navbar">
       <div class="layout-container">
         <Sidebar/>
         <Main/>
      </div>
      </div>
    </>
  );
}

export default Dashboard
