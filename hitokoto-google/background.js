chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchQuote') {
        const categoryIds = request.categoryIds; // 获取传递的 categoryIds
        const apiUrl = "http://localhost:3000/"; // 假设你有一个API服务

        // 构建 URL，包含所需的种类 ID
        const url = categoryIds.length > 0 ? `${apiUrl}?id=${categoryIds.join(',')}` : apiUrl;

        // 从 API 获取数据
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // 返回数据给 content script 或 popup
                sendResponse({ success: true, quote: data.result });
            })
            .catch(error => {
                console.error("Failed to fetch quote:", error);
                sendResponse({ success: false, error: error.message });
            });

        // 这里是异步操作，必须返回 true，告诉 Chrome 扩展保持通信通道打开
        return true;
    }
});
