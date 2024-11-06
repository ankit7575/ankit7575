const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Function to generate a PDF for user registration and referral terms acceptance.
 * @param {Object} userData - The user data for the PDF.
 * @param {string} userData.name - The name of the user.
 * @param {string} userData.email - The email of the user.
 * @param {string} userData.phoneNumber - The phone number of the user.
 * @returns {Promise<string>} The path to the generated PDF file.
 */
const generatePdf = async ({ name, email, phoneNumber }) => {
  // Validate input
  if (!name || !email || !phoneNumber) {
    throw new Error('Validation Error: Missing required fields: name, email, phoneNumber');
  }

  try {
    // Define the directory to save PDFs
    const pdfDirectory = path.join(__dirname, 'pdfs');

    // Create the directory if it doesn't exist
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true });
    }

    // Define the file path for the PDF
    const filePath = path.join(pdfDirectory, `${name.replace(/\s+/g, '_')}_registration.pdf`);

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Stream the PDF to the file
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Add content to the PDF
    // Header
    doc.fontSize(25).text('Registration Details', { align: 'center', underline: true });
    doc.moveDown();
    
    // User details
    doc.fontSize(14).text(`Name: ${name}`, { align: 'left' });
    doc.text(`Email: ${email}`);
    doc.text(`Phone Number: ${phoneNumber}`);
    doc.moveDown(2);

    // Add Terms and Conditions
    doc.fontSize(18).text('Referral Program - Terms & Conditions', { align: 'center', underline: true });
    doc.moveDown(1);

    // Add Terms Content
    doc.fontSize(12).text('1. Eligibility: The referral program is open to all active clients of Kyrios Fx Advisory. Referrals are eligible for commission once the referred client successfully starts trading under Kyrios Fx Advisory.', {
      align: 'justify',
    });

    doc.moveDown();
    doc.text('2. Referral Structure:', { bold: true });
    doc.list([
      'Stage 1 (Direct Referral): 15% of Kyrios Fx Advisory\'s profit share.',
      'Stage 2: 7.5% of Kyrios Fx Advisory\'s profit share.',
      'Stage 3: 7.5% of Kyrios Fx Advisory\'s profit share.',
    ]);
    doc.text('The commission is based on the company\'s profit share from the referred client’s trading activity.', {
      align: 'justify',
    });
    
    doc.moveDown();
    doc.text('3. Referral Commission Calculation: Commissions are calculated from the company\'s profit share after the trading week ends. Referrers will receive their commissions after the referred client has paid Kyrios Fx Advisory’s profit share.', {
      align: 'justify',
    });

    doc.moveDown();
    doc.text('4. Payment of Commissions: Once Kyrios Fx Advisory receives the profit share from the client (on a fortnightly cycle), commissions will be credited to the referrer\'s wallet on the Wednesday following the end of the two-week profit period. Referrers can request a withdrawal on Thursday and Friday through their Member Panel access. The payout will be transferred to the referrer’s account by the following Monday.', {
      align: 'justify',
    });
    

    doc.moveDown();
    doc.text('5. Conditions for Valid Referrals: A referral is valid when the referred client completes their account setup, provides the necessary MT5 credentials, and starts trading. Multiple referrals from the same referrer are allowed, but commissions are based on each referred client’s trading profits.', {
      align: 'justify',
    });

    doc.moveDown();
    doc.text('6. Non-Eligible Referrals: Self-referrals are not allowed. If a referred client terminates their agreement with Kyrios Fx Advisory before trading starts, no commission will be paid.', {
      align: 'justify',
    });

    doc.moveDown();
    doc.text('7. Referral Activity Monitoring: Kyrios Fx Advisory will monitor referral activities. Any misuse, fraud, or violation of these terms will result in termination of referral benefits.', {
      align: 'justify',
    });

    doc.moveDown();
    doc.text('8. Strict Policy: Kyrios Fx Advisory does not allow any referrer to collect money directly from clients under any circumstances. If this happens, we are not responsible for any issues or losses. Kyrios Fx Advisory never collects money from clients at any point. Our only earnings come from the profit share based on trading profits made in the client’s account.', {
      align: 'justify',
    });

    doc.moveDown();
    doc.text('9. Confidentiality: Referrers must keep all information related to referred clients confidential and are not allowed to share any personal or trading information.', {
      align: 'justify',
    });

    doc.moveDown();
    doc.text('10. Changes to the Referral Program: Kyrios Fx Advisory reserves the right to change or cancel the referral program at any time, without prior notice. We also reserve the right to cancel the referral program entirely without prior notice. Continued participation means you accept the new terms, should they be implemented.', {
      align: 'justify',
    });
    

    doc.moveDown();
    doc.text('11. Termination of Referral Program: Kyrios Fx Advisory may end a referrer’s participation if these terms are violated or if referral activity harms the company’s interests.', {
      align: 'justify',
    });
    doc.moveDown();
    doc.text('12. No Claims on the Company: Referral members have no right to make any claims against Kyrios Fx Advisory, its affiliates, or its subsidiaries. By participating in the referral program, members acknowledge and agree that they are not entitled to any type of compensation or claim beyond the commissions earned through the program.', {
      align: 'justify',
    });
    
    // Add a signature section
    doc.moveDown(3);
    doc.fontSize(14).text('By proceeding, you have accepted the terms and conditions.', { align: 'center', underline: true });
    
    // Finalize the PDF and end the stream
    doc.end();

    // Wait for the stream to finish writing to ensure the file is created before returning
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    return filePath; // Return the file path for sending via email
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Could not generate PDF: ' + error.message);
  }
};

module.exports = { generatePdf };
