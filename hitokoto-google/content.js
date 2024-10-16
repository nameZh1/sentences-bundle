function updateQuoteElement(randomQuote) {
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
}

function displayHandle() {
    // 请求名言，考虑多类别选择
    chrome.storage.sync.get('selectedCategoryIds', (result) => {
        const categoryIds = result.selectedCategoryIds || [];

        // 发送消息给 background.js 请求名言
        chrome.runtime.sendMessage({ action: 'fetchQuote', categoryIds: categoryIds }, (response) => {
            if (response && response.success) {
                updateQuoteElement(response.quote);
            } else {
                // console.error("Failed to fetch quote:", response ? response.error : "No response");
                updateQuoteElement(null);
            }
        });
    });
}


function init() {
    let intervalId;

    // 启动定时器并立即显示一次
    function startInterval() {
        chrome.storage.sync.get('speed', (result) => {
            const time = result.speed || 10;
            const duration = time * 1000
            displayHandle()
            intervalId = setInterval(displayHandle, duration);  // 5秒间隔
        })
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
}

init()