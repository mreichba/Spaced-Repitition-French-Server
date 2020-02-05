module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DB_URL || "postgresql://vapor:123@localhost/spaced",
  TEST_DATABASE_URL: process.env.TEST_DB_URL || "postgresql://vapor:123@localhost/spaced_test",
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
