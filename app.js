import express from 'express';

const app = express();
const port = 3000;
import client from './cache.js';

app.get('/api/2.0/report/payments', async(req, res) => {
    const jobId = `job_${Date.now()}`;
    console.log('into')
    // 將工作 ID 推入 Redis 佇列
   await client.lPush('jobs', jobId, async(err, reply) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        // // 將工作詳情存儲到 Redis 中
        // await client.hmset(jobId, {
        //     status: 'queued',
        //     created_at: new Date().toISOString()
        // });

        // 響應客戶端
        res.json({message: '工作已成功提交', jobId: jobId});
    });
});

// 查詢工作狀態的 API
app.get('/api/2.0/report/status/:jobId', async(req, res) => {
    const jobId = req.params.jobId;
    
    await client.hgetall(jobId, (err, job) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }

        res.json(job);
    });
});


app.listen(port, () => {
    console.log(`服務運行於 http://localhost:${port}/`);
});
