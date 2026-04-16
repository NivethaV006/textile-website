const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting SRI MURUGAN TEX Servers...\n');

// Start Backend Server
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

console.log('✅ Backend Server starting on http://localhost:3001');

// Start Avatar.ai Server
const avatarAI = spawn('python', ['app.py'], {
  cwd: path.join(__dirname, 'Avatar.ai'),
  stdio: 'inherit',
  shell: true
});

console.log('✅ Avatar.ai Server starting on http://localhost:5001');

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down servers...');
  backend.kill();
  avatarAI.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  backend.kill();
  avatarAI.kill();
  process.exit(0);
});

console.log('\n📋 Server Status:');
console.log('   Backend:   http://localhost:3001');
console.log('   Avatar AI: http://localhost:5001');
console.log('   Frontend:  http://localhost:3000 (start with: npm start)');
console.log('\nPress Ctrl+C to stop all servers\n');
