import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TrendingAISection.css';

const TrendingAISection = () => {
        const [articles, setArticles] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
        const [searchTerm, setSearchTerm] = useState('');

        const API_KEY = '8d328UR5pYURjtZFvcJkpC6k';
        const NEWS_API_URL = 'https://newsapi.org/v2/everything';

        useEffect(() => {
            fetchArticles();
        }, []);

        const fetchArticles = async() => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${NEWS_API_URL}`, {
                    params: {
                        q: 'artificial intelligence',
                        apiKey: API_KEY,
                        sortBy: 'publishedAt',
                        language: 'en',
                        pageSize: 9
                    }
                });

                setArticles(response.data.articles);
                setError(null);
            } catch (err) {
                setError('Failed to fetch AI trends. Please try again later.');
                console.error('Error fetching articles:', err);
            } finally {
                setIsLoading(false);
            }
        };

        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };

        const filteredArticles = articles.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description ? .toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (isLoading) {
            return ( <
                div className = "trending-ai-loading" >
                <
                div className = "loading-spinner" > < /div> <
                p > Loading AI trends... < /p> <
                /div>
            );
        }

        if (error) {
            return ( <
                div className = "trending-ai-error" >
                <
                p > { error } < /p> <
                /div>
            );
        }

        return ( <
            section className = "trending-ai-section" >
            <
            div className = "trending-ai-header" >
            <
            h2 > AI Trending < /h2> <
            input type = "text"
            placeholder = "Search AI trends..."
            value = { searchTerm }
            onChange = {
                (e) => setSearchTerm(e.target.value) }
            className = "search-input" /
            >
            <
            /div>

            {
                filteredArticles.length === 0 ? ( <
                    div className = "no-trends-message" >
                    <
                    p > No trends available at the moment < /p> <
                    /div>
                ) : ( <
                    div className = "trending-ai-grid" > {
                        filteredArticles.map((article, index) => ( <
                                article key = { index }
                                className = "trending-ai-card" > {
                                    article.urlToImage && ( <
                                        img src = { article.urlToImage }
                                        alt = { article.title }
                                        className = "article-image" /
                                        >
                                    )
                                } <
                                div className = "article-content" >
                                <
                                h3 >
                                <
                                a href = { article.url }
                                target = "_blank"
                                rel = "noopener noreferrer" > { article.title } <
                                /a> <
                                /h3> <
                                p className = "article-description" > { article.description ? .slice(0, 150) }... <
                                /p> <
                                div className = "article-meta" > {
                                    article.author && < span > By { article.author } < /span>} <
                                    span > Published: { formatDate(article.publishedAt) } < /span> <
                                    /div> <
                                    /div> <
                                    /article>
                                ))
                        } <
                        /div>
                    )
                }

                <
                button className = "view-all-button"
                onClick = {
                        () => {} } >
                    View All Trends <
                    /button> <
                    /section>
            );
        };

        export default TrendingAISection;