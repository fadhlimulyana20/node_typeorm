import Redis from 'ioredis';

// Create Redis Connection
export const redis = new Redis();

// Console log when server failed to establish a connection with redis.
redis.on('error', function(err): any{
  console.log("[Redis] Could not establish a connection with redis.")
  console.log(err);
});

// Console log when server success to establish a connection with redis.
redis.on('connect', function(err): any{
  console.log("[Redis] Connected to redis successfully");
});