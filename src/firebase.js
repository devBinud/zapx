import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, update } from "firebase/database";

// Your Firebase project configuration
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

/**
 * Function to store new mobile product data in Firebase
 */
const storeMobileProduct = (productData) => {
  const productsRef = ref(database, 'mobileProducts');
  const newProductRef = push(productsRef);
  set(newProductRef, productData)
    .then(() => {
      console.log("Mobile product added successfully!");
    })
    .catch((error) => {
      console.error("Error adding mobile product:", error);
    });
};

/**
 * ✅ Function to update existing mobile product data
 * @param {string} productId - The ID of the product to update
 * @param {Object} updatedData - The updated fields
 */
export const updateMobileProduct = (productId, updatedData) => {
  const productRef = ref(database, `mobileProducts/${productId}`);
  return update(productRef, updatedData)
    .then(() => {
      console.log("Mobile product updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating product:", error);
    });
};

// ✅ Default export
export default storeMobileProduct;
