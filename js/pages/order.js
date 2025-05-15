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

    // Filter and Search functionality
    const statusFilter = document.getElementById('status-filter');
    const paymentFilter = document.getElementById('payment-filter');
    const searchInput = document.getElementById('order-search');
    const searchBtn = document.getElementById('search-btn');
    const orderRows = document.querySelectorAll('.order-row');

    // Function to check if a row matches all filters
    function matchesFilters(row) {
        const orderId = row.getAttribute('data-order-id').toLowerCase();
        const status = row.querySelector('td:nth-child(7) .badge').textContent.trim();
        const payment = row.querySelector('td:nth-child(6) .badge').textContent.trim();
        const searchTerm = searchInput.value.toLowerCase();

        // Check status filter
        const selectedStatus = statusFilter.value;
        if (selectedStatus && status !== selectedStatus) {
            return false;
        }

        // Check payment filter
        const selectedPayment = paymentFilter.value;
        if (selectedPayment && payment !== selectedPayment) {
            return false;
        }

        // Check search term
        if (searchTerm && !orderId.includes(searchTerm)) {
            return false;
        }

        return true;
    }

    // Function to apply filters
    function applyFilters() {
        orderRows.forEach(row => {
            if (matchesFilters(row)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        // Update pagination info
        updatePaginationInfo();
    }

    // Function to update pagination info
    function updatePaginationInfo() {
        const visibleRows = document.querySelectorAll('.order-row:not([style*="display: none"])');
        const totalRows = orderRows.length;
        const paginationInfo = document.querySelector('.text-muted');
        if (paginationInfo) {
            paginationInfo.textContent = `Hiển thị 1 đến ${visibleRows.length} của ${totalRows} mục`;
        }
    }

    // Add event listeners for filters
    statusFilter.addEventListener('change', applyFilters);
    paymentFilter.addEventListener('change', applyFilters);
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });

    // Add click event listener to all order rows
    orderRows.forEach(row => {
        row.addEventListener('click', function (e) {
            // Prevent click if clicking on action buttons
            if (e.target.closest('.btn')) {
                return;
            }

            const orderId = this.getAttribute('data-order-id');
            // Redirect to order detail page with order ID
            window.location.href = `order-detail.html?id=${orderId}`;
        });

        // Add hover effect
        row.style.cursor = 'pointer';
    });
});
