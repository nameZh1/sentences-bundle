const express = require('express');
const app = express();
const port = 3000;

const version = require('./version.json')
const categories = require(version.categories.path)

// 获取分类
app.get('/getCategories', (req, res) => {
    const result = categories
    res.json({ result });
});

// 根据传参获取一言
app.get('/getPower', (req, res) => {
    const { id = '1,2,3,4,5,6,7,8,9,10,11,12' } = req.query;
    const ids = id.split(',')

    //随机类别
    const randomIndex = Math.floor(Math.random() * ids.length)
    const randomId = ids[randomIndex]
    const randomCategories = categories

    // 随机内容
    const power = require(randomCategories[randomId].path)
    const randomPowerIndex = Math.floor(Math.random() * power.length)
    const randomPower = power[randomPowerIndex]


    const result = randomPower

    res.json({ result });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

