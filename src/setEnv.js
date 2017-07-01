const fs = require('fs');
const path = require('path');

if (process.env.NODE_ENV === 'development') {
  const pathToEnvFile = path.resolve(__dirname, '../.env');

  const envs = fs.readFileSync(pathToEnvFile, 'utf8').match(/.+=.+\n/g);
  envs.forEach((env) => {
    let [, key, value] = env.match(/(.+)=(.+)/);
    if (key === 'FIREBASE_PRIVATE_KEY') {
      value = value.replace(/\\n/g, '\n');
    }
    process.env[key] = value;
  });
}
