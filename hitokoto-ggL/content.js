/**
 * 按住拖动
 * ==============================================================
 */
function makeElementDraggable(element) {
    let offsetX = 0, offsetY = 0, initialX = 0, initialY = 0;

    // 开始拖动时的处理函数
    function onDragStart(e) {
        e.preventDefault();
        // 获取鼠标起始位置
        initialX = e.clientX;
        initialY = e.clientY;
        
        // 绑定鼠标移动和释放事件
        document.addEventListener('mousemove', onDragging);
        document.addEventListener('mouseup', onDragEnd);
    }

    // 拖动中的处理函数
    function onDragging(e) {
        // 计算拖动的偏移量
        offsetX = e.clientX - initialX;
        offsetY = e.clientY - initialY;

        // 更新元素的位置
        element.style.left = (element.offsetLeft + offsetX) + 'px';
        element.style.top = (element.offsetTop + offsetY) + 'px';

        // 更新起始点为当前位置
        initialX = e.clientX;
        initialY = e.clientY;
    }

    // 拖动结束的处理函数
    function onDragEnd() {
        // 解除绑定
        document.removeEventListener('mousemove', onDragging);
        document.removeEventListener('mouseup', onDragEnd);

        // 保存最终位置
        savePosition(element.offsetLeft, element.offsetTop);
    }

    // 鼠标按下时开始拖动
    element.addEventListener('mousedown', onDragStart);
}

// 保存拖动后的元素位置到 chrome.storage.sync
function savePosition(left, top) {
    chrome.storage.sync.set({ position: { left: left, top: top } }, () => {
        console.log('Position saved:', { left, top });
    });
}

// 从存储中加载并应用保存的元素位置
function loadPosition(element) {
    chrome.storage.sync.get('position', (data) => {
        if (data.position) {
            element.style.left = data.position.left + 'px';
            element.style.top = data.position.top + 'px';
        }
    });
}
/**
 * 更新样式
 * ==============================================================
 */
function updateQuoteStyle(time = 10) {
    // 定义样式的 ID，用于检查和避免重复
    const styleId = 'daily-quote-style';

    // 检查是否已经存在相同 ID 的样式
    let existingStyle = document.getElementById(styleId);
    if (existingStyle) {
        // 如果存在，先删除旧的样式
        existingStyle.remove();
    }

    // 创建一个新的 style 标签
    const styleElement = document.createElement('style');
    styleElement.id = styleId;

    // 添加伪元素样式
    styleElement.innerHTML = `
    #daily-quote::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: #cccccc46;
        border-radius: 8px;
        cursor: pointer;
        animation: jindu ${time}s linear;
    }
    `;
    // 将新的 style 标签添加到 head
    document.head.appendChild(styleElement);
}
/**
 * 更新元素
 * ==============================================================
 */
function updateQuoteElement(randomQuote) {
    const existingQuoteElement = document.getElementById('daily-quote');
    if (existingQuoteElement) {
        existingQuoteElement.remove();
    }

    const quoteElement = document.createElement('div');
    quoteElement.id = 'daily-quote';

    if (randomQuote) {
        quoteElement.innerHTML = `<p>"${randomQuote.hitokoto}"</p><small>- 《${randomQuote.from}》${randomQuote.creator}</small> `;
    } else {
        quoteElement.innerHTML = `<p>无法获取一言</p>`;
    }
    document.body.appendChild(quoteElement);
    makeElementDraggable(quoteElement)
    loadPosition(quoteElement)
}
/**
 * 更新处理
 * ==============================================================
 */
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

/**
 * 初始化
 * ==============================================================
 */
function init() {
    let intervalId;

    // 启动定时器并立即显示一次
    function startInterval() {
        chrome.storage.sync.get('speed', (result) => {
            const time = result.speed || 10;
            const duration = time * 1000
            updateQuoteStyle(time)
            displayHandle()
            intervalId = setInterval(displayHandle, duration);
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