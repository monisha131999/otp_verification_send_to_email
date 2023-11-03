const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
// const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(cors())

// Create a nodemailer transporter to send emails
const transporter = nodemailer.createTransport({
service: 'Gmail', // Replace with your email service provider (e.g., 'Gmail')
auth: {
 user: 'monishaabu143@gmail.com', // Replace with your email
 pass: 'vhcv bwqb ylrj nbvt', // Replace with your password
 },
});

// Generate and store OTPs for email addresses
const otpStore = new Map();

// Generate a random 6-digit OTP
// function generateOTP() {
//   return otpGenerator.generate(6, { upperCase: false, specialChars: false });
// }
// for genetrating number OTP
function generateOTP() {
 return otpGenerator.generate(6, { digits: true});
 }

// Send an OTP via email
app.post('/send', (req, res) => {
 const { email } = req.body;
const otp = generateOTP();

 // Store the OTP in memory (you may want to use a database for production)
 otpStore.set(email, otp);

const mailOptions = {
 from: 'monianbu380@gmail.com', // Replace with your email
 to: email,
 subject: 'Your OTP Code',
 text: `Your OTP code is: ${otp}`,
 };

transporter.sendMail(mailOptions, (error, info) => {
if (error) {
 console.error('Error sending email:', error);
 res.status(500).json({ error: 'Error sending email' });
 } else {
     console.log('Email sent: ' + info.response);
 res.json({ message: 'OTP sent successfully' });
 }
 });
});

// Verify the OTP
app.post('/verify', (req, res) => {
const { email, otp } = req.body;

 // Check if the OTP exists and matches
 const storedOTP = otpStore.get(email);

 if (storedOTP && storedOTP === otp) {
 // OTP is valid
 otpStore.delete(email); // Remove the used OTP
 res.json({ message: 'OTP is valid' });
 } else {
 res.status(400).json({ error: 'Invalid OTP' });
 }
});

app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});