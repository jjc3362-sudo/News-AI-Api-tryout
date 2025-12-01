// News API configuration
const API_KEY = 'a52d485047e5453bb57836708cf90ad8';
const API_BASE_URL = 'https://newsapi.org/vhttps://newsapi.org/v2/everything?q=Apple&from=2025-11-17&sortBy=popularity&apiKey=API_KEY2/everything';

// Topics to fetch
const TOPICS = [
    { query: 'finance ai', label: 'Finance AI', color: '#667eea' },
    { query: 'Accounting ai', label: 'Accounting AI', color: '#f093fb' },
    { query: 'Marketing ai', label: 'Marketing AI', color: '#4facfe' }
];

// DOM elements
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const totalResults = document.getElementById('totalResults');
const articlesContainer = document.getElementById('articles');
const fromDate = document.getElementById('fromDate');
const sortBy = document.getElementById('sortBy');
const refreshBtn = document.getElementById('refreshBtn');

// Fetch news for a single topic
async function fetchTopicNews(topic, date, sort) {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(topic.query)}&from=${date}&sortBy=${sort}&apiKey=${API_KEY}`;

    const req = new Request(url);
    const response = await fetch(req);

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'ok') {
        // Add category info to each article
        return data.articles.map(article => ({
            ...article,
            category: topic.label,
            categoryColor: topic.color
        }));
    } else {
        throw new Error(data.message || 'Failed to fetch news');
    }
}

// Fetch news from all topics
async function fetchAllNews() {
    const date = fromDate.value;
    const sort = sortBy.value;

    // Show loading, hide error and results
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    articlesContainer.innerHTML = '';
    totalResults.innerHTML = '';

    try {
        // Fetch all topics in parallel
        const promises = TOPICS.map(topic => fetchTopicNews(topic, date, sort));
        const results = await Promise.all(promises);

        // Combine all articles
        const allArticles = results.flat();

        if (allArticles.length === 0) {
            totalResults.innerHTML = '<p>No articles found.</p>';
            return;
        }

        displayResults(allArticles);
    } catch (err) {
        showError(`Error fetching news: ${err.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

// Display news results
function displayResults(articles) {
    const total = articles.length;

    if (total === 0) {
        totalResults.innerHTML = '<p>No articles found.</p>';
        return;
    }

    // Count articles by category
    const categoryCounts = {};
    articles.forEach(article => {
        categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
    });

    const categoryBreakdown = Object.entries(categoryCounts)
        .map(([cat, count]) => `${cat}: ${count}`)
        .join(' | ');

    totalResults.innerHTML = `
        <p>Found <strong>${total}</strong> articles across all AI categories</p>
        <p class="category-breakdown">${categoryBreakdown}</p>
    `;

    articles.forEach(article => {
        const articleCard = createArticleCard(article);
        articlesContainer.appendChild(articleCard);
    });
}

// Create article card element
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';

    const image = article.urlToImage
        ? `<img src="${article.urlToImage}" alt="${article.title}" onerror="this.style.display='none'">`
        : '<div class="no-image">No image available</div>';

    const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const source = article.source.name || 'Unknown Source';
    const author = article.author || 'Unknown Author';
    const description = article.description || 'No description available.';
    const content = article.content || '';

    card.innerHTML = `
        ${image}
        <div class="article-content">
            <span class="category-badge" style="background: ${article.categoryColor}">${article.category}</span>
            <div class="article-meta">
                <span class="source">${source}</span>
                <span class="date">${date}</span>
            </div>
            <h2 class="article-title">${article.title}</h2>
            <p class="article-author">By ${author}</p>
            <p class="article-description">${description}</p>
            ${content ? `<p class="article-excerpt">${content}</p>` : ''}
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">
                Read Full Article →
            </a>
        </div>
    `;

    return card;
}

// Show error message
function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
}

// Event listeners
refreshBtn.addEventListener('click', fetchAllNews);

fromDate.addEventListener('change', fetchAllNews);
sortBy.addEventListener('change', fetchAllNews);

// Load initial news on page load
window.addEventListener('DOMContentLoaded', () => {
    fetchAllNews();
});
