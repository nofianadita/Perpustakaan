// --- INITIAL DATA & SEEDING ---
if (!localStorage.getItem('users')) {
    // Akun default untuk mempermudah testing penguji
    const defaultUsers = [
        { username: "admin1", password: "123", role: "admin" },
        { username: "user1", password: "123", role: "user" }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}
if (!localStorage.getItem('books')) {
    const defaultBooks = [
        { id: 1, title: "Laskar Pelangi", author: "Andrea Hirata", qty: 5 },
        { id: 2, title: "Bumi", author: "Tere Liye", qty: 3 }
    ];
    localStorage.setItem('books', JSON.stringify(defaultBooks));
}
if (!localStorage.getItem('borrows')) {
    localStorage.setItem('borrows', JSON.stringify([]));
}

let isLoginMode = true;
let currentUser = null;

// --- AUTHENTICATION LOGIC (Syarat 1) ---
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Login Masuk" : "Daftar Akun Baru";
    document.getElementById('btn-auth').innerText = isLoginMode ? "Masuk" : "Daftar";
    document.querySelector('.toggle-text').innerText = isLoginMode ? "Belum punya akun? Daftar di sini" : "Sudah punya akun? Login di sini";
}

document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    let users = JSON.parse(localStorage.getItem('users'));

    if (isLoginMode) {
        // Proses Login
        const user = users.find(u => u.username === username && u.password === password && u.role === role);
        if (user) {
            currentUser = user;
            alert(`Selamat datang, ${user.username}!`);
            showDashboard();
        } else {
            alert("Username, Password, atau Role salah!");
        }
    } else {
        // Proses Register
        if (users.some(u => u.username === username)) {
            alert("Username sudah digunakan!");
            return;
        }
        users.push({ username, password, role });
        localStorage.setItem('users', JSON.stringify(users));
        alert("Pendaftaran berhasil! Silakan login.");
        toggleAuthMode();
    }
    this.reset();
});

function showDashboard() {
    document.getElementById('auth-page').classList.add('hidden');
    if (currentUser.role === 'admin') {
        document.getElementById('admin-page').classList.remove('hidden');
        renderAdminTables();
    } else {
        document.getElementById('user-page').classList.remove('hidden');
        renderUserTables();
    }
}

function logout() {
    currentUser = null;
    document.getElementById('admin-page').classList.add('hidden');
    document.getElementById('user-page').classList.add('hidden');
    document.getElementById('auth-page').classList.remove('hidden');
}

// --- ADMIN CONTROL: CRUD BUKU (Syarat 3) ---
document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('edit-book-id').value;
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const qty = parseInt(document.getElementById('book-qty').value);
    let books = JSON.parse(localStorage.getItem('books'));

    if (id) {
        // Update Buku
        books = books.map(b => b.id == id ? { id: parseInt(id), title, author, qty } : b);
    } else {
        // Create Buku
        const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
        books.push({ id: newId, title, author, qty });
    }
    localStorage.setItem('books', JSON.stringify(books));
    resetBookForm();
    renderAdminTables();
});

function editBook(id) {
    const books = JSON.parse(localStorage.getItem('books'));
    const book = books.find(b => b.id === id);
    if (book) {
        document.getElementById('edit-book-id').value = book.id;
        document.getElementById('book-title').value = book.title;
        document.getElementById('book-author').value = book.author;
        document.getElementById('book-qty').value = book.qty;
        document.getElementById('btn-book-submit').innerText = "Update Buku";
        document.getElementById('btn-cancel-edit').classList.remove('hidden');
    }
}

function deleteBook(id) {
    if(confirm("Hapus buku ini dari katalog?")) {
        let books = JSON.parse(localStorage.getItem('books'));
        books = books.filter(b => b.id !== id);
        localStorage.setItem('books', JSON.stringify(books));
        renderAdminTables();
    }
}

function resetBookForm() {
    document.getElementById('bookForm').reset();
    document.getElementById('edit-book-id').value = "";
    document.getElementById('btn-book-submit').innerText = "Simpan Buku";
    document.getElementById('btn-cancel-edit').classList.add('hidden');
}


