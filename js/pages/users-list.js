document.addEventListener('DOMContentLoaded', function () {
    // Get all user rows
    const userRows = document.querySelectorAll('tbody tr');
    const roleFilter = document.querySelector('select:nth-of-type(1)');
    const statusFilter = document.querySelector('select:nth-of-type(2)');
    const searchInput = document.querySelector('.input-group input');
    const searchButton = document.querySelector('.input-group button');

    // Add click event listener to all user rows
    userRows.forEach(row => {
        row.addEventListener('click', function (e) {
            // Prevent click if clicking on action buttons
            if (e.target.closest('.btn')) {
                return;
            }

            // Get user ID from the row (assuming it's in the first column)
            const userId = this.querySelector('td:first-child').textContent;
            // Redirect to user profile page with user ID
            window.location.href = `users-profile.html?id=${userId}`;
        });

        // Add hover effect
        row.style.cursor = 'pointer';
    });

    // Function to filter users
    function filterUsers() {
        const selectedRole = roleFilter.value;
        const selectedStatus = statusFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        userRows.forEach(row => {
            const roleText = row.querySelector('td:nth-child(6) span').textContent.trim();
            const statusText = row.querySelector('td:nth-child(8) span').textContent.trim();
            const name = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const email = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const phone = row.querySelector('td:nth-child(5)').textContent.toLowerCase();

            // Map role values to match select options
            let roleValue;
            switch (roleText) {
                case 'Admin':
                    roleValue = '1';
                    break;
                case 'Quản lý':
                    roleValue = '2';
                    break;
                case 'Nhân viên':
                    roleValue = '3';
                    break;
                case 'Khách hàng':
                    roleValue = '4';
                    break;
                default:
                    roleValue = '';
            }

            // Map status values to match select options
            let statusValue;
            switch (statusText) {
                case 'Hoạt động':
                    statusValue = '1';
                    break;
                case 'Khóa':
                    statusValue = '2';
                    break;
                case 'Chờ xác nhận':
                    statusValue = '3';
                    break;
                default:
                    statusValue = '';
            }

            const matchesRole = !selectedRole || roleValue === selectedRole;
            const matchesStatus = !selectedStatus || statusValue === selectedStatus;
            const matchesSearch = !searchTerm ||
                name.includes(searchTerm) ||
                email.includes(searchTerm) ||
                phone.includes(searchTerm);

            row.style.display = matchesRole && matchesStatus && matchesSearch ? '' : 'none';
        });

        updatePagination();
    }

    // Function to update pagination
    function updatePagination() {
        const visibleRows = document.querySelectorAll('tbody tr:not([style*="display: none"])');
        const totalItems = visibleRows.length;
        const itemsPerPage = 10; // You can adjust this number
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Update the "Showing X to Y of Z items" text
        const showingText = document.querySelector('.text-muted');
        showingText.textContent = `Hiển thị 1 đến ${Math.min(totalItems, itemsPerPage)} của ${totalItems} mục`;

        // Update pagination buttons
        const pagination = document.querySelector('.pagination');
        pagination.innerHTML = `
            <li class="page-item disabled">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            ${Array.from({ length: totalPages }, (_, i) => `
                <li class="page-item ${i === 0 ? 'active' : ''}">
                    <a class="page-link" href="#">${i + 1}</a>
                </li>
            `).join('')}
            <li class="page-item ${totalPages <= 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;
    }

    // Add event listeners for filters and search
    roleFilter.addEventListener('change', filterUsers);
    statusFilter.addEventListener('change', filterUsers);
    searchButton.addEventListener('click', filterUsers);
    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            filterUsers();
        }
    });

    // Initialize pagination
    updatePagination();
});
