import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <div className="text-center">
          &copy; {new Date().getFullYear()} Department of CS&E, AIT
          Chikkamagaluru. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
