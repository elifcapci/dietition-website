// Admin Authentication
const ADMIN_USERNAME = 'melis';
const ADMIN_PASSWORD = 'melis123';

// Blog Posts Storage
let blogPosts = [];

function fetchBlogPostsAndUpdateDashboard() {
    fetch('blog-data.json')
        .then(response => response.json())
        .then(data => {
            blogPosts = data.posts;
            loadDashboard();
            loadManagePosts();
        })
        .catch(err => {
            console.error('Blog verileri yüklenemedi:', err);
        });
}

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
}

// Login System
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            alert('Hatalı kullanıcı adı veya şifre!');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        showLogin();
    });

    function showDashboard() {
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'block';
        fetchBlogPostsAndUpdateDashboard();
    }

    function showLogin() {
        loginScreen.style.display = 'flex';
        adminDashboard.style.display = 'none';
        loginForm.reset();
    }
});

// Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Show target section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
});

// Dashboard Loading
function loadDashboard() {
    updateStats();
    loadRecentPosts();
}

function updateStats() {
    const totalPosts = blogPosts.length;
    const publishedPosts = blogPosts.filter(post => post.status === 'published').length;
    const totalViews = blogPosts.reduce((sum, post) => sum + (post.views || 0), 0);

    document.getElementById('totalPosts').textContent = totalPosts;
    document.getElementById('totalViews').textContent = totalViews.toLocaleString();
    document.getElementById('monthlyPosts').textContent = publishedPosts;
}

function loadRecentPosts() {
    const recentPostsList = document.getElementById('recentPostsList');
    const recentPosts = blogPosts.slice(0, 5);

    recentPostsList.innerHTML = recentPosts.map(post => `
        <div class="post-item">
            <div class="post-info">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">${post.date} • ${post.views || 0} görüntülenme</div>
            </div>
            <div class="post-actions">
                <button class="btn-edit" onclick="editPost(${post.id})">Düzenle</button>
                <button class="btn-delete" onclick="deletePost(${post.id})">Sil</button>
            </div>
        </div>
    `).join('');
}

// Rich Text Editor
document.addEventListener('DOMContentLoaded', function() {
    const toolbarBtns = document.querySelectorAll('.toolbar-btn');
    const contentEditor = document.getElementById('postContent');

    toolbarBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const command = this.getAttribute('data-command');
            document.execCommand(command, false, null);
            contentEditor.focus();
        });
    });
});

// New Post Form
document.addEventListener('DOMContentLoaded', function() {
    const newPostForm = document.getElementById('newPostForm');
    const saveDraftBtn = document.getElementById('saveDraft');

    newPostForm.addEventListener('submit', function(e) {
        e.preventDefault();
        savePost('published');
    });

    saveDraftBtn.addEventListener('click', function() {
        savePost('draft');
    });
});

function savePost(status) {
    const title = document.getElementById('postTitle').value;
    const excerpt = document.getElementById('postExcerpt').value;
    const content = document.getElementById('postContent').innerHTML;
    const category = document.getElementById('postCategory').value;
    const tags = document.getElementById('postTags').value.split(',').map(tag => tag.trim());
    const image = document.getElementById('postImage').files[0];

    if (!title || !excerpt || !content || !category) {
        alert('Lütfen tüm gerekli alanları doldurun!');
        return;
    }

    const newPost = {
        id: Date.now(),
        title: title,
        excerpt: excerpt,
        content: content,
        category: category,
        tags: tags,
        image: image ? URL.createObjectURL(image) : 'assets/blog-default.jpg',
        date: new Date().toISOString().split('T')[0],
        status: status,
        views: 0
    };

    // Send to backend API
    fetch('/api/save-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
    })
    .then(response => {
        if (!response.ok) throw new Error('Sunucuya kaydedilemedi!');
        return response.json();
    })
    .then(data => {
        alert(status === 'published' ? 'Blog yazısı yayınlandı!' : 'Taslak kaydedildi!');
        // After saving, reload blog posts and update dashboard
        fetchBlogPostsAndUpdateDashboard();
    })
    .catch(err => {
        alert('Bir hata oluştu: ' + err.message);
    });

    // Reset form
    document.getElementById('newPostForm').reset();
    document.getElementById('postContent').innerHTML = '';

    // Switch to manage posts section
    document.querySelector('[data-section="manage-posts"]').click();
}

// Manage Posts
function loadManagePosts() {
    const postsList = document.getElementById('postsList');
    
    postsList.innerHTML = blogPosts.map(post => `
        <div class="post-item">
            <div class="post-info">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">${post.date} • ${post.category} • ${post.status}</div>
            </div>
            <div class="post-actions">
                <button class="btn-edit" onclick="editPost(${post.id})">Düzenle</button>
                <button class="btn-delete" onclick="deletePost(${post.id})">Sil</button>
            </div>
        </div>
    `).join('');
}

function editPost(postId) {
    const post = blogPosts.find(p => p.id === postId);
    if (!post) return;

    // Fill form with post data
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postExcerpt').value = post.excerpt;
    document.getElementById('postContent').innerHTML = post.content;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postTags').value = post.tags.join(', ');

    // Switch to new post section
    document.querySelector('[data-section="new-post"]').click();
}

function deletePost(postId) {
    if (confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
        blogPosts = blogPosts.filter(p => p.id !== postId);
        savePosts();
        loadManagePosts();
        loadDashboard();
    }
}

// Search and Filter
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchPosts');
    const filterCategory = document.getElementById('filterCategory');

    searchInput.addEventListener('input', filterPosts);
    filterCategory.addEventListener('change', filterPosts);
});

function filterPosts() {
    const searchTerm = document.getElementById('searchPosts').value.toLowerCase();
    const categoryFilter = document.getElementById('filterCategory').value;

    const filteredPosts = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
                            post.excerpt.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || post.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });

    const postsList = document.getElementById('postsList');
    postsList.innerHTML = filteredPosts.map(post => `
        <div class="post-item">
            <div class="post-info">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">${post.date} • ${post.category} • ${post.status}</div>
            </div>
            <div class="post-actions">
                <button class="btn-edit" onclick="editPost(${post.id})">Düzenle</button>
                <button class="btn-delete" onclick="deletePost(${post.id})">Sil</button>
            </div>
        </div>
    `).join('');
}

// Load manage posts when section is shown
document.addEventListener('DOMContentLoaded', function() {
    const managePostsLink = document.querySelector('[data-section="manage-posts"]');
    managePostsLink.addEventListener('click', function() {
        setTimeout(loadManagePosts, 100);
    });
});