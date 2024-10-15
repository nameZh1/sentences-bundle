// 一言API配置
const api = "http://localhost:3000/";
const quotes = [
    {
        "id": 1,
        "uuid": "9818ecda-9cbf-4f2a-9af8-8136ef39cfcd",
        "hitokoto": "与众不同的生活方式很累人呢，因为找不到借口。",
        "type": "a",
        "from": "幸运星",
        "from_who": null,
        "creator": "跳舞的果果",
        "creator_uid": 0,
        "reviewer": 0,
        "commit_from": "web",
        "created_at": "1468605909",
        "length": 22
    },
    {
        "id": 2,
        "uuid": "4e71bc61-9f2e-49e1-a62f-d4b8ad9716c6",
        "hitokoto": "面对就好，去经历就好。",
        "type": "a",
        "from": "花伞菌",
        "from_who": null,
        "creator": "umbrella",
        "creator_uid": 0,
        "reviewer": 0,
        "commit_from": "web",
        "created_at": "1468605909",
        "length": 11
    },
    // 更多名言
];

// 获取API数据
async function getByApi(apiUrl) {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch API:', error);
        return false;
    }
}

// 获取随机名言
async function getRandomQuote() {
    const data = await getByApi(api);
    if (data && data.result) {
        return data.result;
    } else {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }
}

// 显示随机名言
function displayRandomQuote() {
    getRandomQuote().then(randomQuote => {
        console.log("Displaying quote...");
        const existingQuoteElement = document.getElementById('daily-quote');
        if (existingQuoteElement) {
            existingQuoteElement.remove();
        }
        const quoteElement = document.createElement('div');
        quoteElement.id = 'daily-quote';
        if (randomQuote) {
            quoteElement.innerHTML = `<p>"${randomQuote.hitokoto}"</p><small>- 《${randomQuote.from}》${randomQuote.creator}</small>`;
        } else {
            quoteElement.innerHTML = `<p>无法获取一言</p>`;
        }
        document.body.appendChild(quoteElement);
    });
}

let intervalId;

// 启动定时器并立即显示一次
function startInterval() {
    setTimeout(() => {
        displayRandomQuote();  // 立即执行一次
    }, 1000);
    intervalId = setInterval(displayRandomQuote, 5000);  // 5秒间隔
}

// 停止定时器
function stopInterval() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

// 页面加载时启动定时器
window.addEventListener('load', startInterval);

// 页面关闭或标签切换时停止定时器
window.addEventListener('beforeunload', stopInterval);

// 当标签页失去或获得焦点时暂停和恢复定时器（可选）
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopInterval();  // 当标签页失去焦点时停止更新
    } else {
        startInterval();  // 恢复更新
    }
});
