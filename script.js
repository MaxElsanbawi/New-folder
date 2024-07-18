document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = './data.json';
    const customerTableBody = document.getElementById('customerTableBody');
    const filterNameInput = document.getElementById('filterNameInput');
    const filterAmountInput = document.getElementById('filterAmountInput');
    const myChart = document.getElementById('myChart').getContext('2d');

    let customers = [];
    let transactions = [];

    function fetchData(url) {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);

                }
                return response.json();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function initApp() {
        fetchData(apiUrl)
            .then(data => {
                customers = data.customers;
                transactions = data.transactions;
                renderCustomerTable(transactions);
                setupEventListeners();
            });
    }

    function renderCustomerTable(transactions) {
        customerTableBody.innerHTML = '';

        transactions.forEach(transaction => {
            const customer = customers.find(c => c.id === transaction.customer_id);
            const tr = document.createElement('tr');
            tr.innerHTML =` 
                <td>${customer.name}</td>
                <td>${transaction.date}</td>
                <td>${transaction.amount}</td>
            `;
            customerTableBody.appendChild(tr);
        });
    }

    function filterTransactions() {
        const filterName = filterNameInput.value.trim().toLowerCase();
        const filterAmount = filterAmountInput.value.trim().toLowerCase();

        const filteredTransactions = transactions.filter(transaction => {
            const customer = customers.find(c => c.id === transaction.customer_id);
            return (
                customer.name.toLowerCase().includes(filterName) &&
                transaction.amount.toString().includes(filterAmount)
            );
        });

        renderCustomerTable(filteredTransactions);

        resetChart();
    }

    function generateChart(customerId) {
        const filteredTransactions = transactions.filter(transaction => transaction.customer_id === customerId);
        const dates = [...new Set(filteredTransactions.map(transaction => transaction.date))];
        const amountsPerDay = dates.map(date => {
            return filteredTransactions.reduce((total, transaction) => {
                if (transaction.date === date) {
                    return total + transaction.amount;
                }
                return total;
            }, 0);
        });

        new Chart(myChart, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Total Transaction Amount',
                    data: amountsPerDay,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }]
            },
            options: {}
        });
    }

    function resetChart() {
        myChart.clearRect(0, 0, myChart.canvas.width, myChart.canvas.height);
    }

    function setupEventListeners() {
        filterNameInput.addEventListener('input', filterTransactions);
        filterAmountInput.addEventListener('input', filterTransactions);

        generateChart(1);
    }

    initApp();
});

document.addEventListener('DOMContentLoaded', function() {
    const data = {
        "customers": [
            { "id": 1, "name": "Ahmed Ali" },
            { "id": 2, "name": "Aya Elsayed" },
            { "id": 3, "name": "Mina Adel" },
            { "id": 4, "name": "Sarah Reda" },
            { "id": 5, "name": "Mohamed Sayed" }
        ],
        "transactions": [
            { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
            { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
            { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
            { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
            { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
            { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
            { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
            { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
            { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
        ]
    };

    const customerIdSelect = document.getElementById('customerId');
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    function getTransactionsForCustomer(customerId) {
        return data.transactions.filter(transaction => transaction.customer_id === customerId);
    }

    function getUniqueDates(transactions) {
        return [...new Set(transactions.map(transaction => transaction.date))];
    }

    function calculateTotalAmountsPerDay(transactions, dates) {
        const totalAmounts = [];
        dates.forEach(date => {
            const total = transactions
                .filter(transaction => transaction.date === date)
                .reduce((sum, transaction) => sum + transaction.amount, 0);
            totalAmounts.push(total);
        });
        return totalAmounts;
    }

   
    function drawChart(customerId) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const transactions = getTransactionsForCustomer(customerId);
        const dates = getUniqueDates(transactions);
        const totalAmounts = calculateTotalAmountsPerDay(transactions, dates);

        const barWidth = (canvas.width - 40) / dates.length;
        const barSpacing = 20;
        const maxValue = Math.max(...totalAmounts);
        const scaleFactor = (canvas.height - 40) / maxValue;

        ctx.fillStyle = 'rgba(75, 192, 192, 0.7)';
        dates.forEach((date, index) => {
            const barHeight = totalAmounts[index] * scaleFactor;
            const x = 20 + index * (barWidth + barSpacing);
            const y = canvas.height - barHeight - 20;
            ctx.fillRect(x, y, barWidth, barHeight);

            
            ctx.fillStyle = '#000';
            ctx.fillText(date, x + barWidth / 2 - 20, canvas.height - 10);
        });
    }


    customerIdSelect.addEventListener('change', function() {
        const customerId = parseInt(customerIdSelect.value);
        drawChart(customerId);
    });


    drawChart(1);
});
