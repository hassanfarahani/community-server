module.exports = {

    development: {
      client: 'pg',
      connection: 'postgres://hassan:galaxy@localhost/community-forum'
    },
    production: {
      client: 'pg',
      connection: process.env.DATABASE_URL
    },
  };