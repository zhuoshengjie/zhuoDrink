// table.js

// 获取表格元素
const table = document.getElementById('milk-tracker-table');

// 更新表格
function updateTable(data) {
    // 清空现有表格内容
    table.innerHTML = '';

    // 添加表头
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>时间</th>
        <th>奶粉数量 (ml)</th>
    `;
    table.appendChild(headerRow);

    // 添加数据行
    data.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.time}</td>
            <td>${entry.amount}</td>
        `;
        table.appendChild(row);
    });
}

// 导出更新表格的函数
// export { updateTable };