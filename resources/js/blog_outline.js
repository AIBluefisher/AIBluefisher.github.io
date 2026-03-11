// Blog outline generator - now injects inside article
(function() {
    // Only run on blog post pages
    const postContent = document.querySelector('.post-content');
    const blogPost = document.querySelector('.blog-post-full');
    if (!postContent || !blogPost) return;
    
    // Check if outline already exists
    if (document.querySelector('.blog-outline')) return;
    
    // Find all headings h2-h4
    const headings = postContent.querySelectorAll('h2, h3, h4');
    if (headings.length === 0) return;
    
    // Create outline container
    const outlineContainer = document.createElement('div');
    outlineContainer.className = 'blog-outline';
    
    // Add header with icon
    const outlineHeader = document.createElement('h2');
    outlineHeader.innerHTML = '<i class="fas fa-list-ul"></i> Table of Contents';
    outlineContainer.appendChild(outlineHeader);
    
    // Create outline list
    const outlineList = document.createElement('ul');
    outlineList.className = 'outline-list';
    
    // Add mobile toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'outline-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Contents';
    toggleBtn.setAttribute('aria-label', 'Toggle table of contents');
    outlineHeader.appendChild(toggleBtn);
    
    // Track heading hierarchy
    headings.forEach((heading, index) => {
        // Add id to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `section-${index + 1}`;
        }
        
        const level = parseInt(heading.tagName[1]);
        const listItem = document.createElement('li');
        listItem.className = `outline-item level-${level}`;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.className = 'outline-link';
        link.textContent = heading.textContent;
        
        // Add click handler for smooth scroll
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, `#${targetId}`);
            }
        });
        
        listItem.appendChild(link);
        
        // Handle hierarchy
        if (level === 2) {
            outlineList.appendChild(listItem);
        } else {
            // Find the last level-2 item or add to root
            const lastLevel2 = outlineList.querySelector('li:last-child');
            if (lastLevel2 && lastLevel2.classList.contains('level-2')) {
                let sublist = lastLevel2.querySelector('.outline-sublist');
                if (!sublist) {
                    sublist = document.createElement('ul');
                    sublist.className = 'outline-sublist';
                    lastLevel2.appendChild(sublist);
                }
                sublist.appendChild(listItem);
            } else {
                outlineList.appendChild(listItem);
            }
        }
    });
    
    outlineContainer.appendChild(outlineList);
    
    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'outline-progress';
    outlineContainer.appendChild(progressBar);
    
    // Insert outline at the beginning of the blog post (after header)
    const postHeader = blogPost.querySelector('.post-header');
    if (postHeader) {
        blogPost.insertBefore(outlineContainer, postHeader.nextSibling);
    } else {
        blogPost.insertBefore(outlineContainer, blogPost.firstChild);
    }
    
    // Also populate mini outline in header
    const miniOutline = document.getElementById('mini-outline');
    const miniLinks = document.getElementById('mini-outline-links');
    if (miniOutline && miniLinks) {
        miniOutline.style.display = 'block';
        headings.forEach((heading, index) => {
            if (index < 5) { // Show first 5 headings in mini outline
                const link = document.createElement('a');
                link.href = `#${heading.id}`;
                link.textContent = heading.textContent;
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.getElementById(heading.id).scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                });
                miniLinks.appendChild(link);
            }
        });
    }
    
    // Scroll spy to highlight current section
    function updateActiveOutlineItem() {
        const scrollPosition = window.scrollY + 120;
        
        let currentHeading = null;
        for (let i = headings.length - 1; i >= 0; i--) {
            const heading = headings[i];
            if (heading.offsetTop <= scrollPosition) {
                currentHeading = heading;
                break;
            }
        }
        
        document.querySelectorAll('.outline-link').forEach(link => {
            link.classList.remove('active');
        });
        
        if (currentHeading) {
            const activeLink = document.querySelector(`.outline-link[href="#${currentHeading.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
        
        // Update progress bar
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    window.addEventListener('scroll', updateActiveOutlineItem);
    window.addEventListener('resize', updateActiveOutlineItem);
    updateActiveOutlineItem();
    
    // Mobile toggle
    toggleBtn.addEventListener('click', function() {
        outlineContainer.classList.toggle('expanded');
        const icon = this.querySelector('i');
        if (outlineContainer.classList.contains('expanded')) {
            icon.className = 'fas fa-chevron-up';
        } else {
            icon.className = 'fas fa-chevron-down';
        }
    });
    
    // Responsive class
    if (window.innerWidth <= 768) {
        outlineContainer.classList.add('collapsible');
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            outlineContainer.classList.add('collapsible');
        } else {
            outlineContainer.classList.remove('collapsible', 'expanded');
        }
    });
})();