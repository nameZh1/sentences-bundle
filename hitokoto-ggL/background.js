import { getRandomdQuote } from './localApi.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchQuote') {
        const categoryIds = request.categoryIds; // 获取传递的 categoryIds
        const idsStr = categoryIds.length > 0 ? categoryIds.join(',') : '';
        
        getRandomdQuote(idsStr)
            .then(data => {
                sendResponse({ success: true, quote: data.result });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });

        // 告诉 Chrome 保持异步通信通道打开
        return true;
    }
});
