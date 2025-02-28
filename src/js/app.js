// app.js

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("milk-form");
  const milkInput = document.getElementById("amount");
  const tableBody = document.getElementById("milk-table-body");
  // 显示表格和图表
  updateTable();
  updateCharts();

  updataNum();

  form.addEventListener("submit", function (event) {
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
      const alertDiv = document.getElementById("alertDiv");
      alertDiv.classList.add("show");
      setTimeout(() => {
        alertDiv.classList.remove("show");
      }, 2000);
      updateHistoryData();

      showHistoryBtn();
    }
  });

  function updataNum() {
    // 显示今日奶粉总量
    const records = getRecords();
    const today = new Date().toLocaleDateString();
    const todayRecords = records.filter((record) =>
      record.time.includes(today)
    );
    const totalAmount = todayRecords.reduce(
      (total, record) => total + parseInt(record.amount),
      0
    );
    document.getElementById("total-milk-amount").textContent = totalAmount;

    // 显示今日奶粉摄入次数
    document.getElementById("milk-count-amount").textContent =
      todayRecords.length;
  }

  function addMilkRecord(amount, time) {
    const records = getRecords();
    records.push({ amount, time });
    localStorage.setItem("milkRecords", JSON.stringify(records));
  }

  function getRecords() {
    return JSON.parse(localStorage.getItem("milkRecords")) || [];
  }

  function updateTable() {
    const records = getRecords();
    tableBody.innerHTML = "";
    // 表格倒序显示最近5条记录
    // 如果记录数大于5，只显示最近5条
    if (records.length > 5) {
      records.slice(-5).reverse().forEach((record) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${record.time}</td><td>${record.amount}</td><td><button class="delete-btn">删除</button></td>`;
        tableBody.appendChild(row);
      });
      return;
    }
    records.reverse().forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${record.time}</td><td>${record.amount}</td><td><button class="delete-btn">删除</button></td>`;
      tableBody.appendChild(row);
    });
  }

  // 删除按钮 delete-btn
  tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      const records = getRecords();
      const tr = event.target.parentElement.parentElement;
      const time = tr.children[0].textContent;
      const amount = tr.children[1].textContent;
      const newRecords = records.filter(
        (record) => !(record.time === time && record.amount === amount)
      );
      localStorage.setItem("milkRecords", JSON.stringify(newRecords));
      updateTable();
      updateCharts();
      updataNum();

      showHistoryBtn();
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
    records.forEach((record) => {
      labels.push(record.time);
      data.push(record.amount);
    });
    updateChart(labels, data);
  }

  updateTable();

  // ...existing code...

  //   如果没有喝奶记录，不显示查看历史记录按钮
  function showHistoryBtn() {
    const records = getRecords();
    if (records.length === 0) {
      document.getElementById("history-btn").style.display = "none";
    } else {
      document.getElementById("history-btn").style.display = "block";
    }
  }
  showHistoryBtn();

  // 获取历史记录数据
  function getHistoryData() {
    const records = getRecords();
    // 按日期分组
    const groupedData = records.reduce((acc, record) => {
      const date = new Date(record.time).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          totalAmount: 0,
          count: 0,
          records: [],
        };
      }
      acc[date].totalAmount += parseInt(record.amount);
      acc[date].count += 1;
      acc[date].records.push(record);
      return acc;
    }, {});

    // 转换为数组并排序
    return Object.entries(groupedData)
      .map(([date, data]) => ({
        date,
        ...data,
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const historyBtn = document.getElementById("history-btn");
  const historyModal = document.getElementById("history-modal");
  const closeBtn = document.querySelector(".close");

  // 显示历史记录
  function showHistory() {
    const historyData = getHistoryData();
    const historyList = document.querySelector(".history-list");
    historyList.innerHTML = "";

    historyData.forEach((day) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";
      historyItem.innerHTML = `
            <div class="history-date">${day.date}</div>
            <div class="history-details">
                <div class="history-stat">
                    <span>总量:</span>
                    <span class="history-stat-value">${day.totalAmount}ml</span>
                </div>
                <div class="history-stat">
                    <span>次数:</span>
                    <span class="history-stat-value">${day.count}次</span>
                </div>
            </div>
        `;
      historyList.appendChild(historyItem);
    });

    historyModal.style.display = "block";
  }

  // 事件监听
  historyBtn.addEventListener("click", showHistory);

  closeBtn.addEventListener("click", () => {
    historyModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === historyModal) {
      historyModal.style.display = "none";
    }
  });
  // 添加历史数据更新函数
  function updateHistoryData() {
    const todayData = getHistoryData()[0]; // 获取最新一天的数据
    if (todayData) {
      document.getElementById("total-milk-amount").textContent =
        todayData.totalAmount;
      document.getElementById("milk-count-amount").textContent =
        todayData.count;
    }
  }
});
