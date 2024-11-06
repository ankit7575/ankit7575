// src/components/Modals/TermsModal.js

import React, { useState } from "react";
import PropTypes from 'prop-types';
import './TermsModal.css'; // Optional: Add CSS for the modal styles

const TermsModal = ({ show, onClose, onAccept }) => {
  const [acceptedReferral, setAcceptedReferral] = useState(false);

  const handleCheckboxChange = (e) => {
    setAcceptedReferral(e.target.checked);
  };

  const handleAccept = () => {
    if (acceptedReferral) {
      onAccept();
    } else {
      alert("You must accept the referral program terms and conditions to proceed.");
    }
  };

  if (!show) return null; // Don't show modal if `show` is false

  return (
    <div className="modal-overlay" role="dialog" aria-labelledby="terms-modal-title" aria-describedby="terms-modal-description" aria-modal="true">
      <div className="modal-content">
        <h2 id="terms-modal-title">Referral Program - Terms & Conditions</h2>
        <div id="terms-modal-description" className="terms-content">
          {/* Terms and conditions content here */}
          <p><strong>1. Eligibility:</strong> The referral program is open to all active clients of Kyrios Fx Advisory. Referrals are eligible for commission once the referred client successfully starts trading under Kyrios Fx Advisory.</p>
          <p><strong>2. Referral Structure:</strong> The referral program has a three-level commission structure:</p>
          <ul>
            <li>Stage 1 (Direct Referral): 20% of Kyrios Fx Advisory's profit share.</li>
            <li>Stage 2: 10% of Kyrios Fx Advisory's profit share.</li>
            <li>Stage 3: 10% of Kyrios Fx Advisory's profit share.</li>
          </ul>
          <p>The commission is based on the company's profit share from the referred client’s trading activity.</p>
          <p><strong>3. Referral Commission Calculation:</strong> Commissions are calculated from the company's profit share after the trading week ends. Referrers will receive their commissions after the referred client has paid Kyrios Fx Advisory’s profit share.</p>
          <p><strong>4. Payment of Commissions:</strong> Once Kyrios Fx Advisory receives the profit share from the client (on Monday), commissions will be credited to the referrer's wallet on Wednesday. Referrers can request a withdrawal on Thursday and Friday through their Member Panel access. The payout will be transferred to the referrer’s account by the following Monday.</p>
          <p><strong>5. Conditions for Valid Referrals:</strong> A referral is valid when the referred client completes their account setup, provides the necessary MT5 credentials, and starts trading. Multiple referrals from the same referrer are allowed, but commissions are based on each referred client’s trading profits.</p>
          <p><strong>6. Non-Eligible Referrals:</strong> Self-referrals are not allowed. If a referred client terminates their agreement with Kyrios Fx Advisory before trading starts, no commission will be paid.</p>
          <p><strong>7. Referral Activity Monitoring:</strong> Kyrios Fx Advisory will monitor referral activities. Any misuse, fraud, or violation of these terms will result in termination of referral benefits.</p>
          <p><strong>8. Strict Policy:</strong> "Kyrios Fx Advisory does not allow any referrer to collect money directly from clients under any circumstances. If this happens, we are not responsible for any issues or losses. Kyrios Fx Advisory never collects money from clients at any point. Our only earnings come from the profit share based on trading profits made in the client’s account."</p>
          <p><strong>9. Confidentiality:</strong> Referrers must keep all information related to referred clients confidential and are not allowed to share any personal or trading information.</p>
          <p><strong>10. Changes to the Referral Program:</strong> Kyrios Fx Advisory reserves the right to change or end the referral program at any time. Changes will be communicated in advance, and continued participation means you accept the new terms.</p>
          <p><strong>11. Termination of Referral Program:</strong> Kyrios Fx Advisory may end a referrer’s participation if these terms are violated or if referral activity harms the company’s interests.</p>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={acceptedReferral}
              onChange={handleCheckboxChange}
              aria-labelledby="checkbox-label"
            />
            <span>I accept the terms for the Referral Program</span>
          </label>
        </div>

        <div className="modal-actions">
          <button className="accept-button" onClick={handleAccept} disabled={!acceptedReferral}>
            Accept
          </button>
          <button className="close-button" onClick={onClose}>Decline</button>
        </div>
      </div>
    </div>
  );
};

// PropTypes for validation
TermsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default TermsModal;
