import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import SearchFilter from "../products/SearchFilter";
import Footer from "../footer/Footer";
import "./Sell.css";
import Loader from "../loader/Loader";
import "./BillGenerator.css";

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
  const [loading, setLoading] = useState(false);

  console.log("List of Bills : " ,bills)


  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const navigate = useNavigate(); // Use navigate hook

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

  const handleViewDetails = (bill) => {
    setSelectedBill(bill);
    setShowModal(true);
  };



  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <div className="layout-page">
        <div className="content-wrapper">
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                <div className="mb-4 text-center">
  <h3 className="fw-bold text-uppercase text-primary">Generate E-Bill</h3>
  <p className="mt-2 fs-6 text-muted">
    <span className="px-3 text-warning fw-semibold">Instant</span> | 
    <span className="px-3 text-success fw-semibold">Accurate</span> | 
    <span className="px-3 text-danger fw-semibold">Paperless</span>
  </p>
</div>

                  <SearchFilter onFilter={() => { }} />
                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered">
                        <thead className="bg-dark text-white">
  <tr>
    <th className="text-center text-white">Generate Invoice</th>
    <th className="text-white text-center">Product Name / Company</th>
    <th className="text-center text-white">Price</th>
    <th className="text-center text-white">Quantity</th>
  </tr>
</thead>

                          <tbody>
                            {filteredProducts.length > 0 ? (
                              [...filteredProducts]
                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Sort bills by timestamp
                                .slice(indexOfFirstProduct, indexOfLastProduct) // Slice bills, not products
                                .map((bill) => (
                                  bill.products.map((product, index) => (
                                    <tr key={`${bill.id}-${index}`}>
                                      {index === 0 && (
                                      <td rowSpan={bill.products.length}>
                                      <div className="d-flex flex-column gap-2">
                                        <button
                                          onClick={() => handleGenerateInvoice(bill.id)}
                                          className="btn btn-success"
                                        >
                                          <i className="bx bx-download me-2"></i> Generate Invoice
                                        </button>
                                        <button
                                          onClick={() => handleViewDetails(bill)}
                                          className="btn btn-warning text-dark mt-2"
                                          style={{
                                            borderRadius: '20px',
                                            padding: '5px 10px',
                                            fontSize: '14px',
                                          }}
                                        >
                                          <i className="bx bx-eye me-2"></i> View Details
                                        </button>
                                      </div>
                                    </td>
                                    
                                      )}

<td>
  {product.name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())} 
  <span className="badge bg-warning text-dark rounded-pill me-2">
    {product.company}
  </span>
</td>
<td>₹{Number(product.regularPrice).toLocaleString('en-IN')}</td>
                                      <td>{product.quantity}</td>
                                    </tr>
                                  ))
                                ))
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

        {showModal && selectedBill && (
  <div className="custom-modal-overlay">
    <div className="custom-modal">
      <div className="custom-modal-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">🧾 Bill Details</h4>
        <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
      </div>

      <div className="custom-modal-body">
        <p><strong>Bill ID:</strong> <span className="px-2 py-1 rounded bg-warning text-dark ms-2">{selectedBill.id}</span></p>
        <p><strong>Date:</strong> {new Date(selectedBill.timestamp).toLocaleString()}</p>

        {selectedBill.customerDetails && (
          <>
            <p><strong>Customer:</strong> <span className="px-2 py-1 rounded bg-info text-white ms-2">{selectedBill.customerDetails.name}</span></p>
            <p><strong>Contact:</strong> <span className="px-2 py-1 rounded bg-success text-white ms-2">+91{selectedBill.customerDetails.contact}</span></p>
            <p><strong>Address:</strong> {selectedBill.customerDetails.address}</p>
          </>
        )}

        <p>
          <strong>Warranty:</strong>{" "}
          {selectedBill.warrantyAvailable ? (
            `${selectedBill.warrantyAvailable} ${selectedBill.warrantyDuration}`
          ) : (
            <span className="px-2 py-1 rounded bg-danger text-white ms-2">No Warranty</span>
          )}
        </p>

        <hr />

        <div className="product-list mt-3">
          <h5 className="mb-3">🛒 Products</h5>
          <div className="table-responsive">
            <table className="table table-sm table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>IMEI</th>
                </tr>
              </thead>
              <tbody>
                {selectedBill.products.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{p.name}</td>
                    <td>₹{p.regularPrice}</td>
                    <td>{p.quantity}</td>
                    <td>
                      {p.imei ? (
                        p.imei
                      ) : (
                        <span className="px-2 py-1 rounded bg-secondary text-white">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="custom-modal-footer d-flex justify-content-end">
        <button className="btn btn-outline-danger" onClick={() => setShowModal(false)}>Close</button>
      </div>
    </div>
  </div>
)}


      </div>
        <Footer />

    </>
  );
};

export default BillGenerator;
