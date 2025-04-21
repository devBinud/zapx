import React, { useState } from "react";

const SearchFilter = ({ onFilter }) => {
  const [search, setSearch] = useState("");

  const handleFilter = () => {
    const lowerSearch = search.toLowerCase();
    onFilter({
      name: lowerSearch,
      company: lowerSearch,
      imei: lowerSearch,
    });
  };

  const clearSearch = () => {
    setSearch("");
    onFilter({ name: "", company: "", imei: "" });
  };

  return (
    <div className="mb-3">
      <div className="row">
        <div className="col-md-12">
          <div className="input-group input-group-merge">
            <span className="input-group-text" id="basic-addon-search31">
              <i className="bx bx-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by Name, IMEI, or Company..."
              aria-label="search"
              aria-describedby="basic-addon-search31"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyUp={handleFilter}
            />
            {search && (
              <span
                className="input-group-text cursor-pointer"
                onClick={clearSearch}
              >
                <i className="bx bx-x"></i>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
