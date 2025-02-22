// 引入图表库
const ctx = document.getElementById('milkChart').getContext('2d');
let milkChart;

// 更新图表
function updateChart(labels, data) {
    if (milkChart) {
        milkChart.destroy();
    }
    
    milkChart = new Chart(ctx, {
        type: 'line', // 图表类型
        data: {
            labels: labels, // X轴标签
            datasets: [{
                label: '奶粉数量',
                data: data, // Y轴数据
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 导出更新图表的函数
// export { updateChart };