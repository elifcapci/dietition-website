// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.blog-card, .contact-item, .credential');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// WhatsApp button click tracking
document.querySelector('.btn-whatsapp').addEventListener('click', () => {
    // You can add analytics tracking here
    console.log('WhatsApp button clicked');
});

// Blog card hover effects
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Contact form validation (if you add a form later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add loading animation to images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        // Fix: If image is already loaded (from cache), show it
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class to nav links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Back to top button (optional)
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4a7c59;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(74, 124, 89, 0.3);
`;

document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopButton.addEventListener('mouseenter', () => {
    backToTopButton.style.transform = 'translateY(-3px)';
    backToTopButton.style.boxShadow = '0 6px 20px rgba(74, 124, 89, 0.4)';
});

backToTopButton.addEventListener('mouseleave', () => {
    backToTopButton.style.transform = 'translateY(0)';
    backToTopButton.style.boxShadow = '0 4px 12px rgba(74, 124, 89, 0.3)';
}); 

// Dynamically load and render blog posts from blog-data.json
function renderBlogPosts() {
    fetch('blog-data.json')
        .then(response => response.json())
        .then(data => {
            const posts = data.posts.filter(post => post.status === 'published');
            const blogGrid = document.querySelector('.blog-grid.main-carousel-list');
            const leftArrow = document.getElementById('main-carousel-left');
            const rightArrow = document.getElementById('main-carousel-right');
            const dotsContainer = document.getElementById('main-carousel-dots');
            if (!blogGrid) return;
            let position = 0;
            const blogsPerPage = 4;
            const totalPages = Math.ceil(posts.length / blogsPerPage);

            function renderPage(page) {
                if (blogGrid) {
                    blogGrid.classList.add('fading');
                    setTimeout(() => {
                        blogGrid.innerHTML = '';
                        const start = page * blogsPerPage;
                        const end = start + blogsPerPage;
                        posts.slice(start, end).forEach(post => {
                            const article = document.createElement('article');
                            article.className = 'blog-card main-carousel-card';
                            article.innerHTML = `
                                <div class="blog-image">
                                    <img src="${post.image}" alt="${post.title}" class="blog-img">
                                </div>
                                <div class="blog-content">
                                    <div class="blog-meta">
                                        <span class="blog-date">${new Date(post.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        <span class="blog-category">${data.categories.find(cat => cat.id === post.category)?.name || ''}</span>
                                    </div>
                                    <h3 class="blog-title">${post.title}</h3>
                                    <p class="blog-excerpt">${post.excerpt}</p>
                                    <a href="blog-post.html?id=${post.id}" class="read-more">Devamını Oku</a>
                                </div>
                            `;
                            blogGrid.appendChild(article);
                        });
                        renderDots(page);
                        blogGrid.classList.remove('fading');
                    }, 500);
                }
            }

            function renderDots(activePage) {
                if (!dotsContainer) return;
                dotsContainer.innerHTML = '';
                for (let i = 0; i < totalPages; i++) {
                    const dot = document.createElement('span');
                    dot.className = 'carousel-dot' + (i === activePage ? ' active' : '');
                    dot.setAttribute('data-page', i);
                    dot.addEventListener('click', () => {
                        position = i;
                        renderPage(position);
                    });
                    dotsContainer.appendChild(dot);
                }
            }

            if (leftArrow && rightArrow) {
                leftArrow.onclick = () => {
                    if (position > 0) {
                        position--;
                        renderPage(position);
                    }
                };
                rightArrow.onclick = () => {
                    if (position < totalPages - 1) {
                        position++;
                        renderPage(position);
                    }
                };
            }

            // Initial render
            renderPage(position);
        })
        .catch(err => {
            console.error('Blog verileri yüklenemedi:', err);
        });
}

document.addEventListener('DOMContentLoaded', renderBlogPosts); 