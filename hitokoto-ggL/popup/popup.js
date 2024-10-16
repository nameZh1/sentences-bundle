import { getCategories } from "../localApi";

// 定义从 API 获取类别的函数
function fetchCategories() {
    const data = getCategories();
    return data.result;
}

document.addEventListener('DOMContentLoaded', async () => {
    const categoriesContainer = document.getElementById('categories');
    const saveButton = document.getElementById('save');

    // 获取类别列表并动态生成复选框
    const categories = await fetchCategories();

    // 将类别添加到复选框
    categories.forEach(category => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.setAttribute('data-id', category.id); // 根据类别ID设置data-id
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${category.name}`));
        categoriesContainer.appendChild(label);
        categoriesContainer.appendChild(document.createElement('br'));
    });

    // 加载已保存的类别并选中相应的复选框
    chrome.storage.sync.get('selectedCategoryIds', (result) => {
        const selectedCategories = result.selectedCategoryIds || [];
        const checkboxes = document.querySelectorAll('#categories input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            if (selectedCategories.includes(checkbox.getAttribute('data-id'))) {
                checkbox.checked = true; // 选中已保存的类别
            }
        });
    });

    chrome.storage.sync.get('speed', (result) => {
        const localSpeed = result.speed || 10;
        const speedEle = document.getElementById('speed')
        speedEle.value = localSpeed
    });

    // 点击保存按钮时存储配置
    saveButton.addEventListener('click', () => {
        const selectedCategories = [];
        const checkboxes = document.querySelectorAll('#categories input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedCategories.push(checkbox.getAttribute('data-id'));
            }
        });

        // 存储用户选择的多个类别ID
        chrome.storage.sync.set({ selectedCategoryIds: selectedCategories }, () => {
            console.log('Selected categories saved:', selectedCategories);
        });

        // 存储速度
        const speed = document.getElementById('speed').value
        chrome.storage.sync.set({ speed: speed }, () => {
            console.log('speed saved:', speed);
        });

        // 关闭弹窗
        window.close();
    });
});
