import React from "react";
import Footer from "../footer/Footer";

const StockUpdates = () => {
  return (
    <>
      <div class="main-panel">
        <div class="content-wrapper">
          <div class="row">
            <div class="col-lg-12 grid-margin stretch-card">
              <div class="card">
                <div class="card-body">
                  <h4 class="card-title">Stock Updates</h4>
              <p class="card-description">
                    See full list of single products by clicking <code>Action column</code>
                  </p>
              <div class="table-responsive pt-3">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product Category</th>
                          <th>Total Products</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Herman Beck</td>
                          <td>$ 77.99</td>
                          <td>
                            <a href="#!">See all products</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- content-wrapper ends --> */}
        {/* <!-- partial:../../partials/_footer.html --> */}
        <Footer />
        {/* <!-- partial --> */}
      </div>
    </>
  );
};

export default StockUpdates;
