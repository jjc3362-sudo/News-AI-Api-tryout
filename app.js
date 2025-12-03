// The News API configuration
const API_TOKEN = 'bX4mX0FdSWugKyADeKPEBAUG9T1LhkeGXECRWixV';
const API_BASE_URL = 'https://api.thenewsapi.com/v1/news/all';

// Topics to fetch
const TOPICS = [
    { query: 'finance ai', label: 'Finance AI', color: '#667eea' },
    { query: 'Accounting ai', label: 'Accounting AI', color: '#f093fb' },
    { query: 'Marketing ai', label: 'Marketing AI', color: '#4facfe' }
];

// Set today's date as default
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// DOM elements
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const totalResults = document.getElementById('totalResults');
const articlesContainer = document.getElementById('articles');
const fromDate = document.getElementById('fromDate');
const sortBy = document.getElementById('sortBy');
const refreshBtn = document.getElementById('refreshBtn');

// Set default date to today
fromDate.value = getTodayDate();

// Fetch news for a single topic
async function fetchTopicNews(topic, date, sort) {
    // Build URL for The News API
    // Parameters: search, language, locale, published_after, sort, api_token
    const sortMap = {
        'popularity': 'relevance_score',
        'publishedAt': 'published_at',
        'relevancy': 'relevance_score'
    };

    const url = `${API_BASE_URL}?search=${encodeURIComponent(topic.query)}&language=en&locale=us&published_after=${date}&sort=${sortMap[sort] || 'relevance_score'}&api_token=${API_TOKEN}`;

    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${response.statusText}. ${errorText}`);
    }

    const result = await response.json();

    // The News API returns data in result.data array
    if (result.data && Array.isArray(result.data)) {
        // Normalize the article format to match our display function
        return result.data.map(article => ({
            source: { name: article.source || 'Unknown Source' },
            author: article.author || null,
            title: article.title,
            description: article.description || article.snippet,
            url: article.url,
            urlToImage: article.image_url,
            publishedAt: article.published_at,
            content: article.snippet || article.description,
            category: topic.label,
            categoryColor: topic.color
        }));
    } else {
        throw new Error('Failed to fetch news or no articles found');
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
