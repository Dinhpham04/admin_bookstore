document.addEventListener('DOMContentLoaded', function () {
    // Get all book rows
    const bookRows = document.querySelectorAll('tbody tr');
    const categoryFilter = document.querySelector('#category-filter');
    const stockStatusFilter = document.querySelector('#stock-status-filter');
    const searchInput = document.querySelector('#product-search');
    const searchButton = document.querySelector('#search-btn');

    // Add click event listener to all book rows
    bookRows.forEach(row => {
        row.addEventListener('click', function (e) {
            // Prevent click if clicking on action buttons
            if (e.target.closest('.btn')) {
                return;
            }

            // Get book ID from the row
            const bookId = this.dataset.bookId;
            // Redirect to book detail page
            window.location.href = `book-detail.jsp?id=${bookId}`;
        });

        // Add hover effect
        row.style.cursor = 'pointer';
    });

    // Function to filter books
    function filterBooks() {
        const selectedCategory = categoryFilter.value;
        const selectedStatus = stockStatusFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        bookRows.forEach(row => {
            const category = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
            const status = row.querySelector('td:nth-child(9) span').textContent.toLowerCase();
            const name = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            const author = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const bookId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

            const matchesCategory = !selectedCategory || category.includes(selectedCategory.toLowerCase());
            const matchesStatus = !selectedStatus || status === selectedStatus.toLowerCase();
            const matchesSearch = !searchTerm ||
                name.includes(searchTerm) ||
                author.includes(searchTerm) ||
                bookId.includes(searchTerm);

            row.style.display = matchesCategory && matchesStatus && matchesSearch ? '' : 'none';
        });

        updatePagination();
    }

    // Function to update pagination
    function updatePagination() {
        const visibleRows = document.querySelectorAll('tbody tr:not([style*="display: none"])');
        const totalItems = visibleRows.length;
        const itemsPerPage = 10;
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

    // Function to check stock status
    function checkStockStatus(quantity, minStock) {
        if (quantity <= 0) return 'Hết';
        if (quantity <= minStock) return 'Thấp';
        return 'Đủ';
    }

    // Function to update stock status badge
    function updateStockStatusBadge(row, status) {
        const badge = row.querySelector('td:nth-child(9) span');
        badge.textContent = status;
        badge.className = 'badge';

        switch (status) {
            case 'Đủ':
                badge.classList.add('bg-success');
                break;
            case 'Thấp':
                badge.classList.add('bg-warning');
                break;
            case 'Hết':
                badge.classList.add('bg-danger');
                break;
        }
    }

    // Function to calculate new average import price
    function calculateNewAveragePrice(currentAvg, currentStock, newPrice, newQuantity) {
        const totalValue = (currentAvg * currentStock) + (newPrice * newQuantity);
        const totalQuantity = currentStock + newQuantity;
        return Math.round(totalValue / totalQuantity);
    }

    // Function to handle stock import
    function handleStockImport(bookId, quantity, importPrice, note) {
        // Find the book row
        const bookRow = Array.from(bookRows).find(row => row.dataset.bookId === bookId);

        if (bookRow) {
            // Get current stock, min stock and average import price
            const currentStock = parseInt(bookRow.querySelector('td:nth-child(6)').textContent);
            const minStock = parseInt(bookRow.dataset.minStock);
            const currentAvgPrice = parseInt(bookRow.dataset.avgImportPrice);

            // Update stock
            const newStock = currentStock + quantity;
            bookRow.querySelector('td:nth-child(6)').textContent = newStock;

            // Calculate and update average import price
            const newAvgPrice = calculateNewAveragePrice(currentAvgPrice, currentStock, importPrice, quantity);
            bookRow.dataset.avgImportPrice = newAvgPrice;
            bookRow.querySelector('td:nth-child(7)').textContent = newAvgPrice.toLocaleString();

            // Update stock status
            const newStatus = checkStockStatus(newStock, minStock);
            updateStockStatusBadge(bookRow, newStatus);

            // Show success message
            alert('Nhập kho thành công!');
        }
    }

    // Add event listeners for filters and search
    categoryFilter.addEventListener('change', filterBooks);
    stockStatusFilter.addEventListener('change', filterBooks);
    searchButton.addEventListener('click', filterBooks);
    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            filterBooks();
        }
    });

    // Add event listener for import stock button in table
    document.querySelectorAll('.btn-import').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const bookId = row.dataset.bookId;
            const bookName = row.querySelector('td:nth-child(3)').textContent;
            const currentAvgPrice = row.dataset.avgImportPrice;

            // Set values in quick import modal
            document.getElementById('quickImportBookId').value = bookId;
            document.getElementById('quickImportBookName').value = bookName;
            document.getElementById('quickImportPrice').value = currentAvgPrice;

            // Show quick import modal
            const quickImportModal = new bootstrap.Modal(document.getElementById('quickImportModal'));
            quickImportModal.show();
        });
    });

    // Add event listener for quick import form submission
    document.getElementById('saveQuickImportBtn').addEventListener('click', function () {
        const bookId = document.getElementById('quickImportBookId').value;
        const quantity = parseInt(document.getElementById('quickImportQuantity').value);
        const importPrice = parseInt(document.getElementById('quickImportPrice').value);
        const note = document.getElementById('quickImportNote').value;

        if (bookId && quantity && importPrice) {
            handleStockImport(bookId, quantity, importPrice, note);
            const quickImportModal = bootstrap.Modal.getInstance(document.getElementById('quickImportModal'));
            quickImportModal.hide();
        } else {
            alert('Vui lòng điền đầy đủ thông tin!');
        }
    });

    // Add event listener for main import form submission
    document.getElementById('saveImportBtn').addEventListener('click', function () {
        const bookId = document.getElementById('importProduct').value;
        const quantity = parseInt(document.getElementById('importQuantity').value);
        const importPrice = parseInt(document.getElementById('importPrice').value);
        const note = document.getElementById('importNote').value;

        if (bookId && quantity && importPrice) {
            handleStockImport(bookId, quantity, importPrice, note);
            const importModal = bootstrap.Modal.getInstance(document.getElementById('importStockModal'));
            importModal.hide();
        } else {
            alert('Vui lòng điền đầy đủ thông tin!');
        }
    });

    // Initialize pagination
    updatePagination();
});
