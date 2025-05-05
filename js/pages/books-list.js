// Add Book Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Quill Editor
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean']
            ]
        }
    });

    // Ensure first tab is active by default
    const firstTab = document.querySelector('.nav-tabs-bordered .nav-link');
    const firstTabContent = document.querySelector('.tab-content .tab-pane');
    if (firstTab && firstTabContent) {
        firstTab.classList.add('active');
        firstTabContent.classList.add('show', 'active');
    }

    // Handle tab navigation
    const tabs = document.querySelectorAll('.nav-tabs-bordered .nav-link');
    const tabContents = document.querySelectorAll('.tab-content .tab-pane');
    const nextButtons = document.querySelectorAll('.next-tab');
    const prevButtons = document.querySelectorAll('.prev-tab');

    nextButtons.forEach(button => {
        button.addEventListener('click', function () {
            const currentTab = document.querySelector('.nav-tabs-bordered .nav-link.active');
            const currentTabContent = document.querySelector('.tab-content .tab-pane.show.active');
            const nextTab = currentTab.parentElement.nextElementSibling?.querySelector('.nav-link');
            const nextTabContent = currentTabContent.nextElementSibling;

            if (nextTab && nextTabContent) {
                currentTab.classList.remove('active');
                currentTabContent.classList.remove('show', 'active');
                nextTab.classList.add('active');
                nextTabContent.classList.add('show', 'active');
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function () {
            const currentTab = document.querySelector('.nav-tabs-bordered .nav-link.active');
            const currentTabContent = document.querySelector('.tab-content .tab-pane.show.active');
            const prevTab = currentTab.parentElement.previousElementSibling?.querySelector('.nav-link');
            const prevTabContent = currentTabContent.previousElementSibling;

            if (prevTab && prevTabContent) {
                currentTab.classList.remove('active');
                currentTabContent.classList.remove('show', 'active');
                prevTab.classList.add('active');
                prevTabContent.classList.add('show', 'active');
            }
        });
    });

    // Handle image uploads
    const frontCoverImageUpload = document.getElementById('frontCoverImageUpload');
    const frontCoverImageInput = document.getElementById('frontCoverImage');
    const frontCoverPreview = document.getElementById('frontCoverPreview');
    const backCoverImageUpload = document.getElementById('backCoverImageUpload');
    const backCoverImageInput = document.getElementById('backCoverImage');
    const backCoverPreview = document.getElementById('backCoverPreview');
    const galleryImageUpload = document.getElementById('galleryImageUpload');
    const galleryImageInput = document.getElementById('galleryImage');
    const galleryPreview = document.getElementById('galleryPreview');

    // Front cover image upload
    frontCoverImageUpload.addEventListener('click', () => frontCoverImageInput.click());
    frontCoverImageUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        frontCoverImageUpload.style.borderColor = '#4154f1';
    });
    frontCoverImageUpload.addEventListener('dragleave', () => {
        frontCoverImageUpload.style.borderColor = '#dbe2ef';
    });
    frontCoverImageUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        frontCoverImageUpload.style.borderColor = '#dbe2ef';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            frontCoverImageInput.files = e.dataTransfer.files;
            previewImage(file, frontCoverPreview);
        }
    });
    frontCoverImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            previewImage(file, frontCoverPreview);
        }
    });

    // Back cover image upload
    backCoverImageUpload.addEventListener('click', () => backCoverImageInput.click());
    backCoverImageUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        backCoverImageUpload.style.borderColor = '#4154f1';
    });
    backCoverImageUpload.addEventListener('dragleave', () => {
        backCoverImageUpload.style.borderColor = '#dbe2ef';
    });
    backCoverImageUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        backCoverImageUpload.style.borderColor = '#dbe2ef';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            backCoverImageInput.files = e.dataTransfer.files;
            previewImage(file, backCoverPreview);
        }
    });
    backCoverImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            previewImage(file, backCoverPreview);
        }
    });

    // Gallery images upload
    galleryImageUpload.addEventListener('click', () => galleryImageInput.click());
    galleryImageUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        galleryImageUpload.style.borderColor = '#4154f1';
    });
    galleryImageUpload.addEventListener('dragleave', () => {
        galleryImageUpload.style.borderColor = '#dbe2ef';
    });
    galleryImageUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        galleryImageUpload.style.borderColor = '#dbe2ef';
        const files = e.dataTransfer.files;
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                previewImage(file, galleryPreview);
            }
        });
    });
    galleryImageInput.addEventListener('change', (e) => {
        const files = e.target.files;
        Array.from(files).forEach(file => {
            previewImage(file, galleryPreview);
        });
    });

    // Preview image function
    function previewImage(file, container) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            container.innerHTML = '';
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    }

    // Handle form submission
    const form = document.querySelector('#addBookModal form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Update hidden input with Quill content
        document.getElementById('fullDescription').value = quill.root.innerHTML;

        // Validate form
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        // TODO: Handle form submission
        console.log('Form submitted');

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addBookModal'));
        modal.hide();
    });
});

