import React from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from './components/navbar/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import AddCategory from "./pages/categoriesWrapper/AddCategoryWrapper";
import AllCategories from "./pages/categoriesWrapper/AllCategoriesWrapper";
import AddProducts from "./pages/productsWrapper/AddProductsWrapper";
import AllProducts from "./pages/productsWrapper/AllProductsWrapper";
import SalesReport from './pages/productsWrapper/SalesReportWrapper';
import BillGenerator from './pages/BillWrapper/BillGeneratorWrapper';
import SellWrapper from './pages/BillWrapper/SellWrapper';
import InvoicePage from './components/bill/invoicePage';
import Login from './components/login/Login';

const App = () => {
  const location = useLocation();

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("userToken"); // Replace with your auth logic

  // Define routes where header/footer should not be displayed
  const noHeaderFooterRoutes = ["/bill-generate/:id", "/login"];

  // Check if the current route matches any of the no-header-footer routes
  const hideHeaderFooter = noHeaderFooterRoutes.some(route =>
    new RegExp(`^${route.replace(/:\w+/g, "[^/]+")}$`).test(location.pathname)
  );

  return (
    <>
      {!hideHeaderFooter && isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />  
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/share-product" element={isAuthenticated ? <AddCategory /> : <Navigate to="/login" />} />
        <Route path="/all-categories" element={isAuthenticated ? <AllCategories /> : <Navigate to="/login" />} />
        <Route path="/add-product" element={isAuthenticated ? <AddProducts /> : <Navigate to="/login" />} />
        <Route path="/all-products" element={isAuthenticated ? <AllProducts /> : <Navigate to="/login" />} />
        <Route path="/sales-report" element={isAuthenticated ? <SalesReport /> : <Navigate to="/login" />} />
        <Route path="/bill-generate" element={isAuthenticated ? <BillGenerator /> : <Navigate to="/login" />} />
        <Route path="/bill-generate/:id" element={isAuthenticated ? <InvoicePage /> : <Navigate to="/login" />} />
        <Route path="/quick-sale" element={isAuthenticated ? <SellWrapper /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
};

export default App;
