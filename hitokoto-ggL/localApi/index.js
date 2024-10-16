/**
 * 动态获取分类
 * author:zh1
 * date: 2024年10月16日
 * @returns 分类对象
 */
const getCategories = async () => {
    const response = await fetch(chrome.runtime.getURL('localApi/categories.json'));
    const categories = await response.json(); // 解析为 JSON 对象
    return { result: categories };
};

/**
 * 随机获取一言
 * author:zh1
 * date: 2024年10月16日
 * @params
 *      @idsStr ID字符串
 * @returns 一言对象
 */
const getRandomdQuote = async (idsStr) => {
    const response = await fetch(chrome.runtime.getURL('localApi/categories.json'));
    const categories = await response.json(); // 获取分类数据

    const id = idsStr || '1,2,3,4,5,6,7,8,9,10,11,12';
    const ids = id.split(',');
    // 随机类别
    const randomIndex = Math.floor(Math.random() * ids.length);
    const randomId = ids[randomIndex] - 1;

    // 获取随机类别路径对应的文件（假设路径在 categories 数据中）
    const powerResponse = await fetch(chrome.runtime.getURL(categories[randomId].path));
    const power = await powerResponse.json(); // 解析 power 文件

    // 随机内容
    const randomPowerIndex = Math.floor(Math.random() * power.length);
    const randomPower = power[randomPowerIndex];
    const result = randomPower;

    return { result };
};

export { getCategories, getRandomdQuote };
