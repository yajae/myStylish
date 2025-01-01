import client from './cache.js';
async function processJob(jobId) {
    // 模擬一些長時間運行的任務
    setTimeout(async () => {
        // 假設工作已完成
        await client.hSet(jobId, {
            status: 'completed',
            result: '處理結果'
        });
    }, 5000); // 5 秒的模擬處理時間
}

async function worker() {
    while (true) {
        try {
            const job = await client.blPop('jobs', 0);
            const jobId = job.element;
            await client.hSet(jobId, { status: 'processing' });
            await processJob(jobId);
        } catch (err) {
            console.error('獲取工作時出錯:', err);
        }
    }
}

async function main() {
 


    console.log('工作處理器已啟動');
    worker();
}

main();
