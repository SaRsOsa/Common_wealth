import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';
import { HfInference } from '@huggingface/inference';


dotenv.config();

interface GDELTArticle {
    title: string;
    seo_description: string;
    content: string;
    tone: number;
    latitude: string;
    longitude: string;
    countries: string[];
    date: string;
    url: string;
}

interface NewsApiArticle {
    title: string;
    source: {
        name: string;
    };
    url: string;
    description: string;
    publishedAt: string;
}

interface NewsArticle {
    title: string;
    description: string;
    content?: string; // Full article text
    url: string;
    publishedAt: string;
}

interface CachedNews {
    articles: NewsApiArticle[];
    timestamp: number;
}

interface AnalysisResult {
    title: string;
    summary: string;
    content: string;
    status: 'success' | 'error';
    url: string;
    publishedAt: string;
}


const app = express();
const port = process.env.PORT || 5000;
const CACHE_TTL = 60 * 1000; // 20 seconds

let newsCache: CachedNews = {
    articles: [],
    timestamp: 0
};

//app.use(cors());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'running', timestamp: new Date().toISOString() });
});

// Debug middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

console.log('HF Token exists:', !!process.env.HF_TOKEN);


app.get('/api/news', async (req, res) => {
    try {
        const cacheAge = Date.now() - newsCache.timestamp;
        const forceRefresh = req.query.force === 'true';

        console.log(`Cache status: ${cacheAge}ms old, Force: ${forceRefresh}`);

        if (forceRefresh || cacheAge > CACHE_TTL || newsCache.articles.length === 0) {
            console.log('Fetching fresh news from API...');

            const { data } = await axios.get('https://newsapi.org/v2/top-headlines', {
                params: {
                    country: 'us',
                    category: 'general',
                    apiKey: process.env.NEWS_API_KEY,
                    pageSize: 5,
                    page: Math.floor(Date.now() / CACHE_TTL) % 10 // Rotating page
                }
            });

            const validArticles = data.articles
                .filter((article: NewsApiArticle) =>
                    article.title &&
                    article.source?.name &&
                    article.url &&
                    article.description
                )
                .slice(0, 3)
                .map((article: NewsApiArticle) => ({
                    title: article.title,
                    source: { name: article.source.name },
                    url: `${article.url}?cache_bust=${Date.now()}`, // Cache busting
                    description: article.description,
                    publishedAt: article.publishedAt
                }));

            console.log(`Received ${validArticles.length} valid articles`);

            newsCache = {
                articles: validArticles,
                timestamp: Date.now()
            };
        }

        res.json(newsCache.articles);
    } catch (error) {
        console.error('News API Error:', error instanceof Error ? error.message : error);

        // Return stale cache if available
        if (newsCache.articles.length > 0) {
            console.log('Returning stale cache due to error');
            return res.json(newsCache.articles);
        }

        res.status(500).json({
            error: 'News service unavailable',
            details: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
});


// Add GDELT endpoint
app.get('/api/gdelt-events', async (req, res) => {
    console.log('Received request for GDELT events');
    try {
        const { data } = await axios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
            params: {
                query: 'sourcelang:english',
                format: 'json',
                maxrecords: 50,
                startdatetime: moment().subtract(7, 'days').format('YYYYMMDDHHMMSS')
            },
            timeout: 10000
        });

        // Handle empty response
        if (!data?.articles?.length) {
            return res.json([]);
        }

        const processData = (articles: any[]) => articles
            .filter(article =>
                article?.title &&
                article?.url &&
                article?.sourcecountry // Use sourcecountry instead of countries
            )
            .map(article => ({
                id: article.url,
                title: article.title,
                description: article.seo_description || article.socialimage || 'No description available',
                type: article.domain.includes('gov') ? 'Political' : 'Social', // Alternative categorization
                severity: 'Medium', // Default value since tone isn't available
                lat: getLatitude(article.sourcecountry), // Implement geo-coding
                lng: getLongitude(article.sourcecountry),
                country: article.sourcecountry,
                date: article.seendate
            }));

        res.json(processData(data.articles).slice(0, 10));
    } catch (error) {
        console.error('GDELT Error:', error);
        res.status(500).json({
            error: 'Failed to fetch events',
            details: 'See server logs for more information'
        });
    }
});

// Add simple geo-coding (you can expand this)
const countryCoordinates: Record<string, { lat: number; lng: number }> = {
    'United States': { lat: 37.0902, lng: -95.7129 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    // Add more countries as needed
};

const getLatitude = (country: string) => countryCoordinates[country]?.lat || 0;
const getLongitude = (country: string) => countryCoordinates[country]?.lng || 0;

// Helper functions
const categorizeEvent = (tone: number): "Social" | "Political" | "Environmental" | "Economic" => {
    if (tone < -5) return 'Political';
    if (tone < 0) return 'Economic';
    if (tone < 5) return 'Social';
    return 'Environmental';
};

const calculateSeverity = (tone: number): "Low" | "Medium" | "Critical" => {
    const absoluteTone = Math.abs(tone);
    if (absoluteTone > 7) return 'Critical';
    if (absoluteTone > 3) return 'Medium';
    return 'Low';
};


























interface HuggingFaceResponse {
    generated_text: string;
}
console.log('HF Token:', process.env.HF_TOKEN ? 'Configured' : 'Missing');

app.get("/", (req, res) => {
    res.json({
        status: "running",
        version: "1.0.0",
        endpoints: ["/api/analyze-news"]
    });
});


function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message.replace('Invalid inference output: ', '');
    }
    return typeof error === 'string' ? error : 'Analysis failed';
}

