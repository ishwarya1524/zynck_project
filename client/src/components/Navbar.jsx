import { Link } from 'react-router-dom';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#e6faff] text-blue-900 p-4 shadow-sm border-1 border-blue-200">
      <div className=" mx-auto flex w-full justify-between items-center gap-3">
        <div className="text-xl font-bold">
          <Link to="/">WaterTable</Link>
        </div>
        <div className="space-x-4 font-bold">
          <Link to="/" className="hover:text-blue-300">Home</Link>
          <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
          <Link to="/login" className="hover:text-blue-300">Login</Link>
          <Link to="/register" className="hover:text-blue-300">Register</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
