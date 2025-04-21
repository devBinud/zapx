import React, { useEffect, useState } from "react";
import "jspdf-autotable";
import Footer from "../footer/Footer";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { initializeApp } from "firebase/app";
import SearchFilter from "../products/SearchFilter";
import "./Sell.css";
import Loader from "../loader/Loader";

import { useNavigate } from "react-router-dom";

import { FaCheckCircle } from 'react-icons/fa';


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

const Sell = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    contact: "",
    address: "",
    warrantyAvailable: "No",
    warrantyDuration: "",
  });
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate(); // for redirection


  const productsPerPage = 10;

 

  useEffect(() => {
    setLoading(true);
    const productsRef = ref(database, "mobileProducts");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productsArray = Object.entries(data).map(([id, product]) => ({
          id,
          ...product,
        }));
        setProducts(productsArray);
        setFilteredProducts(productsArray);
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
      setLoading(false);
    });
  }, []);

  const handleFilter = (filterCriteria) => {
    const { company, minPrice, maxPrice, search, startDate, endDate } =
      filterCriteria;

    setLoading(true);

    const filtered = products.filter((product) => {
      const matchesCompany = company
        ? product.company?.toLowerCase().includes(company.toLowerCase())
        : true;

      const matchesSearch = search
        ? product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.company?.toLowerCase().includes(search.toLowerCase()) ||
        product.salePrice?.toString().includes(search) ||
        product.regularPrice?.toString().includes(search)
        : true;

      const matchesMinPrice = minPrice ? product.salePrice >= minPrice : true;
      const matchesMaxPrice = maxPrice ? product.salePrice <= maxPrice : true;

      const matchesStartDate = startDate
        ? new Date(product.timestamp) >= new Date(startDate)
        : true;

      const matchesEndDate = endDate
        ? new Date(product.timestamp) <= new Date(endDate)
        : true;

      return (
        matchesCompany &&
        matchesSearch &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesStartDate &&
        matchesEndDate
      );
    });

    setFilteredProducts(filtered);
    setLoading(false);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveBillData = () => {
    const selectedProductDetails = filteredProducts.filter((product) =>
      selectedProducts.includes(product.id)
    );

    if (!selectedProductDetails.length) {
      alert("No products selected for billing.");
      return;
    }

    if (!customerDetails.name || !customerDetails.contact || !customerDetails.address) {
      alert("Please fill in customer details.");
      return;
    }

    const billData = {
      customerDetails,
      products: selectedProductDetails.map((product) => ({
        ...product,
        quantity: quantities[product.id] || 1,
      })),
      timestamp: new Date().toISOString(),
    };

    const newBillRef = ref(database, `bills/${Date.now()}`);
    set(newBillRef, billData)
      .then(() => {
        setShowSuccessModal(true); // Show modal instead of alert
        setSelectedProducts([]);
        setQuantities({});
        setCustomerDetails({ name: "", contact: "", address: "", warrantyAvailable: "No", warrantyDuration: "" });
      })
      .catch((error) => {
        console.error("Error saving bill data:", error);
        alert("Failed to save bill data. Please try again.");
      });
  };


  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <div className="layout-page">
        <div className="content-wrapper">
          <div className="row">
            <div className="col-lg-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-4 text-capitalize d-flex align-items-center gap-2">
                    Product Sale
                    <span className="badge bg-label-info rounded-pill px-3 py-1 text-capitalize">
                      <i className="bx bx-save me-1"></i> Save Bill
                    </span>
                  </h4>


                  <SearchFilter onFilter={handleFilter} />

                  {loading ? (
                    <Loader />
                  ) : (
                    <>
                      <div className="table-responsive pt-3">
                        <table className="table table-bordered">
                          <thead className="bg-dark text-white">
                            <tr>
                              <th className="text-white fw-bold">Select Phone</th>
                              {/* <th>Sl No</th> */}
                              <th className="text-white fw-bold">Product Name</th>
                              <th className="text-white fw-bold">Company</th>
                              <th className="text-white fw-bold">Sale Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentProducts.length > 0 ? (
                              currentProducts.map((product, index) => {
                                const isSelected = selectedProducts.includes(product.id);
                                return (
                                  <tr
                                    key={product.id}
                                    className={isSelected ? "table-active selected-row" : ""}
                                  >
                                    <td className="align-middle">
                                      <button
                                        onClick={() => handleSelectProduct(product.id)}
                                        className={`btn btn-sm ${isSelected ? "btn-outline-danger" : "btn-outline-success"} d-flex align-items-center gap-1`}
                                      >
                                        <i className={`bx ${isSelected ? "bx-x" : "bx-check"}`}></i>
                                        {isSelected ? "Deselect" : "Select"}
                                      </button>
                                    </td>

                                    <td className="align-middle">
                                      <div style={{ textTransform: "capitalize", fontWeight: "500" }}>
                                        {index + 1}. {product.name.toLowerCase()}
                                      </div>
                                      <span className="badge bg-label-warning mt-1">
                                        <i className="bx bx-barcode me-1"></i> {product.imei}
                                      </span>
                                    </td>

                                    <td>{product.company}</td>
                                    <td>₹{Number(product.regularPrice).toLocaleString("en-IN")}</td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                  No products found.
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
            <div className="col-lg-6">

              {selectedProducts.length > 0 && (
                <div className="row">
                  {/* Selected Products Table */}
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="mb-4">
                          Create E-Bill
                          <span className="badge bg-label-info rounded-pill px-3 py-1 text-capitalize ms-2">
                            Selected Products
                          </span>
                        </h5>
                        <table className="table table-bordered table-sm">
                          <thead className="thead-light">
                            <tr>
                              <th className="py-2">Product & IMEI</th>
                              <th className="py-2">Price</th>
                              <th className="text-center py-2">Qty</th>
                              <th className="py-2">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedProducts.map((productId, index) => {
                              const product = filteredProducts.find((product) => product.id === productId);
                              const quantity = quantities[productId] || 1;
                              const subtotal = product.regularPrice * quantity;

                              return (
                                <tr key={productId}>
                                  {/* Product Name and IMEI */}
                                  <td>
                                    <span className="text-capitalize fw-medium">
                                      {index + 1}. {product.name.toLowerCase()}
                                    </span>
                                    <br />
                                    <span className="badge bg-label-warning mt-2">
                                      <i className="bx bx-barcode-reader me-1"></i>
                                      {product.imei}
                                    </span>
                                  </td>

                                  {/* Price */}
                                  <td className="fw-bold text-primary">
                                    ₹{Number(product.regularPrice).toLocaleString("en-IN")}
                                  </td>

                                  {/* Quantity Input */}
                                  <td className="align-middle" style={{ minWidth: "140px" }}>
                                    <div className="input-group input-group-sm">
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => handleQuantityChange(productId, Math.max(1, quantity - 1))}
                                      >
                                        <i className="bx bx-minus"></i>
                                      </button>
                                      <input
                                        type="number"
                                        className="form-control text-center border-start-0 border-end-0"
                                        value={quantity}
                                        min="1"
                                        onChange={(e) => handleQuantityChange(productId, parseInt(e.target.value) || 1)}
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => handleQuantityChange(productId, quantity + 1)}
                                      >
                                        <i className="bx bx-plus"></i>
                                      </button>
                                    </div>
                                  </td>


                                  {/* Subtotal */}
                                  <td>
                                    <span className="badge bg-label-success fw-bold">
                                      ₹{Number(subtotal).toLocaleString("en-IN")}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>

                          {/* Final Total */}
                          <tfoot>
                            <tr className="bg-light">
                              <td colSpan="3" className="text-end pe-3 py-3">
                                <strong style={{ fontSize: "1rem" }}>Final Price:</strong>
                              </td>
                              <td className="py-3">
                                <span className="badge bg-success text-white fw-bold" style={{ fontSize: "1rem" }}>
                                  ₹{
                                    selectedProducts.reduce((total, productId) => {
                                      const product = filteredProducts.find(p => p.id === productId);
                                      const qty = quantities[productId] || 1;
                                      return total + (product.regularPrice * qty);
                                    }, 0).toLocaleString("en-IN")
                                  }
                                </span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>


                      </div>
                    </div>
                  </div>

                  {/* Customer Details Form */}
                  <div className="col-md-12 mt-3">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="mb-4">
                          Customer Details
                          <span className="badge bg-label-info rounded-pill px-3 py-1 text-capitalize ms-2">
                            Fillup all details
                          </span>
                        </h5>
                        {/* Full Name (Customer Name) */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="customer-name">Customer Name</label>
                          <div className="input-group input-group-merge">
                            <span className="input-group-text" id="icon-customer-name">
                              <i className="bx bx-user"></i>
                            </span>
                            <input
                              type="text"
                              id="customer-name"
                              name="name"
                              placeholder="John Doe"
                              className="form-control"
                              aria-label="Customer Name"
                              aria-describedby="icon-customer-name"
                              value={customerDetails.name}
                              onChange={handleCustomerInputChange}
                            />
                          </div>
                        </div>

                        {/* Contact Number */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="contact-number">Contact Number</label>
                          <div className="input-group input-group-merge">
                            <span className="input-group-text" id="icon-contact-number">
                              <i className="bx bx-phone"></i>
                            </span>
                            <input
                              type="text"
                              id="contact-number"
                              name="contact"
                              placeholder="+91 XXXXXXXXXX"
                              className="form-control"
                              aria-label="Contact Number"
                              aria-describedby="icon-contact-number"
                              value={customerDetails.contact}
                              onChange={handleCustomerInputChange}
                            />
                          </div>
                        </div>

                        {/* Address */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="customer-address">Address</label>
                          <div className="input-group input-group-merge">
                            <span className="input-group-text" id="icon-customer-address">
                              <i className="bx bx-home"></i>
                            </span>
                            <textarea
                              id="customer-address"
                              name="address"
                              className="form-control"
                              placeholder="Enter address here..."
                              aria-label="Address"
                              aria-describedby="icon-customer-address"
                              value={customerDetails.address}
                              onChange={handleCustomerInputChange}
                            ></textarea>
                          </div>
                        </div>

                        {/* Warranty Available */}
                        <div className="mb-3">
                          <label className="form-label" htmlFor="warranty-status">Warranty Available?</label>
                          <div className="input-group input-group-merge">
                            <span className="input-group-text" id="icon-warranty-status">
                              <i className="bx bx-check-shield"></i>
                            </span>
                            <select
                              id="warranty-status"
                              name="warrantyAvailable"
                              className="form-select"
                              value={customerDetails.warrantyAvailable}
                              onChange={handleCustomerInputChange}
                              aria-describedby="icon-warranty-status"
                            >
                              <option value="No">Warranty Available?</option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>
                            </select>
                          </div>
                        </div>

                        {/* Warranty Duration (conditional) */}
                        {customerDetails.warrantyAvailable === "Yes" && (
                          <div className="mb-3">
                            <label className="form-label" htmlFor="warranty-duration">Warranty Duration</label>
                            <div className="input-group input-group-merge">
                              <span className="input-group-text" id="icon-warranty-duration">
                                <i className="bx bx-time"></i>
                              </span>
                              <input
                                type="text"
                                id="warranty-duration"
                                name="warrantyDuration"
                                className="form-control"
                                placeholder="e.g., 6 months, 1 year"
                                aria-label="Warranty Duration"
                                aria-describedby="icon-warranty-duration"
                                value={customerDetails.warrantyDuration}
                                onChange={handleCustomerInputChange}
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={saveBillData}
                          className="btn btn-primary mt-2 w-100"
                        >
                          Save Bill Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        
        {showSuccessModal && (
  <div
    className={`modal fade ${showSuccessModal ? 'show' : ''}`} 
    id="modalCenter" 
    tabIndex="-1" 
    aria-hidden="true" 
    style={{ display: showSuccessModal ? 'block' : 'none' }}  // Control display of modal
  >
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSuccessModal(false)} // Close modal
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body text-center">
  {/* Animated Success Icon */}
  <FaCheckCircle 
    className="text-success mb-3 animated-zoom" 
    style={{ fontSize: '50px' }} // Adjust size as needed
  />
 <h5 className="text-dark mb-3" style={{ letterSpacing: '1px', fontSize: '20px', fontWeight: '600' }}>
  Bill Generated Successfully!
</h5>

<button
        className="btn btn-primary mt-3"
        onClick={() => {
          setShowSuccessModal(false); // Close the modal
          navigate('/bill-generate'); // Navigate to /bill-generate
        }}
      >
        Generate Invoice Now
      </button>
</div>

      </div>
    </div>
  </div>
)}





      </div>

    </>
  );
};

export default Sell;
