const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('🚀 Starting Avatar.ai Server...');
console.log('📁 Location:', path.join(__dirname, 'Avatar.ai'));

const avatarServer = spawn('python', ['app.py'], {
  cwd: path.join(__dirname, 'Avatar.ai'),
  stdio: 'inherit',
  shell: true
});

avatarServer.on('error', (err) => {
  console.error('❌ Failed to start Avatar.ai:', err.message);
  console.log('Make sure Python is installed: https://python.org');
});

avatarServer.on('exit', (code) => {
  if (code !== 0) {
    console.log(`⚠️ Avatar.ai server exited with code ${code}`);
  }
});

// Check if server is running
const checkServer = () => {
  const req = http.get('http://localhost:5001', (res) => {
    console.log('✅ Avatar.ai Server is running on http://localhost:5001');
    console.log('🛑 Press Ctrl+C to stop');
  });
  req.on('error', () => {
    setTimeout(checkServer, 2000);
  });
};

setTimeout(checkServer, 5000);

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping Avatar.ai Server...');
  avatarServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  avatarServer.kill();
  process.exit(0);
});
