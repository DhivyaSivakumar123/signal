const fs = require('fs');
const path = require('path');

// Basic .env parser without requiring external dependencies
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const val = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        if (key && !process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    });
  }
}

loadEnv();

let rawApiUrl = (process.env.API_URL || 'https://gateway-service-644308977417.us-central1.run.app').trim();
let apiUrl = rawApiUrl;
try {
  const parsed = new URL(rawApiUrl);
  apiUrl = parsed.origin;
} catch (e) {
  apiUrl = rawApiUrl.replace(/\/+$/, '');
}

const configContent = `{
  "apiUrl": "${apiUrl}"
}
`;

const targetPath = path.resolve(__dirname, '../src/assets/config.json');

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, configContent);

console.log(`✅ Generated src/assets/config.json from process.env / .env: API_URL=${apiUrl}`);
