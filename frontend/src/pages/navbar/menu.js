import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../admin.css";
import logo from "../../components/assets/img/logo.png";
const MenuItem = ({ title, isOpen, onClick, children }) => (
  <li className={`main-menu ${isOpen ? "active" : ""}`} onClick={onClick}>
    <h3>
      {title}{" "}
      {isOpen ? (
        <FontAwesomeIcon icon={faTimes} />
      ) : (
        <FontAwesomeIcon icon={faAngleDown} />
      )}
    </h3>
    {isOpen && <ul className="submenu">{children}</ul>}
  </li>
);

MenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

const SubMenuItem = ({ title, isActive, onClick }) => (
  <li className={`submenu-item ${isActive ? "active" : ""}`} onClick={onClick}>
    {title}
  </li>
);

SubMenuItem.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Menu = ({ setContent }) => {
  const [submenuVisibility, setSubmenuVisibility] = useState({
    orders: false,
    discounts: false,
    coupon: false,
    products: false,
    skillLearning: false,
    enquiry: false,

    users: false,
    franchise: false,
    channelPartner: false,
    affiliateMarketing: false,
    guest: false,
  });

  const [activeSubMenuItem, setActiveSubMenuItem] = useState(null);

  const handleMenuClick = useCallback((menu) => {
    setSubmenuVisibility((prevVisibility) => {
      const updatedVisibility = { ...prevVisibility };

      // Close all menus except the one being opened
      Object.keys(updatedVisibility).forEach((key) => {
        if (key !== menu) {
          updatedVisibility[key] = false;
        }
      });

      // Toggle the clicked menu
      updatedVisibility[menu] = !prevVisibility[menu];

      return updatedVisibility;
    });
  }, []);

  const handleSubMenuItemClick = useCallback((content, event) => {
    event.stopPropagation();
    setContent(content);
    setActiveSubMenuItem(content);
  }, [setContent]);

  return (
    <div className="dashboard-menu">
     <div className="pb-4">
     <img   onClick={(event) => handleSubMenuItemClick("home", event)} className="img-fluid logo"  src={logo} alt="" />
     </div>
      <ul>
      <MenuItem
          title="Home"
          isActive={activeSubMenuItem === "home"}
          onClick={(event) => handleSubMenuItemClick("home", event)}
        >
        </MenuItem>


        <MenuItem
          title="Users"
          isOpen={submenuVisibility.users}
          onClick={() => handleMenuClick("users")}
        >  <SubMenuItem
        title="Users"
        isActive={activeSubMenuItem === "users"}
        onClick={(event) => handleSubMenuItemClick("users", event)}
      />
          
          <SubMenuItem
            title="Franchise"
            isActive={activeSubMenuItem === "franchise"}
            onClick={(event) => handleSubMenuItemClick("franchise", event)}
          />
          <SubMenuItem
            title="Channel Partner"
            isActive={activeSubMenuItem === "channel"}
            onClick={(event) => handleSubMenuItemClick("channel", event)}
          />
          <SubMenuItem
            title="Affiliate Marketing"
            isActive={activeSubMenuItem === "affiliate"}
            onClick={(event) => handleSubMenuItemClick("affiliate", event)}
          />
          <SubMenuItem
            title="Guest"
            isActive={activeSubMenuItem === "guest"}
            onClick={(event) => handleSubMenuItemClick("guest", event)}
          />
        </MenuItem>
        <MenuItem
          title="Franchise"
          isOpen={submenuVisibility.franchise}
          onClick={() => handleMenuClick("franchise")}
        >
          <SubMenuItem
            title="Profile"
            isActive={activeSubMenuItem === "franchise"}
            onClick={(event) => handleSubMenuItemClick("franchise", event)}
          />
          <SubMenuItem
            title="Products"
            isActive={activeSubMenuItem === "products"}
            onClick={(event) => handleSubMenuItemClick("products", event)}
          />
         
          <SubMenuItem
            title="Total Discount"
            isActive={activeSubMenuItem === "discounts"}
            onClick={(event) => handleSubMenuItemClick("discounts", event)}
          />
          <SubMenuItem
            title="Coupon"
            isActive={activeSubMenuItem === "coupon"}
            onClick={(event) => handleSubMenuItemClick("coupon", event)}
          />
          <SubMenuItem
            title="Skill Learning"
            isActive={activeSubMenuItem === "skill"}
            onClick={(event) => handleSubMenuItemClick("skill", event)}
          />
        </MenuItem>
    
        <MenuItem
          title="Channel Partner"
          isOpen={submenuVisibility.channelPartner}
          onClick={() => handleMenuClick("channelPartner")}
        >
          <SubMenuItem
            title="Profile"
            isActive={activeSubMenuItem === "channel"}
            onClick={(event) => handleSubMenuItemClick("channel", event)}
          />
          <SubMenuItem
            title="Products"
            isActive={activeSubMenuItem === "products"}
            onClick={(event) => handleSubMenuItemClick("products", event)}
          />
         
          <SubMenuItem
            title="Total Discount"
            isActive={activeSubMenuItem === "discounts"}
            onClick={(event) => handleSubMenuItemClick("discounts", event)}
          />
          <SubMenuItem
            title="Coupon"
            isActive={activeSubMenuItem === "coupon"}
            onClick={(event) => handleSubMenuItemClick("coupon", event)}
          />
          <SubMenuItem
            title="Skill Learning"
            isActive={activeSubMenuItem === "skill"}
            onClick={(event) => handleSubMenuItemClick("skill", event)}
          />
        </MenuItem>
        <MenuItem
          title="Affiliate Marketing"
          isOpen={submenuVisibility.affiliateMarketing}
          onClick={() => handleMenuClick("affiliateMarketing")}
        >
          <SubMenuItem
            title="Profile"
            isActive={activeSubMenuItem === "affiliate"}
            onClick={(event) => handleSubMenuItemClick("affiliate", event)}
          />
          <SubMenuItem
            title="Products"
            isActive={activeSubMenuItem === "products"}
            onClick={(event) => handleSubMenuItemClick("products", event)}
          />
          <SubMenuItem
            title="Discount"
            isActive={activeSubMenuItem === "discounts"}
            onClick={(event) => handleSubMenuItemClick("discounts", event)}
          />
          <SubMenuItem
            title="Coupon"
            isActive={activeSubMenuItem === "coupon"}
            onClick={(event) => handleSubMenuItemClick("coupon", event)}
          />
          <SubMenuItem
            title="Skill Learning"
            isActive={activeSubMenuItem === "skill"}
            onClick={(event) => handleSubMenuItemClick("skill", event)}
          />
        </MenuItem>
        <MenuItem
          title="Guest"
          isOpen={submenuVisibility.guest}
          onClick={() => handleMenuClick("guest")}
        >
          <SubMenuItem
            title="Profile"
            isActive={activeSubMenuItem === "guest"}
            onClick={(event) => handleSubMenuItemClick("guest", event)}
          />
          <SubMenuItem
            title="Products"
            isActive={activeSubMenuItem === "products"}
            onClick={(event) => handleSubMenuItemClick("products", event)}
          />
          <SubMenuItem
            title="Skill Learning"
            isActive={activeSubMenuItem === "skill"}
            onClick={(event) => handleSubMenuItemClick("skill", event)}
          />
        </MenuItem>
      </ul>
    </div>
  );
};

Menu.propTypes = {
  setContent: PropTypes.func.isRequired,
};

export default Menu;
