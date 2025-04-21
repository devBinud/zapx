import React, { useState, useEffect } from "react";
import Footer from "../footer/Footer";
import axios from "axios";
import Constants from "../../constants/Constants";


const AllCategories = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [editableCategory, setEditableCategory] = useState({
    name: "",
    slug: "",
  });


  // FETCHING DATA USING useEffect HOOK

  useEffect(() => {
    fetchCategories();
  }, []);

  // FETCH ALL CATEGORIES
  const fetchCategories = async () => {
    try {
      const response = await axios.get(Constants.BASE_URL + "api/category");
      setCategoriesList(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // DELETE CATEGORY HANDLER
  const deleteCategory = (categoryId) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this category ?"
    );
    if (shouldDelete) {
      axios
        .delete(Constants.BASE_URL + `api/category/${categoryId}`)
        .then((response) => {
          fetchCategories();
        })
        .catch((error) => {
          console.log("Error Deleting Category", error);
        });
    }
  };

  // EDIT SINGLE CATEGORY
  const handleEditClick = (category) => {
    setEditableCategory(category);
  };

// GENERATE SLUG

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-|-$/g, "");
  };
  // EDIT CATEGORY NAME HANDLER 

const handleCategoryNameChange = (e) => {
  const newName = e.target.value;
  const newSlug = generateSlug(newName);
  setEditableCategory({
    ...editableCategory,
    name: newName,
    slug: newSlug,
  });
};

  // HANDLE SAVE CHANGES

 const handleSaveChanges = () => {
   if (editableCategory) {
     const { _id, name, slug } = editableCategory;
     axios
       .put(Constants.BASE_URL + `api/category/${_id}`, { name, slug })
       .then((response) => {
         fetchCategories();
         setEditableCategory(null); // Reset editable category after save
       })
       .catch((error) => {
         console.error("Error updating category:", error);
       });
   }
 };


  return (
    <>
      <div class="main-panel">
        <div class="content-wrapper">
          <div className="view__allCategories">
            <div class="col-lg-12 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">View All Stocks</h4>
                  <p class="card-description">
                    List of all stocks , you can edit or delete in
                    <span className="text-danger"> Action Column</span>
                  </p>
                  <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Stocks Name</th>
                          <th>Slug</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoriesList
                          .slice()
                          .reverse()
                          .map((categories, index) => {
                            return (
                              <tr key={categories._id}>
                                <td>{index + 1}</td>
                                <td>{categories.name}</td>
                                <td>{categories.slug}</td>
                                <td>
                                  <div>
                                    <button
                                      data-toggle="modal"
                                      data-target="#categoryModal"
                                      onClick={() =>
                                        handleEditClick(categories)
                                      }
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        deleteCategory(categories._id)
                                      }
                                      className="ml-2 text-danger"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                      {/* EDIT CATEGORY MODAL****/}
                      <div
                        class="modal fade"
                        id="categoryModal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div
                              class="modal-header"
                              style={{ borderBottom: "none" }}
                            >
                              <h4 class="modal-title" id="exampleModalLabel">
                                Edit Category
                              </h4>
                              <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div class="modal-body">
                              {editableCategory && (
                                <>
                                  <div className="form-group">
                                    <label htmlFor="categoryName">
                                      Category Name
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="categoryName"
                                      value={editableCategory.name}
                                      onChange={handleCategoryNameChange}
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="categorySlug">
                                      Category Slug
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="categorySlug"
                                      value={editableCategory.slug}
                                      readOnly
                                    />
                                  </div>
                                </>
                              )}
                            </div>

                            <div
                              class="modal-footer"
                              style={{ borderTop: "none" }}
                            >
                              <button
                                type="button"
                                class="btn btn-secondary"
                                data-dismiss="modal"
                              >
                                Close
                              </button>
                              <button
                                type="button"
                                class="btn btn-primary"
                                data-dismiss="modal"
                                onClick={handleSaveChanges}
                              >
                                Save changes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </table>
                  </div>
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

export default AllCategories;
