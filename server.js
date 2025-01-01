// 套件
import express from 'express';
const app = express();
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
const __dirname = process.cwd();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';

// 操控Db的函數
import { insertNewUser, getDataByEmail } from './model/dealUsers.js';
import { insertOrderAndTransaction } from './model/dealOrder.js';
import { countForChart } from './model/countForChart.js';
// 設定route
import adminRouter from './controller/admin.js';
import apiRouter from './controller/api.js';
import userRouter from './controller/user.js';
app.use('/admin', adminRouter);
app.use('/api/1.0', apiRouter);
app.use('/user', userRouter);
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
// 設定https
const key = fs.readFileSync('./key/private.key');
const cert = fs.readFileSync('./key/certificate.crt');
const options = {
  key,
  cert,
};
const server = https.createServer(options, app);
server.listen(8080);
// hash密碼
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}


app.get('/fine', (req, res) => {
  res.send({ message: '目前無內容' });
});


app.post('/user/signup', async (req, res) => {
  const PROVIDER = 'native';
  const EXPIRED_TIME = 360000;
  const { name, email, password } = req.body;
 console.log(name, email, password);
  if (!email) {
    return res.status(400).json({ message: '請提供用戶名、電子郵件和密碼' });
  }
  try {
    const user = await getDataByEmail(email);

    if (user) {
      return res.status(400).json({ message: '該電子郵件地址已被註冊' });
    }
  
    const token = jwt.sign({ email, name }, 'secretKey', { expiresIn: `${EXPIRED_TIME}` });
    const hashedPassword = await hashPassword(password);
    await insertNewUser(PROVIDER, name, email, hashedPassword, '');
    if (token) {
      res.cookie('token', token, { maxAge: 900000 });
    }
  
    res.status(201).json({
      "data": {
        access_token: token,
        access_expired: EXPIRED_TIME,
        user: {
          provider: PROVIDER,
          name,
          email,
          picture: ''
        },
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.post('/user/signin', async (req, res) => {
  const PROVIDER = 'native';
  const EXPIRED_TIME = 360;
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: '請提供電子郵件和密碼' });
  }
  try {
    const user = await getDataByEmail(email);
    if (!user) {
      return res.status(401).json({ message: '無效的用戶名或密碼' });
    }
    console.log(user.id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: '密碼錯誤' });
    }
    const token = jwt.sign({ "email":email,"id":user.id }, 'secretKey', { expiresIn: `${EXPIRED_TIME}` + 'min' });
    if (token) {
      res.cookie('token', token, { maxAge: 900000 });
    }
    res.status(201).json({
      data: {
        access_token: token,
        access_expired: EXPIRED_TIME,
        user: {
          provider: PROVIDER,
          name: user.name,
          email: user.email,
          picture: user.picture,
        },
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.get('/user/profile' ,async (req, res) => {
  const accessToken = req.headers.authorization;
  const token = accessToken && accessToken.split(' ')[1];
  if (token == null) {
    return res.status(400).json({ message: '請提供token' });
  }

  try {
    let data;
    jwt.verify(token, 'secretKey', (err, decoded) => {
      if (err) { console.log('err'); } else {
        data = decoded;
      }
    });
    const user = await getDataByEmail(data.email);
    console.log(user);
    // 確認兩組密碼是否相同
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: '密碼錯誤' });
    }
    res.send({
      data: {
        provider: user.provider,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // 如果令牌不存在，返回未授權狀態碼
  // 驗證 JWT 令牌
  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.sendStatus(403); // 如果驗證失敗，返回禁止狀態碼
    req.user = user;
    next();
  });
}

app.get('admin/checkout',async(req, res) =>{
  // 檢查 cookie 中是否存在 token
  const token = req.cookies.token;

  // 如果 cookie 中存在 token，則重定向到另一個頁面
  if (token) {
      res.redirect('/checkout.html');
  } 
  res.send
})
app.get('/order/count',async(req,res) => {
  try {const result =await countForChart();
    res.send({"data":result})

  } catch (error) {
    console.log(error)
  }
  
  


})
app.post('/order/checkout', async (req, res) => {
  const { order } = req.body;

  try {
  
    const response = await axios('http://35.75.145.100:1234/api/1.0/order/data');
    const data = response.data;

      const result = await insertOrderAndTransaction(data,req.body.prime_key)



    // const results = await Promise.all(order.list.map(async (listItem) => {
    
    //   const data = await getVariantsById(listItem.id);
    //   const result = data.find((variant) =>
    //       variant.stock >= listItem.qty &&
    //       variant.size === listItem.size &&
    //       variant.color_code.toLowerCase() === listItem.color.code.toLowerCase()
    //   );
    //   return result;
    // }));
    
    // if (results.some((result) => !result)) {
    //   res.status(400).send({ message: '庫存不足' });
    // }
   
    // let transactionResult;
    // transactionResult = await insertOrderAndTransaction(req.body);
    res.redirect("/thankyou.html");
  
  //  res.send({"message":"ok"})
  } catch (err) {
    console.log(err)
    res.sendStatus(500).send({ message: 'server問題' });
  }
});
app.get('/thankyou.html', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'thankyou.html'));
});