function cleanAnalysis(text: string): string {
    return text
        .replace(/Analysis:/gi, '')
        .replace(/\n+/g, '\n')
        .trim();
}

function getArticleText(article: NewsArticle): string {
    return [
        article.title,
        article.description || '',
        article.content || ''
    ].join('\n').substring(0, 2000).trim();
}

app.post('/api/analyze-news', async (req, res) => {
    try {
        const { articles } = req.body as { articles: NewsArticle[] };

        // Validate input structure
        if (!articles?.length || articles.some(a => !a.title || !a.url)) {
            return res.status(400).json({
                error: 'Invalid request format',
                details: 'Articles must contain title and url'
            });
        }

        const hf = new HfInference(process.env.HF_TOKEN);
        const results: AnalysisResult[] = [];

        for (const [index, article] of articles.slice(0, 3).entries()) {
            try {
                const articleText = getArticleText(article);
                if (!articleText) {
                    results.push({
                        title: article.title,
                        summary: 'Insufficient content for analysis',
                        content: 'No readable content provided',
                        status: 'error',
                        url: article.url,
                        publishedAt: article.publishedAt
                    });
                    continue;
                }

                // Use proper API method with error handling
                const response = await hf.summarization({
                    model: 'facebook/bart-large-cnn',
                    inputs: articleText,
                    parameters: {
                        max_length: 450,
                        min_length: 150,
                        do_sample: false
                    }
                });

                results.push({
                    title: article.title,
                    summary: response.summary_text,
                    content: articleText.substring(0, 500) + '...',
                    status: 'success',
                    url: article.url,
                    publishedAt: article.publishedAt
                });

            } catch (error: any) {
                const errorMessage = error?.message || 'Analysis failed';
                results.push({
                    title: article.title,
                    summary: errorMessage.replace('Invalid inference output: ', ''),
                    content: getArticleText(article).substring(0, 300) + '...',
                    status: 'error',
                    url: article.url,
                    publishedAt: article.publishedAt
                });
            }
        }

        res.json(results);

    } catch (error: any) {
        res.status(500).json({
            error: 'Server error',
            details: error?.message || 'Unknown error occurred'
        });
    }
});


































app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Cache TTL: ${CACHE_TTL}ms`);
});