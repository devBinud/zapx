import React, { useEffect, useState } from "react";
import "jspdf-autotable";
import "./AllProducts.css";
import Footer from "../footer/Footer";
import { getDatabase, ref, onValue, remove, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import AllProductsFilter from "./AllProductsFilter";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa'; // Font Awesome icons
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

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;


  const handleSaveEdit = () => {
    if (!selectedProduct || !selectedProduct.id) return;

    const database = getDatabase();
    const productRef = ref(database, `mobileProducts/${selectedProduct.id}`);

    const { id, ...productData } = selectedProduct;

    update(productRef, productData)
      .then(() => {
        console.log("Product updated successfully!");
        window.$('#editProductModal').modal('hide');
        window.alert("✅ Product updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        window.alert("❌ Failed to update product.");
      });
  };



  const formatDate = (timestamp) => {
    const date = new Date(timestamp);  // This will work for "YYYY-MM-DD" format as well
    const day = String(date.getDate()).padStart(2, "0"); // Ensure day is always two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure month is always two digits (getMonth() starts at 0)
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const [filteredProducts, setFilteredProducts] = useState([]);
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
    const { minPrice, maxPrice, search, startDate, endDate } = filterCriteria;

    setLoading(true);

    const filtered = products.filter((product) => {
      const matchesSearch = search
        ? product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.company?.toLowerCase().includes(search.toLowerCase()) ||
        product.salePrice?.toString().includes(search) ||
        product.regularPrice?.toString().includes(search) ||
        (product.imei && product.imei.toLowerCase().includes(search.toLowerCase()))  // Check for IMEI here
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


  // Sort latest first (assuming higher id = newer product)
  const sortedProducts = [...filteredProducts].sort((a, b) => b.id - a.id);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);


  console.log("View Current Products :", currentProducts);

  const handleEdit = (product) => {
    setSelectedProduct(product); // Assuming you already have this state
    window.$('#editProductModal').modal('show'); // jQuery to open Bootstrap modal
  };


  const handleDelete = (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      const productRef = ref(database, `mobileProducts/${productId}`);
      remove(productRef)
        .then(() => {
          alert("Product deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          alert("Failed to delete product. Please try again.");
        });
    }
  };


  const handleView = (product) => {
    setSelectedProduct(product);
    window.$("#productModal").modal("show");
  };

  return (
    <>
      <div className="layout-page">
        <div className="content-wrapper">
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                    <h4 className="card-title mb-3">All Products <span className="badge bg-warning text-capitalize rounded-pill">Explore List</span></h4>

                  <AllProductsFilter onFilter={handleFilter} />

                  {loading ? (
                    <Loader />
                  ) : (
                    <div className="table-responsive pt-2">
                      <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                          <tr>
                            <th className="text-white fw-bold">#</th>
                            <th className="text-white fw-bold">Product Name</th>
                            <th className="text-white fw-bold">IMEI No.</th>
                            <th className="text-white fw-bold">Regular Price</th>
                            <th className="text-center fw-bold text-white ">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredProducts.length > 0 ? (
                            // Directly reverse the array to display latest first
                            [...filteredProducts] // Create a shallow copy to avoid mutating the original array
                              .reverse() // Reverse the order
                              .slice(indexOfFirstProduct, indexOfLastProduct) // Apply pagination to the reversed data
                              .map((product, index) => (
                                <tr key={product.id}>
                                  <td>{indexOfFirstProduct + index + 1}</td>
                                  <td><p style={{ textTransform: "capitalize" }}>{product.name}</p></td>
                                  <td className="font-weight-bold text-primary">{product.imei || "No IMEI"}</td>
                                  <td>₹{Number(product.regularPrice).toLocaleString('en-IN')}</td>
                                  <td>
                                    <button type="button" className="btn btn-info" onClick={() => handleView(product)}>
                                      <FaEye /> View
                                    </button>
                                    <button type="button" className="btn btn-primary mx-2" onClick={() => handleEdit(product)}>
                                      <FaEdit /> Edit
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(product.id)}>
                                      <FaTrash /> Delete
                                    </button>
                                  </td>
                                </tr>
                              ))
                          ) : (
                            <tr>
                              <td colSpan="11" style={{ textAlign: "center" }}>No products found.</td>
                            </tr>
                          )}

                        </tbody>

                      </table>
                    </div>
                  )}

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


                </div>
              </div>
            </div>
          </div>
        </div>
     {/* Product Details Modal */}
<div
  className="modal fade"
  id="productModal"
  tabIndex="-1"
  aria-labelledby="productModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content" style={{ borderRadius: '10px', border: 'none' }}>
      <div
        className="modal-header"
        style={{
          borderBottom: '1px solid rgb(230, 224, 222)',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          padding: '1rem 1.5rem',
        }}
      >
        <h5 className="modal-title" id="productModalLabel" style={{ fontWeight: '600', fontSize: '1.05rem', color: '#343a40' }}>
          Product Details
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div className="modal-body" style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', color: '#495057' }}>
        {selectedProduct ? (
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6 mb-3">
                <p>
                  <strong style={{ color: '#6c757d', textTransform: 'capitalize', letterSpacing: '1px' }}>Product Name:</strong>{' '}
                  <span className="badge bg-warning text-capitalize">{selectedProduct.name}</span>
                </p>
                <p>
                  <strong style={{ color: '#6c757d' }}>Entry Date:</strong>{' '}
                  <span className="badge bg-warning">{selectedProduct.entryDate ? formatDate(selectedProduct.entryDate) : "Not available"}</span>
                </p>
                <p>
                  <strong style={{ color: '#6c757d' }}>Regular Price:</strong>{' '}
                  <span className="badge bg-primary text-white">₹{Number(selectedProduct.regularPrice).toLocaleString('en-IN')}</span>
                </p>
                <p>
                  <strong style={{ color: '#6c757d' }}>IMEI No:</strong>{' '}
                  <span className="badge bg-success text-white" style={{ letterSpacing: '2px' }}>{selectedProduct.imei}</span>
                </p>
              </div>

              <div className="col-md-6 mb-1">
                <p>
                  <strong style={{ color: '#6c757d' }}>Box Available:</strong>{' '}
                  <span className="badge bg-warning">{selectedProduct.box ? 'Yes' : 'No'}</span>
                </p>
                <p>
                  <strong style={{ color: '#6c757d' }}>Bill Available:</strong>{' '}
                  <span className="badge bg-success text-white">{selectedProduct.bill ? 'Yes' : 'No'}</span>
                </p>
                <p>
                  <strong style={{ color: '#6c757d' }}>Seller Name:</strong>{' '}
                  <span className="badge bg-primary text-white text-capitalize">{selectedProduct.sellerName || 'No Name'}</span>
                </p>
                <p>
                  <strong style={{ color: '#6c757d' }}>Phone No:</strong>{' '}
                  <span className="badge bg-warning">{selectedProduct.sellerMobile || 'No Phone Number'}</span>
                </p>
                <p>
                  <strong style={{ color: '#6c757d' }}>Documents:</strong>{' '}
                  <span className="badge bg-warning text-capitalize">{selectedProduct.sellerIdProof || 'No documents'}</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="modal-footer" style={{ borderTop: '1px solid #dee2e6', backgroundColor: '#f8f9fa', padding: '1rem 1.5rem' }}>
        <button type="button" className="btn btn-danger" data-bs-dismiss="modal">
          Close
        </button>
      </div>
    </div>
  </div>
</div>

{/* Edit Product Modal */}
<div
  className="modal fade"
  id="editProductModal"
  tabIndex="-1"
  aria-labelledby="editProductModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog modal-dialog-centered modal-md">
    <div className="modal-content" style={{ borderRadius: '10px', border: 'none' }}>
      <div
        className="modal-header"
        style={{
          borderBottom: '1px solid #dee2e6',
          padding: '1rem 1.5rem',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
      >
        <h5 className="modal-title" id="editProductModalLabel">Edit Product</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div className="modal-body">
        <form className="forms-sample">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct?.name || ''}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Phone No</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct?.sellerMobile || ''}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, sellerMobile: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Regular Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedProduct?.regularPrice || ''}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, regularPrice: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-md-6 mb-2">
              <div className="form-group">
                <label>Seller Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct?.sellerName || ''}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, sellerName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <div className="form-group">
                <label>Change IMEI No</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedProduct?.imei || ''}
                  onChange={(e) =>
                    setSelectedProduct({ ...selectedProduct, imei: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="modal-footer" style={{ padding: '1rem 1.5rem' }}>
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
          Save Changes
        </button>
      </div>
    </div>
  </div>
</div>

      </div>
        <Footer />
    </>
  );
};

export default AllProducts;
