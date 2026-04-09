// Charts with COLORS (finally not depressing)

let chart1 = new Chart(document.getElementById("chart1"), {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                '#ff6384',
                '#36a2eb',
                '#ffce56',
                '#4bc0c0',
                '#9966ff',
                '#ff9f40'
            ]
        }]
    }
});

let chart2 = new Chart(document.getElementById("chart2"), {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Sales',
            data: [],
            backgroundColor: '#36a2eb'
        }]
    }
});

let chart3 = new Chart(document.getElementById("chart3"), {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Profit',
            data: [],
            borderColor: '#00ffcc',
            fill: false
        }]
    }
});

// Fetch USER data (clean logic)

async function fetchData() {

    const res = await fetch('https://dummyjson.com/users');
    const json = await res.json();
    const users = json.users;

    let totalUsers = users.length;
    let totalSales = 0;
    let totalProfit = 0;

    let departmentMap = {};

    users.forEach(u => {

        let randomFactor = Math.floor(Math.random() * 20);

        totalSales += u.age + randomFactor;
        totalProfit += (u.age + randomFactor) * 0.5;

        let dept = u.company.department;

        if (!departmentMap[dept]) {
            departmentMap[dept] = 0;
        }

        departmentMap[dept] += u.age + randomFactor;
    });

    document.getElementById("sales").innerText = (totalSales / 10).toFixed(1) + "K";
    document.getElementById("quantity").innerText = totalUsers;
    document.getElementById("profit").innerText = (totalProfit / 10).toFixed(1) + "K";

    let labels = Object.keys(departmentMap);
    let values = Object.values(departmentMap);

    chart1.data.labels = labels;
    chart1.data.datasets[0].data = values;

    chart2.data.labels = labels;
    chart2.data.datasets[0].data = values;

    chart3.data.labels = labels;
    chart3.data.datasets[0].data = values.map(v => v * 0.5);

    chart1.update();
    chart2.update();
    chart3.update();
}   
function uploadImage() {
    const fileInput = document.getElementById("imageUpload");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    document.getElementById("preview").src = URL.createObjectURL(file);

    let formData = new FormData();
    formData.append("image", file);

    fetch('/search', {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("results").innerText =
            "Recommended Product: " + data.result;
    })
    .catch(() => {
        document.getElementById("results").innerText =
            "Error processing image";
    });
}

const uploadBtn = document.getElementById("uploadBtn");
const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("imageUpload");
const searchBtn = document.getElementById("searchBtn");
const preview = document.getElementById("preview");

// 1. Upload button → open file picker
uploadBtn.addEventListener("click", () => {
    fileInput.click();
});

// 2. File selected
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    preview.src = URL.createObjectURL(file);

    uploadBox.style.display = "flex";   // show paste box
    searchBtn.style.display = "block";  // show search button
});

// 3. Paste into small box
uploadBox.addEventListener("paste", (e) => {
    const items = e.clipboardData.items;

    for (let item of items) {
        if (item.type.startsWith("image")) {
            const file = item.getAsFile();

            const dt = new DataTransfer();
            dt.items.add(file);
            fileInput.files = dt.files;

            preview.src = URL.createObjectURL(file);

            uploadBox.style.display = "flex";
            searchBtn.style.display = "block";
        }
    }
});

function updateData() {
    fetchData();
}

fetchData();