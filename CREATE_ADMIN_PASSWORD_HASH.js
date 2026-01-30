// Script to generate password hash for admin user
// Run this with Node.js: node CREATE_ADMIN_PASSWORD_HASH.js

// Install bcryptjs first: npm install bcryptjs
const bcrypt = require('bcryptjs');

// Password to hash
const password = 'admin123';

// Generate hash
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nUse this hash in the SQL INSERT statement:');
  console.log(`INSERT INTO admin_users (username, email, password_hash, is_active)`);
  console.log(`VALUES ('admin', 'admin@puscart.com', '${hash}', true)`);
  console.log(`ON CONFLICT (username) DO UPDATE SET password_hash = '${hash}';`);
});

// You can also verify a password:
// bcrypt.compare('admin123', hash, (err, result) => {
//   console.log('Password matches:', result);
// });
