module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'mysteriousobjectsatnoon',
      script: 'src/mysteriousobjectsatnoon.js',
      env: {
        NODE_ENV: 'production'
      }
    },
  ],
};
