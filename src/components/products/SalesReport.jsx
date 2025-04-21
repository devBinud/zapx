import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import SearchFilter from "../products/SearchFilter";
import Footer from "../footer/Footer";
import Loader from "../loader/Loader";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArDqtcSmGsHreF89UWHVxsiivO9vZr8E8",
  authDomain: "iconnect-58f0b.firebaseapp.com",
  databaseURL: "https://iconnect-58f0b-default-rtdb.firebaseio.com",
  projectId: "iconnect-58f0b",
  storageBucket: "iconnect-58f0b.firebasestorage.app",
  messagingSenderId: "343564096721",
  appId: "1:343564096721:web:70c585e32e2679f5c1e1f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const SalesReport = () => {
  const [bills, setBills] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);

  const productsPerPage = 6;

  useEffect(() => {
    setLoading(true);
    const productsRef = ref(database, "bills");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.entries(data).map(([id, product]) => ({
          id,
          ...product,
        }));
        setBills(productsArray);
        setFilteredProducts(productsArray);
      } else {
        setBills([]);
        setFilteredProducts([]);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Calculate total sales
    const total = bills.reduce((sum, bill) => {
      return (
        sum +
        bill.products.reduce(
          (productSum, product) =>
            productSum + product.salePrice * product.quantity,
          0
        )
      );
    }, 0);
    setTotalSales(total);
  }, [bills]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const today = new Date();
  const formattedToday = today.toLocaleDateString("en-IN");

  const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN");
  };

  // Format the amount in Indian currency format
  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  // Calculate today's sales
  const todaySales = bills.reduce((sum, bill) => {
    const billDate = new Date(bill.timestamp);
    const isToday = billDate.toLocaleDateString("en-IN") === formattedToday;

    if (isToday) {
      return (
        sum +
        bill.products.reduce(
          (productSum, product) =>
            productSum + product.salePrice * product.quantity,
          0
        )
      );
    }
    return sum;
  }, 0);

  return (
    <>
      <div className="layout-page">
        <div className="content-wrapper">
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
  <h4 className="d-flex align-items-center">
    <span>Sales Report</span>
    <span className="badge bg-warning text-dark text-lowercase rounded-pill ms-2 d-flex align-items-center gap-1">
      <i className="bx bxs-file-earmark-text"></i> Track Your Success
    </span>
  </h4>

  {/* Sales Data with Badge */}
  <div className="text-end">
    <span className="badge bg-success text-white fs-5 fw-bold py-3 px-4">
      Total Sales: {formatCurrency(totalSales)}
    </span>
  </div>
</div>



                  
                  {/* Table */}
                  {loading ? (
                    <Loader/>
                  ) : (
                    <>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered table-hover">
                          <thead className="table bg-dark">
                            <tr>
                              <th className="text-white fw-bold">Bill ID</th>
                              <th className="text-white fw-bold">Customer Name</th>
                              <th className="text-white fw-bold">Products</th>
                              <th className="text-white fw-bold">Price (₹)</th>
                              <th className="text-white fw-bold">Quantity</th>
                              <th className="text-white fw-bold">Total (₹)</th>
                              <th className="text-white fw-bold">Timestamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProducts.length > 0 ? (
                              filteredProducts
                                .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
                                .map((bill) =>
                                  bill.products.map((product, index) => (
                                    <tr key={`${bill.id}-${index}`}>
                                      {index === 0 && (
                                        <td rowSpan={bill.products.length}>
                                          ZAPX{bill.id}
                                        </td>
                                      )}
                                      {index === 0 && (
                                        <td rowSpan={bill.products.length}>
                                          {bill.customerDetails.name || "Unknown"}
                                        </td>
                                      )}
                                      <td>{product.name}</td>
                                      <td>{formatCurrency(product.salePrice)}</td>
                                      <td>{product.quantity}</td>
                                      <td>
                                        {formatCurrency(
                                          product.salePrice * product.quantity
                                        )}
                                      </td>
                                      <td>{getFormattedDate(bill.timestamp)}</td>
                                    </tr>
                                  ))
                                )
                            ) : (
                              <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                  No bills found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Logic */}
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                          className="btn btn-outline-primary"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          <i className="bx bx-arrow mr-2"></i> Previous
                        </button>

                        <strong>Page {currentPage} of {totalPages}</strong>

                        <button
                          className="btn btn-outline-primary"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next <i className="fas fa-arrow-right ml-2"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default SalesReport;
