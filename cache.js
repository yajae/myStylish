import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

// const client = await createClient({
//   socket:{
//     host: process.env.REDIS_HOST,
//     port:6379
//   }
// }).connect();

const client =await createClient({
  host: '127.0.0.1', 
  port: 6379, 

}) 
.on('error', err => console.log('Redis Client Error', err))
.on('ready', () => {
  console.log('Redis 已准备就绪');
})
.connect(); 




// await client.lPush('key', ['1', '2']);

export default client;