// Dropdown filter (demo)
document.addEventListener('DOMContentLoaded', function () {
    const filterBtn = document.getElementById('filter-month');
    if (filterBtn) {
        filterBtn.addEventListener('click', function () {
            alert('Tính năng lọc theo tháng sẽ được phát triển!');
        });
    }

    // Action buttons (demo)
    document.querySelectorAll('.action-view').forEach(btn => {
        btn.addEventListener('click', function () {
            alert('Xem chi tiết đơn hàng!');
        });
    });
    document.querySelectorAll('.action-edit').forEach(btn => {
        btn.addEventListener('click', function () {
            alert('Chỉnh sửa đơn hàng!');
        });
    });
    document.querySelectorAll('.action-delete').forEach(btn => {
        btn.addEventListener('click', function () {
            if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
                alert('Đã xóa đơn hàng!');
            }
        });
    });
});

// ========== DỮ LIỆU GIẢ LẬP ========== //
const orderNames = [
    'Gail C. Anderson', 'Jung S. Ayala', 'David A. Arnold', 'Cecile D. Gordon', 'John Doe', 'Jane Smith',
    'Michael Brown', 'Emily White', 'Chris Green', 'Anna Black', 'Tom Lee', 'Linda King', 'Peter Parker',
    'Bruce Wayne', 'Clark Kent', 'Diana Prince', 'Barry Allen', 'Hal Jordan', 'Arthur Curry', 'Victor Stone',
    'Selina Kyle', 'Lois Lane', 'Jimmy Olsen', 'Lex Luthor', 'Harvey Dent', 'Pamela Isley', 'Edward Nigma',
    'Oswald Cobblepot', 'Harleen Quinzel', 'Alfred Pennyworth'
];
const priorities = ['Normal', 'High'];
const paymentStatuses = ['Unpaid', 'Paid', 'Refund'];
const orderStatuses = ['Draft', 'Packaging', 'Completed', 'Canceled'];
const badgeMap = {
    'Unpaid': 'bg-warning text-dark',
    'Paid': 'bg-success',
    'Refund': 'bg-info text-dark',
    'Draft': 'bg-info text-dark',
    'Packaging': 'bg-warning text-dark',
    'Completed': 'bg-success',
    'Canceled': 'bg-danger',
    'Normal': 'bg-secondary',
    'High': 'bg-danger'
};

function randomDate() {
    const start = new Date(2024, 3, 1); // April 1, 2024
    const end = new Date(2024, 3, 30); // April 30, 2024
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function randomOrder(i) {
    const customer = orderNames[i % orderNames.length];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const total = (Math.random() * 2000 + 200).toFixed(2);
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const items = Math.floor(Math.random() * 6) + 1;
    const deliveryNumber = Math.random() > 0.7 ? `#D-${Math.floor(Math.random() * 1000000)}` : '-';
    const orderStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
    const orderId = `#${Math.floor(Math.random() * 900000 + 100000)}/80`;
    const date = randomDate();
    return {
        orderId, date, customer, priority, total, paymentStatus, items, deliveryNumber, orderStatus
    };
}

const ORDERS = Array.from({ length: 30 }, (_, i) => randomOrder(i));

// ========== PHÂN TRANG ========== //
const PAGE_SIZE = 7;
let currentPage = 1;
let filteredOrders = ORDERS;

function renderOrders(page = 1) {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';
    const start = (page - 1) * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, filteredOrders.length);
    for (let i = start; i < end; i++) {
        const o = filteredOrders[i];
        tbody.innerHTML += `
      <tr>
        <td>${o.orderId}</td>
        <td>${o.date}</td>
        <td class="text-primary">${o.customer}</td>
        <td><span class="badge ${badgeMap[o.priority]}">${o.priority}</span></td>
        <td>$${o.total}</td>
        <td><span class="badge ${badgeMap[o.paymentStatus]}">${o.paymentStatus}</span></td>
        <td>${o.items}</td>
        <td>${o.deliveryNumber}</td>
        <td><span class="badge ${badgeMap[o.orderStatus]}">${o.orderStatus}</span></td>
        <td>
          <button class="btn btn-light btn-sm" title="View"><i class="bi bi-eye"></i></button>
          <button class="btn btn-light btn-sm" title="Edit"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-light btn-sm text-danger" title="Delete"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `;
    }
}

function renderPagination() {
    const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
    const pagDiv = document.getElementById('orders-pagination');
    let html = '<nav><ul class="pagination justify-content-center mb-0">';
    html += `<li class="page-item${currentPage === 1 ? ' disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage - 1}">«</a></li>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item${i === currentPage ? ' active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }
    html += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}"><a class="page-link" href="#" data-page="${currentPage + 1}">»</a></li>`;
    html += '</ul></nav>';
    pagDiv.innerHTML = html;
    // Gán sự kiện click
    pagDiv.querySelectorAll('a.page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                currentPage = page;
                renderOrders(currentPage);
                renderPagination();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderOrders(currentPage);
    renderPagination();

    // Tìm kiếm theo Order ID
    const searchInput = document.getElementById('order-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const keyword = this.value.trim().toLowerCase();
            filteredOrders = ORDERS.filter(o => o.orderId.toLowerCase().includes(keyword));
            currentPage = 1;
            renderOrders(currentPage);
            renderPagination();
        });
    }

    // Chuyển sang order-detail khi click vào dòng order
    document.querySelectorAll('#orders-tbody tr').forEach(row => {
        row.addEventListener('click', function () {
            // Lấy orderId từ cột đầu tiên (hoặc có thể truyền qua query string)
            const orderId = this.querySelector('td').textContent.trim();
            window.location.href = 'order-detail.html?orderId=' + encodeURIComponent(orderId);
        });
    });
});
