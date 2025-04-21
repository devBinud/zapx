import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./InvoicePage.css"; // Custom CSS for styling

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

const InvoicePage = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const billRef = ref(database, `bills/${id}`);
    onValue(billRef, (snapshot) => {
      const data = snapshot.val();
      setBill(data);
    });
  }, [id]);

  const handleDownloadPDF = () => {
    const element = document.getElementById("invoice");
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`invoice-${id}.pdf`);
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (!bill) {
    return <div>Loading...</div>;
  }

  const totalAmount = bill.products.reduce(
    (total, product) => total + product.quantity * product.regularPrice,
    0
  );

  return (
      <div className="invoice-container">
      <div id="invoice" className="invoice-card">
        <div className="header-logo">
          <h1>Invoice</h1>
        </div>

        <div className="shop__addressBox">
          <p>B K Kakoty Road, Near Ulubari Flyover</p>
          <p>Guwahati, Assam</p>
          <p>PIN - 786007</p>
          <div className="line__separator"></div>
        </div>

        <div className="order__addressBox">
          <div className="address__box">
            <h5>Address</h5>
            <p>{bill.customerDetails?.name}</p>
            <p>{bill.customerDetails?.address}</p>
            <p>+91{bill.customerDetails?.contact}</p>
            <p>Warranty Available: {bill.customerDetails?.warrantyAvailable}</p>
          </div>

          <div className="order__detailsBox">
            <h5>Order Details</h5>
            <p className="invoice-id">Bill ID: {id}</p>
            <p>Date: {formatDate(bill.timestamp)}</p>
            <p>Payment Mode: Cash</p>
            <p>Warranty Duration: {bill.customerDetails?.warrantyDuration}</p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {bill.products.map((product) => (
              <tr key={product.id}>
                <td className="text-capitalize">{product.name}</td>
                <td className="text-center">{product.quantity}</td>
                <td>₹{product.regularPrice}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2" className="text-right">
                <strong>Total Amount</strong>
              </td>
              <td>
                <strong>₹{totalAmount}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Export Button */}
        <div className="download-section">
          <button className="download-pdf-button" onClick={handleDownloadPDF}>
            Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