// ========== DỮ LIỆU GIẢ LẬP SÁCH TỪ BẢNG GỐC ========== //
const BOOKS_SAMPLE = [
    {
        id: '1',
        img: 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_195509_1_36793.jpg',
        name: 'Nhà giả kim',
        author: 'Paulo Coelho',
        category: 'Văn học',
        price: '120.000₫',
        stock: 100,
        status: 'Còn hàng',
        badge: 'bg-success'
    },
    {
        id: '2',
        img: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8934974182375.jpg',
        name: 'Người đàn ông mang tên Ove',
        author: 'Fredrik Backman',
        category: 'Văn học',
        price: '145.000₫',
        stock: 50,
        status: 'Còn hàng',
        badge: 'bg-success'
    },
    {
        id: '3',
        img: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8932000134749_1.jpg',
        name: 'Trường ca Achilles',
        author: 'Madeline Miller',
        category: 'Văn học',
        price: '190.000₫',
        stock: 0,
        status: 'Hết hàng',
        badge: 'bg-danger'
    },
    {
        id: '4',
        img: 'https://cdn1.fahasa.com/media/catalog/product/8/9/8935235238978.jpg',
        name: 'MBA Bằng Hình',
        author: 'Jason Barron',
        category: 'Kinh tế',
        price: '215.000₫',
        stock: 20,
        status: 'Sắp hết',
        badge: 'bg-warning text-dark'
    },
    {
        id: '5',
        img: 'https://cdn1.fahasa.com/media/catalog/product/i/m/image_217480.jpg',
        name: 'Cây cam ngọt của tôi',
        author: 'José Mauro de Vasconcelos',
        category: 'Văn học',
        price: '108.000₫',
        stock: 150,
        status: 'Còn hàng',
        badge: 'bg-success'
    }
];

// Lặp lại để tạo 30 bản ghi
const BOOKS = Array.from({ length: 30 }, (_, i) => {
    const b = BOOKS_SAMPLE[i % BOOKS_SAMPLE.length];
    return {
        ...b,
        id: (i + 1).toString()
    };
});

// ========== PHÂN TRANG & TÌM KIẾM ========== //
const BOOKS_PAGE_SIZE = 7;
let booksCurrentPage = 1;
let filteredBooks = BOOKS;

function renderBooks(page = 1) {
    const tbody = document.getElementById('books-tbody');
    tbody.innerHTML = '';
    const start = (page - 1) * BOOKS_PAGE_SIZE;
    const end = Math.min(start + BOOKS_PAGE_SIZE, filteredBooks.length);
    for (let i = start; i < end; i++) {
        const b = filteredBooks[i];
        tbody.innerHTML += `
      <tr class="clickable-row" data-href="product-detail.html">
        <td>${b.id}</td>
        <td><img src="${b.img}" height="60" style="object-fit: contain;"></td>
        <td><span class="product-name"><strong>${b.name}</strong></span></td>
        <td>${b.author}</td>
        <td>${b.category}</td>
        <td>${b.price}</td>
        <td>${b.stock}</td>
        <td><span class="badge ${b.badge}">${b.status}</span></td>
        <td class="text-center">
          <button class="btn btn-sm btn-primary" title="Chỉnh sửa" onclick="event.stopPropagation()"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-sm btn-danger" title="Xóa" onclick="event.stopPropagation()"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `;
    }
}

function renderBooksPagination() {
    const totalPages = Math.ceil(filteredBooks.length / BOOKS_PAGE_SIZE);
    const pagDiv = document.getElementById('books-pagination');
    let html = '<nav><ul class="pagination justify-content-center mb-0">';
    html += `<li class="page-item${booksCurrentPage === 1 ? ' disabled' : ''}"><a class="page-link" href="#" data-page="${booksCurrentPage - 1}">«</a></li>`;
    for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item${i === booksCurrentPage ? ' active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }
    html += `<li class="page-item${booksCurrentPage === totalPages ? ' disabled' : ''}"><a class="page-link" href="#" data-page="${booksCurrentPage + 1}">»</a></li>`;
    html += '</ul></nav>';
    pagDiv.innerHTML = html;
    // Gán sự kiện click
    pagDiv.querySelectorAll('a.page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = parseInt(this.getAttribute('data-page'));
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                booksCurrentPage = page;
                renderBooks(booksCurrentPage);
                renderBooksPagination();
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderBooks(booksCurrentPage);
    renderBooksPagination();

    // Tìm kiếm theo tên sách
    const searchInput = document.getElementById('book-search');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const keyword = this.value.trim().toLowerCase();
            filteredBooks = BOOKS.filter(b => b.name.toLowerCase().includes(keyword));
            booksCurrentPage = 1;
            renderBooks(booksCurrentPage);
            renderBooksPagination();
        });
    }
}); 