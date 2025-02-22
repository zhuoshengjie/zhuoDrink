// storage.js
const storageKey = 'babyMilkData';

// 保存数据到本地存储
function saveData(data) {
    let existingData = getData();
    existingData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(existingData));
}

// 从本地存储获取数据
function getData() {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
}

// 清除本地存储数据
function clearData() {
    localStorage.removeItem(storageKey);
}

// 导出函数
// export { saveData, getData, clearData };