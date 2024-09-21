import { useState, useEffect } from 'react';

const LatestNews = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        // This is a mock function. In a real scenario, you'd fetch news from an API
        const fetchNews = async () => {
            setNews([
                { id: 1, title: 'Hamilton wins British Grand Prix', date: '2023-07-10' },
                { id: 2, title: 'Verstappen leads championship after Austrian GP', date: '2023-07-03' },
                { id: 3, title: 'Ferrari unveils upgrades for upcoming race', date: '2023-06-28' },
            ]);
        };

        fetchNews();
    }, []);

    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center text-black">Latest F1 News</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md p-6 fade-in">
                            <h3 className="text-xl font-semibold mb-2 text-black">{item.title}</h3>
                            <p className="text-gray-600">{item.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestNews;
