import React, { useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css'; // Import CSS for styling
import logo from '../assets/img/logo.png';

function Dropdown({ title, links, isOpen, onToggle }) {
  return (
    <li className="Polaris-Navigation__ListItem">
      <div className="Polaris-Navigation__ItemWrapper" onClick={onToggle}>
        <div className={`Polaris-Navigation__ItemInnerWrapper ${isOpen ? 'Polaris-Navigation__ItemInnerWrapper--selected' : ''}`}>
          <Link
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
              <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span> {/* Move arrow to end */}
            </span>
          </Link>
        </div>
      </div>
      {isOpen && (
        <div className="Polaris-Navigation__SecondaryNavigation Polaris-Navigation__SecondaryNavigationOpen">
          <ul className="Polaris-Navigation__List" id="sub-menu">
            {links.map((link, index) => (
              <li className="Polaris-Navigation__ListItem" key={index}>
                <Link className={`Polaris-Navigation__Item ${window.location.pathname === link.path ? 'active' : ''}`} to={link.path}>
                  <span className="Polaris-Navigation__Text">
                    <span className="Polaris-Text--root Polaris-Text--bodyMd Polaris-Text--regular Polaris-Text--subdued">{link.label}</span>
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

function CustomerNavigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // Store the currently open dropdown
  const referralNumber = "REF123456"; // Example referral number

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown)); // Close the dropdown if it's already open, otherwise open the clicked dropdown
  };

  const fundsLinks = [
    { path: "/funds/fortnightly-profit", label: "Fortnightly Profit" },
    // { path: "/funds/company-profit-due", label: "Company Profit Due" },
    { path: "/referral-incentive", label: "Referral Incentive" },
  ];

  const teamInfoLinks = [
    { path: "/team-info/direct-referral", label: "Direct Referrals" },
    { path: "/team-info/stage-2", label: "Stage 2 Referrals" },
    { path: "/team-info/stage-3", label: "Stage 3 Referrals" },
  ];

  const refIncentiveLinks = [
    { path: "/referral-incentive/direct-referral", label: "Direct Referral Incentive" },
    { path: "/referral-incentive/stage-two", label: "Stage 2 Incentive" },
    { path: "/referral-incentive/stage-3", label: "Stage 3 Incentive" },
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
            <Link className={`menu-item ${location.pathname === "/dashboard" ? 'active' : ''}`} to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link className={`menu-item ${location.pathname === "/refer-new-user" ? 'active' : ''}`} to="/refer-new-user">Refer a New User</Link>
          </li>
          <Dropdown 
            title="Team Information" 
            links={teamInfoLinks} 
            isOpen={openDropdown === "teamInfo"} 
            onToggle={() => toggleDropdown("teamInfo")} 
          />
          <Dropdown 
            title="Funds Management" 
            links={fundsLinks} 
            isOpen={openDropdown === "funds"} 
            onToggle={() => toggleDropdown("funds")} 
          />
          <Dropdown 
            title="Referral Incentives" 
            links={refIncentiveLinks} 
            isOpen={openDropdown === "refIncentives"} 
            onToggle={() => toggleDropdown("refIncentives")} 
          />
          <li>
            <Link className={`menu-item ${location.pathname === "/trade-authentication" ? 'active' : ''}`} to="/trade-authentication">Trade Authentication</Link>
          </li>
          <li>
            <Link className={`menu-item ${location.pathname === "/profile" ? 'active' : ''}`} to="/profile">My Profile</Link>
          </li>
          <li>
            <Link className={`menu-item ${location.pathname === "/payout-records" ? 'active' : ''}`} to="/payout-records">Payout Records</Link>
          </li>
          <li>
            <Link className={`menu-item ${location.pathname === "/support" ? 'active' : ''}`} to="/support">Support</Link>
          </li>
          <li>
            <Link className={`menu-item ${location.pathname === "/Logout" ? 'active' : ''}`} to="/support">Logout</Link>
          </li>
        </ul>
      </nav>
      <div className="container">
        <div className="referral-number">Referral Number: {referralNumber}</div>
      </div>
    </>
  );
}

export default CustomerNavigation;