// --- ADMIN CONTROL: TAMBAH & EDIT PEMINJAM (Syarat 5) ---
document.getElementById('borrowForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('edit-borrow-id').value;
    const name = document.getElementById('borrower-name').value;
    const bookTitle = document.getElementById('borrow-book').value;
    const date = document.getElementById('borrow-date').value;
    let borrows = JSON.parse(localStorage.getItem('borrows'));

    if (id) {
        // Update data peminjaman
        borrows = borrows.map(b => b.id == id ? { id: parseInt(id), name, bookTitle, date } : b);
    } else {
        // Tambah data peminjaman baru
        const newId = borrows.length > 0 ? Math.max(...borrows.map(b => b.id)) + 1 : 1;
        borrows.push({ id: newId, name, bookTitle, date });
    }
    localStorage.setItem('borrows', JSON.stringify(borrows));
    resetBorrowForm();
    renderAdminTables();
});

function editBorrow(id) {
    const borrows = JSON.parse(localStorage.getItem('borrows'));
    const borrow = borrows.find(b => b.id === id);
    if (borrow) {
        document.getElementById('edit-borrow-id').value = borrow.id;
        document.getElementById('borrower-name').value = borrow.name;
        document.getElementById('borrow-book').value = borrow.bookTitle;
        document.getElementById('borrow-date').value = borrow.date;
        document.getElementById('btn-borrow-submit').innerText = "Update Peminjam";
        document.getElementById('btn-cancel-borrow-edit').classList.remove('hidden');
    }
}

function deleteBorrow(id) {
    if(confirm("Hapus data peminjaman ini?")) {
        let borrows = JSON.parse(localStorage.getItem('borrows'));
        borrows = borrows.filter(b => b.id !== id);
        localStorage.setItem('borrows', JSON.stringify(borrows));
        renderAdminTables();
    }
}

function resetBorrowForm() {
    document.getElementById('borrowForm').reset();
    document.getElementById('edit-borrow-id').value = "";
    document.getElementById('btn-borrow-submit').innerText = "Simpan Data Peminjam";
    document.getElementById('btn-cancel-borrow-edit').classList.add('hidden');
}


// --- PENGGUNA CONTROL: MELIHAT & MEMINJAM (Syarat 4) ---
function userBorrowBook(bookId) {
    let books = JSON.parse(localStorage.getItem('books'));
    let borrows = JSON.parse(localStorage.getItem('borrows'));
    const bookIndex = books.findIndex(b => b.id === bookId);

    if (bookIndex !== -1) {
        if (books[bookIndex].qty > 0) {
            // Kurangi stok buku
            books[bookIndex].qty -= 1;
            
            // Catat ke daftar peminjaman
            const newBorrowId = borrows.length > 0 ? Math.max(...borrows.map(b => b.id)) + 1 : 1;
            const today = new Date().toISOString().split('T')[0];
            
            borrows.push({
                id: newBorrowId,
                name: currentUser.username,
                bookTitle: books[bookIndex].title,
                date: today
            });

            localStorage.setItem('books', JSON.stringify(books));
            localStorage.setItem('borrows', JSON.stringify(borrows));
            alert(`Berhasil meminjam buku "${books[bookIndex].title}"!`);
            renderUserTables();
        } else {
            alert("Maaf, stok buku ini sedang habis!");
        }
    }
}


// --- RENDER TABLES MANAGEMENT ---

// Render Sisi Admin (Syarat 2)
function renderAdminTables() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const borrows = JSON.parse(localStorage.getItem('borrows')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Tabel Buku Admin
    const bookBody = document.getElementById('admin-book-table');
    bookBody.innerHTML = '';
    books.forEach(b => {
        bookBody.innerHTML += `<tr>
            <td>${b.title}</td><td>${b.author}</td><td>${b.qty}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editBook(${b.id})">Edit</button>
                <button class="btn-action btn-del" onclick="deleteBook(${b.id})">Hapus</button>
            </td>
        </tr>`;
    });

    // Tabel Peminjam Admin
    const borrowBody = document.getElementById('admin-borrow-table');
    borrowBody.innerHTML = '';
    borrows.forEach(b => {
        borrowBody.innerHTML += `<tr>
            <td>${b.name}</td><td>${b.bookTitle}</td><td>${b.date}</td>
            <td>
                <button class="btn-action btn-edit" onclick="editBorrow(${b.id})">Edit</button>
                <button class="btn-action btn-del" onclick="deleteBorrow(${b.id})">Hapus</button>
            </td>
        </tr>`;
    });

    // Tabel Semua Akun Pengguna Admin
    const userBody = document.getElementById('admin-user-table');
    userBody.innerHTML = '';
    users.forEach(u => {
        userBody.innerHTML += `<tr><td>${u.username}</td><td><span class="badge">${u.role}</span></td></tr>`;
    });
}

// Render Sisi Pengguna
