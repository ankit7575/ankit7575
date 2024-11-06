import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './Navigation.css'; // Import CSS for styling
import logo from '../assets/img/logo.png';

function Dropdown({ title, links, isOpen, onToggle }) {
  return (
    <li className="Polaris-Navigation__ListItem">
      <div className="Polaris-Navigation__ItemWrapper" onClick={onToggle}>
        <div className={`Polaris-Navigation__ItemInnerWrapper ${isOpen ? 'Polaris-Navigation__ItemInnerWrapper--selected' : ''}`}>
          <Link
            data-polaris-unstyled="true"
            className={`Polaris-Navigation__Item ${isOpen ? 'Polaris-Navigation--subNavigationActive' : ''}`}
            to="#"
            aria-expanded={isOpen}
            aria-controls="sub-menu"
          >
            <div className="Polaris-Navigation__Icon">
              <span className="Polaris-Icon">
                <ui-icon type="order" tone="unstable-inherit"></ui-icon>
              </span>
            </div>
            <span className="Polaris-Navigation__Text">
              <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--semibold">{title}</span>
              <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span> {/* Move arrow to the end */}
            </span>
          </Link>
        </div>
      </div>
      {isOpen && (
        <div className="Polaris-Navigation__SecondaryNavigation Polaris-Navigation__SecondaryNavigationOpen">
          <ul className="Polaris-Navigation__List" id="sub-menu">
            {links.map(({ path, label }, index) => (
              <li className="Polaris-Navigation__ListItem" key={index}>
                <Link
                  data-polaris-unstyled="true"
                  className="Polaris-Navigation__Item"
                  to={path}
                >
                  <span className="Polaris-Navigation__Text">
                    <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular Polaris-Text--subdued">{label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function AdminNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [openDropdown, setOpenDropdown] = useState(null); // Track open dropdown

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  };

  const customerManagementLinks = [
    { path: "/admin/customers/view", label: "View Customers" },
    { path: "/admin/customers/add", label: "Add Customer" },
    { path: "/admin/customers/import", label: "Import Customers (Excel)" },
  ];

  const fundsManagementLinks = [
    { path: "/admin/funds/approve-payout", label: "Approve Payouts" },
    { path: "/admin/funds/view-history", label: "View Payout History" },
  ];

  const referralManagementLinks = [
    { path: "/admin/referrals/view", label: "View Referrals" },
    { path: "/admin/referrals/incentives", label: "Manage Incentives" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="menu-toggle" onClick={toggleMobileMenu}>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </div>
        <ul className={`menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <li>
            <img src={logo} alt="Company Logo" className="logo" />
          </li>
          <li>
            <Link to="/admin/dashboard">Admin Dashboard</Link>
          </li>
          <Dropdown
            title="Customer Management"
            links={customerManagementLinks}
            isOpen={openDropdown === "customerManagement"}
            onToggle={() => toggleDropdown("customerManagement")}
          />
          <Dropdown
            title="Funds Management"
            links={fundsManagementLinks}
            isOpen={openDropdown === "fundsManagement"}
            onToggle={() => toggleDropdown("fundsManagement")}
          />
          <Dropdown
            title="Referral Management"
            links={referralManagementLinks}
            isOpen={openDropdown === "referralManagement"}
            onToggle={() => toggleDropdown("referralManagement")}
          />
          <li>
            <Link to="/admin/trades">Manage Trades</Link>
          </li>
          <li>
            <Link to="/admin/reports">Generate Reports</Link>
          </li>
          <li>
            <Link to="/admin/settings">Settings</Link>
          </li>
        </ul>
      </nav>
      <div className="container">
        <div className="admin-header">Admin Panel</div>
      </div>
    </>
  );
}

export default AdminNavigation;
