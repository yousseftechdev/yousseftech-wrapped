async function loadPosts() {
    try {
        const response = await fetch('../data/json/posts.json');
        const posts = await response.json();
        const container = document.getElementById('blog-posts');
        
        const tagColors = {
            "Software": "#b45252ff",
            "Blog News": "#348681ff",
            "Hardware": "#52b452ff",
            "Personal Experience": "#5252b4ff",
            "Tutorial": "#b452b4ff",
            "Opinion": "#52b4b4ff",
            "Project Update": "#b4b452ff",
            "Tech Trends": "#c75a28ff",
            "Event Recap": "#4bd384ff",
            "Web": "#43556eff",
            "Linux/Bash": "#5c3245ff"
        };
        
        // Collect unique tags and dates
        const uniqueTags = [...new Set(posts.flatMap(p => p.tags))];
        const uniqueDates = [...new Set(posts.map(p => p.date))].sort().reverse();
        
        // Populate tag filters
        const tagFiltersContainer = document.getElementById('tagFilters');
        uniqueTags.forEach(tag => {
            const tagBtn = document.createElement('span');
            tagBtn.textContent = tag;
            tagBtn.style.backgroundColor = tagColors[tag] || '#ffffff';
            tagBtn.style.cursor = 'pointer';
            tagBtn.classList.add('tags');
            tagBtn.dataset.tag = tag;
            tagBtn.addEventListener('click', () => {
                tagBtn.style.opacity = tagBtn.style.opacity === '0.5' ? '1' : '0.5';
                filterPosts();
            });
            tagFiltersContainer.appendChild(tagBtn);
        });
        
        // Remove the date filter population logic that creates options
        
        dateFilter.addEventListener('change', filterPosts);
        document.getElementById('searchInput').addEventListener('input', filterPosts);
        document.getElementById('clearFilters').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            dateFilter.value = '';
            document.querySelectorAll('#tagFilters span').forEach(tag => tag.style.opacity = '1');
            filterPosts();
        });
        
        function filterPosts() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const selectedDate = document.getElementById('dateFilter').value;
            const tagElements = Array.from(document.querySelectorAll('#tagFilters span'));
            const selectedTags = tagElements
                .filter(tag => tag.style.opacity !== '0.5')
                .map(tag => tag.dataset.tag);

            const enabledCount = tagElements.filter(tag => tag.style.opacity !== '0.5').length;

            document.querySelectorAll('#blog-posts article').forEach(article => {
                const title = article.querySelector('h2')?.textContent.toLowerCase() || '';
                const body = article.querySelector('p:nth-of-type(2)')?.textContent.toLowerCase() || '';
                const date = article.dataset.date || '';
                const tags = (article.dataset.tags || '').split(',');

                const matchesSearch = title.includes(searchTerm) || body.includes(searchTerm);
                const matchesDate = !selectedDate || date === selectedDate;
                
                // if no tag buttons are enabled, don't match anything;
                // otherwise require at least one selected tag to appear in post
                let matchesTags;
                if (enabledCount === 0) {
                    matchesTags = false;
                } else {
                    matchesTags = tags.some(tag => selectedTags.includes(tag.trim()));
                }

                article.style.display = (matchesSearch && matchesDate && matchesTags) ? 'block' : 'none';
            });
        }
        
        // Render posts
        posts.forEach(post => {
            const article = document.createElement('article');
            article.classList.add('panel');
            article.classList.add('reveal-up');
            article.dataset.date = post.date;
            article.dataset.tags = post.tags.join(',');
            const tagsHtml = post.tags.map(tag => `<span style="background-color: ${tagColors[tag] || '#ffffff'}">${tag}</span>`).join('');
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p><em>${post.date}</em></p>
                <p>${post.body}</p>
                <div class="chips">${tagsHtml}</div>
            `;
            container.appendChild(article);
        });
        hljs.highlightAll();
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadPosts);