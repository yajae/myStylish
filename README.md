# STYLiSH
# Website URL
https://35.76.14.198/

# How to start my web server on port 80
1. cd Back-End-Class-Batch24/stylish
2. node server.js

# How to run Web Server in the Background
先下載npm 
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
利用npm下載pm2，使ec2中都使用pm2
sudo npm install pm2 -g

啟用node.js檔案
1. 至server.js檔案位置 
2. pm2 start server.js

# Build Working Flow
Local
1. 創建存儲庫
    在 GitHub 上為你的作業創建一個新的存儲庫。
    使用 "git clone" 將此存儲庫克隆到你的本地計算機
2. 在本地開發
    在本地計算機上編寫你的作業。
    使用 Git 進行版本控制，追蹤你的更改。
3. 提交更改
    進行更改並儲存檔案後，使用 "git add" 將我的更改檔案加入暫存區，然後使用 "git commit" 進行提交
4. 推送到Github
    使用 "git push" 將你的檔案推送到 GitHub 存儲庫。

Cloud (EC2)
5. 雲端取得Github存儲庫的修改
    已經設定"git remote add" Github存儲庫的前提下
    "git pull" Github存儲庫
6. 如果有新增套件
    需要額外下指令"npm install"#   m y S t y l i s h  
 