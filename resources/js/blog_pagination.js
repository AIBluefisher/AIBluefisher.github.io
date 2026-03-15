// Blog pagination
(function() {
    // Blog posts data
    const blogPosts = [
        {
            id: 1,
            title: "和 3D Vision 相遇的八年",
            date: "2026-03-15",
            readTime: 6,
            category: "PhD",
            tags: ["PhD", "reconstruction", "3D"],
            excerpt: "Thoughts on 3D computer vision, and the journey of my PhD career.",
            image: "./resources/images/blog01_teaser.jpg",
            url: "./blog-posts/my_phd_journey.html",
            featured: true
        },
        {
            id: 2,
            title: "NeRF vs 3DGS: a unified view",
            date: "2026-01-15",
            readTime: 9,
            category: "NeRF",
            tags: ["NeRF", "math"],
            excerpt: "Deriving the rendering equations, comparison of volumetric vs. splatting, and where we can expect convergence.",
            image: "./resources/anti_aliasing_gaussian.gif",
            // url: "./blog-posts/nerf-vs-3dgs.html"
        },
    ];

    const POSTS_PER_PAGE = 3; // Show 3 posts per page
    let currentPage = 1;
    const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);

    // Function to format date
    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString(undefined, options);
    }

    // Function to render blog posts for current page
    function renderBlogPosts() {
        const container = document.getElementById('blogPostsContainer');
        if (!container) return;

        const start = (currentPage - 1) * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;
        const currentPosts = blogPosts.slice(start, end);

        container.innerHTML = currentPosts.map(post => `
            <article class="blog-post-card">
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" onerror="this.src='./resources/profile.jpg'">
                    ${post.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="blog-date"><i class="far fa-calendar-alt"></i> ${formatDate(post.date)}</span>
                        <span class="blog-reading"><i class="far fa-clock"></i> ${post.readTime} min read</span>
                        <span class="blog-category"><i class="fas fa-folder"></i> ${post.category}</span>
                    </div>
                    <h4 class="blog-card-title">${post.title}</h4>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <div class="blog-card-tags">
                        ${post.tags.map(tag => `<span class="tag"><i class="fas fa-tag"></i> ${tag}</span>`).join('')}
                    </div>
                    <a href="${post.url}" class="blog-card-link">Read full article <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `).join('');

        // Update pagination buttons
        updatePaginationButtons();
    }

    // Function to update pagination buttons
    function updatePaginationButtons() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const paginationNumbers = document.getElementById('paginationNumbers');

        if (prevBtn) {
            prevBtn.disabled = currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = currentPage === totalPages;
        }

        // Generate page numbers
        if (paginationNumbers) {
            let numbersHTML = '';
            
            // Always show first page
            numbersHTML += `<button class="page-number ${currentPage === 1 ? 'active' : ''}" data-page="1">1</button>`;
            
            // Show ellipsis if needed
            if (currentPage > 3) {
                numbersHTML += `<span class="page-ellipsis">...</span>`;
            }
            
            // Show pages around current page
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                if (i > 1 && i < totalPages) {
                    numbersHTML += `<button class="page-number ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
            }
            
            // Show ellipsis if needed
            if (currentPage < totalPages - 2) {
                numbersHTML += `<span class="page-ellipsis">...</span>`;
            }
            
            // Always show last page if there is more than one page
            if (totalPages > 1) {
                numbersHTML += `<button class="page-number ${currentPage === totalPages ? 'active' : ''}" data-page="${totalPages}">${totalPages}</button>`;
            }
            
            paginationNumbers.innerHTML = numbersHTML;

            // Add click handlers to page numbers
            document.querySelectorAll('.page-number').forEach(btn => {
                btn.addEventListener('click', () => {
                    const page = parseInt(btn.dataset.page);
                    if (page !== currentPage) {
                        currentPage = page;
                        renderBlogPosts();
                        // Scroll to blog section smoothly
                        document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        }
    }

    // Initialize pagination
    function initPagination() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderBlogPosts();
                    document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    renderBlogPosts();
                    document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // Load blog posts when section is in view (lazy loading)
    function observeBlogSection() {
        const blogSection = document.getElementById('blog');
        if (!blogSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    renderBlogPosts();
                    initPagination();
                    observer.disconnect(); // Stop observing once loaded
                }
            });
        }, { threshold: 0.1 });

        observer.observe(blogSection);
    }

    // Initialize if blog section exists
    if (document.getElementById('blog')) {
        // Check if we should load immediately (if section is visible)
        const blogSection = document.getElementById('blog');
        const rect = blogSection.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            renderBlogPosts();
            initPagination();
        } else {
            observeBlogSection();
        }
    }
})();