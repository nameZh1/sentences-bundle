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
