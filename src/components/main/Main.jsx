import React, { useEffect, useState } from 'react';
import Footer from '../footer/Footer';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { FaChartLine, FaShoppingBag, FaMobileAlt, FaBox, FaPlusCircle, FaShoppingCart } from "react-icons/fa";


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

const Main = () => {
  const [totalPhoneCompanies, setTotalPhoneCompanies] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [todaysOrders, setTodaysOrders] = useState(0);
  const [todaysSales, setTodaysSales] = useState(0);
  const [productsAddedLast10Days, setProductsAddedLast10Days] = useState(0);
  const [productsAddedToday, setProductsAddedToday] = useState(0);


  useEffect(() => {
    const billsRef = ref(database, 'bills');
    const companiesRef = ref(database, 'mobileProducts'); // Now using mobileProducts for both phone companies and products

    // Fetching total phone companies and products
    onValue(companiesRef, (snapshot) => {
      const data = snapshot.val();
      setTotalPhoneCompanies(data ? Object.keys(data).length : 0);
      setTotalProducts(data ? Object.keys(data).length : 0); // Counting all products from mobileProducts
    });

    // Fetching bills data to calculate today's orders and sales
    onValue(billsRef, (snapshot) => {
      const data = snapshot.val();
      let orders = 0;
      let sales = 0;
      const today = new Date().toLocaleDateString("en-IN");

      if (data) {
        Object.values(data).forEach(bill => {
          const billDate = new Date(bill.timestamp).toLocaleDateString("en-IN");
          if (billDate === today) {
            orders += bill.products.length; // Assuming each product in the bill counts as an order
            sales += bill.products.reduce((sum, product) => sum + (product.salePrice * product.quantity), 0);
          }
        });
      }

      setTodaysOrders(orders);
      setTodaysSales(sales);
    });
  }, []);

  useEffect(() => {
    const companiesRef = ref(database, 'mobileProducts');

    onValue(companiesRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Mobile Products Data:", data); // Log the entire object
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          console.log(`ID: ${key}, Name: ${value.name}, Company: ${value.company}, Sale Price: ${value.salePrice}`);
        });
      }
    });
  }, []);

  useEffect(() => {
    const db = getDatabase(app);
    const mobileProductsRef = ref(db, "mobileProducts");

    onValue(mobileProductsRef, (snapshot) => {
      const data = snapshot.val();
      let productCount = 0;
      let companySet = new Set();
      let addedInLast10Days = 0;

      const today = new Date();
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(today.getDate() - 10);

      for (let key in data) {
        const product = data[key];
        productCount++;
        companySet.add(product.company);

        // Check entryDate
        if (product.entryDate) {
          const productDate = new Date(product.entryDate);
          if (productDate >= tenDaysAgo && productDate <= today) {
            addedInLast10Days++;
          }
        }
      }

      setTotalProducts(productCount);
      setTotalPhoneCompanies(companySet.size);
      setProductsAddedLast10Days(addedInLast10Days);
    });
  }, []);

  // Todays
  useEffect(() => {
    const companiesRef = ref(database, 'mobileProducts');

    onValue(companiesRef, (snapshot) => {
      const data = snapshot.val();
      let todayCount = 0;

      if (data) {
        const today = new Date().toLocaleDateString("en-IN");

        Object.values(data).forEach(product => {
          const addedDate = new Date(product.entryDate).toLocaleDateString("en-IN");
          if (addedDate === today) {
            todayCount++;
          }
        });
      }

      setProductsAddedToday(todayCount);
    });
  }, []);


  // Function to format numbers in Indian style
  const formatIndianNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <>
      <div class="layout-page">

        <div className="content-wrapper">
          {/* Content */}
          <div className="container-xxl flex-grow-1 container-p-y">
            <div className="row mb-4">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4 col-md-12 col-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title d-flex align-items-start justify-content-between">
                          <div className="avatar flex-shrink-0">
                            {/* Icon for Total Phone Companies */}
                            <FaMobileAlt className="text-primary" size={40} />
                          </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Total Phone Companies</span>
                        <h3 className="card-title mb-2">{totalPhoneCompanies}</h3>
                        <span className="badge bg-warning text-white rounded-pill">Last updated today</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12 col-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title d-flex align-items-start justify-content-between">
                          <div className="avatar flex-shrink-0">
                            {/* Icon for Total Products */}
                            <FaBox className="text-primary" size={34} />
                          </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Total Products</span>
                        <h3 className="card-title mb-2">{formatIndianNumber(totalProducts)}</h3>
                        <span className="badge bg-warning text-white rounded-pill">Last updated today</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12 col-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title d-flex align-items-start justify-content-between">
                          <div className="avatar flex-shrink-0">
                            {/* Replace the image with the icon */}
                            <FaChartLine className="text-primary" size={40} />
                          </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Products Added</span>
                        <h3 className="card-title mb-2">{formatIndianNumber(productsAddedLast10Days)}</h3>
                        <span className="badge bg-warning text-white rounded-pill">Last 10 days data</span>
                      </div>
                    </div>
                  </div>


                  <div className="col-lg-4 col-md-12 col-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title d-flex align-items-start justify-content-between">
                          <div className="avatar flex-shrink-0">
                            {/* Replace the image with the icon */}
                            <FaShoppingBag className="text-primary" size={36} />
                          </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Today's Orders</span>
                        <h3 className="card-title mb-2">{formatIndianNumber(todaysOrders)}</h3>
                        <span className="badge bg-warning text-white rounded-pill">Last updated today</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12 col-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title d-flex align-items-start justify-content-between">
                          <div className="avatar flex-shrink-0">
                            {/* Icon for Today's Sales */}
                            <FaShoppingCart className="text-primary" size={40} />
                          </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Today's Sales</span>
                        <h3 className="card-title mb-2">{formatIndianNumber(todaysSales)}</h3>
                        <span className="badge bg-warning text-white rounded-pill">Data as per recent calculation</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12 col-12 mb-4">
                    <div className="card">
                      <div className="card-body">
                        <div className="card-title d-flex align-items-start justify-content-between">
                          <div className="avatar flex-shrink-0">
                            {/* Icon for Products Added Today */}
                            <FaPlusCircle className="text-primary" size={40} />
                          </div>
                        </div>
                        <span className="fw-semibold d-block mb-1">Products Added Today</span>
                        <h3 className="card-title mb-2">{formatIndianNumber(productsAddedToday)}</h3>
                        <span className="badge bg-warning text-white rounded-pill">Based on latest entry logs</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
            Copyright © 2025.zapX, All rights reserved . Designed and
            Developed by 
            <a href="#!" className="ml-1" target="_blank" rel="noopener noreferrer">
  {" "}Team Cyber Sentinels
</a>

          </span>
           
          </div>
          
          {/* / Content */}
        </div>

      </div>


    </>
  );
};

export default Main;
