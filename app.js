// News API configuration
const API_KEY = 'a52d485047e5453bb57836708cf90ad8';
const API_BASE_URL = 'https://newsapi.org/v2/everything';

// DOM elements
const searchBtn = document.getElementById('searchBtn');
const searchQuery = document.getElementById('searchQuery');
const fromDate = document.getElementById('fromDate');
const sortBy = document.getElementById('sortBy');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const totalResults = document.getElementById('totalResults');
const articlesContainer = document.getElementById('articles');

// Fetch news from API
async function fetchNews() {
    const query = searchQuery.value.trim();
    const date = fromDate.value;
    const sort = sortBy.value;

    if (!query) {
        showError('Please enter a search query');
        return;
    }

    // Show loading, hide error and results
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    articlesContainer.innerHTML = '';
    totalResults.innerHTML = '';

    try {
        const url = `${API_BASE_URL}?q=${encodeURIComponent(query)}&from=${date}&sortBy=${sort}&apiKey=${API_KEY}`;

        const req = new Request(url);
        const response = await fetch(req);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === 'ok') {
            displayResults(data);
        } else {
            throw new Error(data.message || 'Failed to fetch news');
        }
    } catch (err) {
        showError(`Error fetching news: ${err.message}`);
    } finally {
        loading.classList.add('hidden');
    }
}

// Display news results
function displayResults(data) {
    const { totalResults: total, articles } = data;

    if (total === 0) {
        totalResults.innerHTML = '<p>No articles found. Try a different search.</p>';
        return;
    }

    totalResults.innerHTML = `<p>Found <strong>${total.toLocaleString()}</strong> articles</p>`;

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
searchBtn.addEventListener('click', fetchNews);

searchQuery.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchNews();
    }
});

// Load initial news on page load
window.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});
