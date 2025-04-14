import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3001;
const cache = new Map();

// 允许跨域
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// B站用户信息代理
app.get('/bilibili/user/:mid', async (req, res) => {
  const cached = cache.get(req.params.mid);
  if (cached) return res.json(cached);
  try {
    const response = await axios.get('https://api.bilibili.com/x/space/acc/info', {
      params: { mid: req.params.mid },
      headers: {
        'Referer': 'https://www.bilibili.com/',
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    res.json({
      code: 0,
      data: response.data.data
    });
  } catch (error) {
    res.status(500).json({ code: -1, message: 'API请求失败' });
  }
  cache.set(req.params.mid, response.data, 3600); // 缓存1小时
});

app.listen(PORT, () => {
  console.log(`代理服务运行在 http://localhost:${PORT}`);
});