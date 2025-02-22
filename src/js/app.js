// app.js


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('milk-form');
    const milkInput = document.getElementById('amount');
    const tableBody = document.getElementById('milk-table-body');
    // 显示表格和图表
    updateTable();
    updateCharts();

    updataNum();

    

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const milkAmount = milkInput.value;
        const time = new Date().toLocaleString();

        if (milkAmount) {
            addMilkRecord(milkAmount, time);
            updateTable();
            updateCharts();
            updataNum();
            saveToLocalStorage();
            form.reset();
            // 提示用户添加成功，不用alert 用一个div显示
            // alert('添加成功');
            const alertDiv = document.getElementById('alertDiv');
            alertDiv.classList.add('show');
            setTimeout(() => {
                alertDiv.classList.remove('show');
            }, 2000);

        }
    });

    function updataNum() {
        // 显示今日奶粉总量
        const records = getRecords();
        const today = new Date().toLocaleDateString();
        const todayRecords = records.filter(record => record.time.includes(today));
        const totalAmount = todayRecords.reduce((total, record) => total + parseInt(record.amount), 0);
        document.getElementById('total-milk-amount').textContent = totalAmount;
    
        // 显示今日奶粉摄入次数
        document.getElementById('milk-count-amount').textContent = todayRecords.length
    
    }

    function addMilkRecord(amount, time) {
        const records = getRecords();
        records.push({ amount, time });
        localStorage.setItem('milkRecords', JSON.stringify(records));
    }

    function getRecords() {
        return JSON.parse(localStorage.getItem('milkRecords')) || [];
    }

    function updateTable() {
        const records = getRecords();
        tableBody.innerHTML = '';
        // 表格倒序显示
        records.
        reverse().
        forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${record.time}</td><td>${record.amount}</td><td><button class="delete-btn">删除</button></td>`;
            tableBody.appendChild(row);
        });
    }

    // 删除按钮 delete-btn
    tableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const records = getRecords();
            const tr = event.target.parentElement.parentElement;
            const time = tr.children[0].textContent;
            const amount = tr.children[1].textContent;
            const newRecords = records.filter(record => !(record.time === time && record.amount === amount));
            localStorage.setItem('milkRecords', JSON.stringify(newRecords));
            updateTable();
            updateCharts();
            updataNum();
        }
    });


    function saveToLocalStorage() {
        // 数据已在addMilkRecord中保存
    }

    function updateCharts() {
        // 调用chart.js中的函数更新图表
        let labels = [];
        let data = [];
        const records = getRecords();
        records.forEach(record => {
            labels.push(record.time);
            data.push(record.amount);
        });
        updateChart(labels, data);

    }

    updateTable();
});