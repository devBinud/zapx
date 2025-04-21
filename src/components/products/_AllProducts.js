import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Footer from "../footer/Footer";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { initializeApp } from "firebase/app";
import AllProductsFilter from "./AllProductsFilter";

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

const formatDate = (timestamp) => {
  const date = new Date(timestamp);  // This will work for "YYYY-MM-DD" format as well
  const day = String(date.getDate()).padStart(2, "0"); // Ensure day is always two digits
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure month is always two digits (getMonth() starts at 0)
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("PRODUCTS API :", products);

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

  const exportAsPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 49, 49);
    doc.text("i", 14, 20);
    doc.setTextColor(0, 74, 173);
    const iWidth = doc.getTextWidth("i");
    doc.text("Connect", 14 + iWidth, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(169, 169, 169);
    doc.text("Your trusted source for iPhone", 14, 30);

    doc.text("BK Kakoty Road, Near Ulubari Bridge", 14, 45);
    doc.text("Guwahati, Assam", 14, 50);
    doc.text("PIN - 781007", 14, 55);

    let yPosition = 65;

    const columns = [
      { title: "#", dataKey: "index" },
      { title: "Product Name", dataKey: "name" },
      { title: "Company", dataKey: "company" },
      { title: "Regular Price", dataKey: "regularPrice" },
      { title: "Sale Price", dataKey: "salePrice" },
      { title: "Entry Date", dataKey: "entryDate" },
      { title: "Sale Status", dataKey: "status" },
      { title: "Bill", dataKey: "bill" },
      { title: "Box", dataKey: "box" },
      { title: "Seller ID Proof", dataKey: "sellerIdProof" },
      { title: "IMEI No.", dataKey: "imei" },  // Added IMEI column
    ];

    const rows = filteredProducts.map((product, index) => ({
      index: index + 1,
      name: product.name,
      company: product.company,
      regularPrice: `$${product.regularPrice}`,
      salePrice: `$${product.salePrice}`,
      entryDate: formatDate(product.timestamp),
      status: product.status,
      bill: product.bill || "No documents",
      box: product.box || "No documents",
      sellerIdProof: product.sellerIdProof || "No documents",
      imei: product.imei || "No IMEI",  // Handle missing IMEI
    }));

    doc.setFont("helvetica", "normal");
    doc.autoTable(columns, rows, {
      startY: yPosition,
      styles: {
        fontSize: 10,
        cellPadding: 5,
        halign: "center",
        valign: "middle",
        lineColor: [221, 221, 221],
        lineWidth: 0.5,
        textColor: [64, 60, 69],
      },
      headStyles: {
        fillColor: [0, 74, 173],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [255, 255, 250],
      },
      theme: "grid",
    });

    doc.save("products.pdf");
  };

  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-5 text-uppercase">All Products</h4>

                  <AllProductsFilter onFilter={handleFilter} />

                  {loading ? (
                    <div className="loader">Loading...</div>
                  ) : (
                    <div className="table-responsive pt-3">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>IMEI No</th>
                            <th>Regular Price</th>
                            {/* <th>Entry Date</th>
                            <th>Bill</th>
                            <th>Box</th>
                            <th>Seller Name</th>
                            <th>Seller ID Proof</th> */}
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product, index) => (
      <tr key={product.id}>
        <td>{index + 1}</td>
        <td>{product.name}</td>
        <td className="font-weight-bold text-primary">{product.imei || "No IMEI"}</td> 
        {/* <td>₹{product.regularPrice}</td>
        <td>{product.entryDate ? formatDate(product.entryDate) : "Not available"}</td> 
        <td className="text-capitalize">{product.bill || "No"}</td>
        <td className="text-capitalize">{product.box || "No"}</td> */}
        <td>
    <span class="badge badge-primary">
        { product.sellerName || "No Name" }
    </span> 
    <br /><br />
    <span class="badge badge-secondary">
        { product.sellerMobile || "No Phone Number" }
    </span>
</td>

        <td>{product.sellerIdProof || "No documents"}</td>
        <td>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleDelete(product.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="11" style={{ textAlign: "center" }}>
        No products found.
      </td>
    </tr>
  )}
</tbody>

                      </table>
                    </div>
                  )}

                  <button
                    onClick={exportAsPDF}
                    type="button"
                    className="btn btn-info btn-icon-text mt-3"
                  >
                    Export as PDF
                    <i className="ti-printer btn-icon-append"></i>
                  </button>
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

export default AllProducts;
