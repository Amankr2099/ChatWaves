import React from "react";

export const Loading = () => {
  return (
    <div className="mt-3">
      <div className="spinner-border ps-2  text-danger" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-border ps-2  text-secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-border ps-2  text-warning" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
