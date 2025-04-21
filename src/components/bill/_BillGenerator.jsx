import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../products/SearchFilter";
import Footer from "../footer/Footer";
import "./Sell.css";
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

const BillGenerator = () => {
  const [bills, setBills] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  console.log("BILLS :", bills);

  const navigate = useNavigate(); // Use navigate hook
  const productsPerPage = 10;

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

  const handleGenerateInvoice = (billId) => {
    navigate(`/bill-generate/${billId}`);
  };

  useEffect(() => {
    const handleFocus = () => {
      window.location.reload(); // Refresh the page
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);


  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-5">Generate E-bill <span className="badge badge-warning">Instant</span><span className="badge badge-success mx-2">Accurate</span><span className="badge badge-warning">Paperless</span></h4>
                  <SearchFilter onFilter={() => { }} />
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Generate Invoice</th>
                              <th>ID</th>
                              <th>Customer Name</th>
                              <th>Phone No</th>
                              <th>Address</th>
                              <th>Phones</th>
                              <th>Company</th>
                              <th>Price</th>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bills.length > 0 ? (
                              bills.map((bill) =>
                                bill.products.map((product, index) => (
                                  <tr key={product.id}>
                                    {index === 0 && (
                                      <>
                                        <td rowSpan={bill.products.length}>
                                          <button
                                            onClick={() => handleGenerateInvoice(bill.id)}
                                            className="btn btn-outline-success"
                                          >
                                            Generate Invoice
                                          </button>
                                        </td>
                                        <td rowSpan={bill.products.length}>
                                          {bill.id}
                                        </td>
                                        <td rowSpan={bill.products.length}>
                                          {bill.customerDetails?.name}
                                        </td>
                                        <td rowSpan={bill.products.length}>
                                          {bill.customerDetails?.contact}
                                        </td>
                                        <td rowSpan={bill.products.length}>
                                          {bill.customerDetails?.address}
                                        </td>
                                      </>
                                    )}
                                    <td>{product.name}</td>
                                    <td>{product.company}</td>
                                    <td>₹{product.salePrice}</td>
                                    <td>{product.quantity}</td>
                                  </tr>
                                ))
                              )
                            ) : (
                              <tr>
                                <td colSpan="8" style={{ textAlign: "center" }}>
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
                          <i className="fas fa-arrow-left mr-2"></i> Previous
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
        <Footer />
      </div>
    </>
  );
};

export default BillGenerator;
