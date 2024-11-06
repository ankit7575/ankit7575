// src/components/UserOptions.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../actions/userActions";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

const UserOptions = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Conditional rendering for customer or admin dashboard
  const dashboardLink = user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <div className="user-options">
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret>
          {user?.name || "User"} {/* Display user's name */}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Account</DropdownItem>
          <DropdownItem>
            <Link to="/profile" className="dropdown-link">
              Profile
            </Link>
          </DropdownItem>
          {/* Render the dashboard link based on the user's role */}
          <DropdownItem>
            <Link to={dashboardLink} className="dropdown-link">
              Dashboard
            </Link>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default UserOptions;
