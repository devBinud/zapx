import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const AllProductsFilter = ({ onFilter }) => {
  const [search, setSearch] = useState("");

  const handleFilter = () => {
    onFilter({ search });
  };

  return (
    <div className="mb-4">
      <div className="position-relative">
        {/* Search Icon */}
        <FaSearch
          style={{
            position: "absolute",
            top: "50%",
            left: "15px",
            transform: "translateY(-50%)",
            color: "#888",
            pointerEvents: "none",
          }}
        />

        {/* Search Input */}
        <input
          type="text"
          className="form-control py-2 ps-5 shadow-sm"
          placeholder="Search by Name, Company, Price, or IMEI"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={handleFilter}
          style={{
            borderRadius: "10px",
            transition: "all 0.3s ease-in-out",
            border: "1px solid #ccc",
          }}
          onFocus={(e) =>
            (e.target.style.boxShadow = "0 0 5px 2px rgba(40, 56, 126, 0.3)")
          }
          onBlur={(e) => (e.target.style.boxShadow = "none")}
          onMouseEnter={(e) =>
            (e.target.style.border = "1px solid rgb(37, 83, 182)")
          }
          onMouseLeave={(e) =>
            (e.target.style.border = "1px solid #ccc")
          }
        />
      </div>
    </div>
  );
};

export default AllProductsFilter;
