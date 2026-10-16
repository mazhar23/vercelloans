import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const vercelOutput = path.join(root, '.vercel', 'output');

if (fs.existsSync(dist)) {
  fs.mkdirSync(vercelOutput, { recursive: true });

  // 1. config.json
  const configFile = path.join(dist, 'config.json');
  if (fs.existsSync(configFile)) {
    fs.copyFileSync(configFile, path.join(vercelOutput, 'config.json'));
  }

  // 2. static files
  const clientDir = path.join(dist, 'client');
  if (fs.existsSync(clientDir)) {
    fs.cpSync(clientDir, path.join(vercelOutput, 'static'), { recursive: true });
  }

  // 3. serverless function
  const serverDir = path.join(dist, 'server');
  if (fs.existsSync(serverDir)) {
    const funcDir = path.join(vercelOutput, 'functions', '__server.func');
    fs.mkdirSync(path.join(vercelOutput, 'functions'), { recursive: true });
    fs.cpSync(serverDir, funcDir, { recursive: true });
  }

  console.log('Successfully structured .vercel/output for Vercel Build Output API v3');
}
