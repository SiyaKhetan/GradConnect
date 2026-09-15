const mongoose = require('mongoose');
const User = require('./models/User');

require('dotenv').config();

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({ email: { $regex: /^test\d+@gradconnect\.com$/ } });
    console.log('Cleared existing test users');

    // Create test users
    const testUsers = [
      {
        name: 'Maria Rodriguez',
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'test1@gradconnect.com',
        password: 'Test123!',
        role: 'alumni'
      },
      {
        name: 'Alex Kumar',
        firstName: 'Alex',
        lastName: 'Kumar',
        email: 'test2@gradconnect.com',
        password: 'Test123!',
        role: 'student'
      },
      {
        name: 'Sarah Johnson',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'test3@gradconnect.com',
        password: 'Test123!',
        role: 'alumni'
      },
      {
        name: 'David Chen',
        firstName: 'David',
        lastName: 'Chen',
        email: 'test4@gradconnect.com',
        password: 'Test123!',
        role: 'student'
      }
    ];

    const createdUsers = [];
    for (const userData of testUsers) {
      const user = await User.create(userData);
      createdUsers.push({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      });
      console.log(`Created user: ${user.name} (${user._id})`);
    }

    console.log('\n=== TEST USERS CREATED ===');
    console.log('Copy these IDs to update your frontend:');
    console.log(JSON.stringify(createdUsers, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
}

createTestUsers();