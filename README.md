# AI News Dashboard

A modern, responsive web application that tracks and displays news articles for **Finance AI**, **Accounting AI**, and **Marketing AI** topics using The News API.

## Features

- 🤖 Automatically fetches news for three AI categories
- 📅 Filter news by date (defaults to today)
- 🔥 Sort by relevance or published date
- 📱 Fully responsive design
- 🎨 Modern, gradient UI with smooth animations
- ⚡ Real-time news fetching with color-coded category badges
- ✅ No CORS issues - works directly in the browser!

## Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd News-AI-Api-tryout
```

2. **Open in browser**
Simply open `index.html` in your web browser - that's it!

The app will automatically fetch news for Finance AI, Accounting AI, and Marketing AI topics.

## How It Works

The app uses [The News API](https://www.thenewsapi.com/) which allows browser requests without CORS restrictions. Each refresh fetches the latest articles from all three AI categories and displays them with color-coded badges.

## Project Structure

```
News-AI-Api-tryout/
├── index.html          # Main HTML structure
├── app.js             # JavaScript for API calls and rendering
├── style.css          # Styling and responsive design
└── README.md          # This file
```

## Monitored Topics

The app automatically tracks news for these three AI categories:
- **Finance AI** (purple badge)
- **Accounting AI** (pink badge)
- **Marketing AI** (blue badge)

## Customization

To track different topics, edit the `TOPICS` array in `app.js`:

```javascript
const TOPICS = [
    { query: 'your search', label: 'Your Label', color: '#hexcolor' },
    // add more topics...
];
```

## API

This app uses [The News API](https://www.thenewsapi.com/) - a news aggregation service that:
- Allows browser requests (no CORS issues)
- Provides articles from thousands of sources
- Has a generous free tier

## No Backend Required

Unlike other news APIs, this solution works entirely in the browser with no backend server needed!