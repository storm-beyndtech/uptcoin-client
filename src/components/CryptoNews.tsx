const newsArticles = [
  {
    title: 'Younger Investors Like Options and Crypto. They Might Be Sorry.',
    image:
      'https://assets.coingecko.com/articles/images/2410029/large/Sentiment-Is-the-Gutter.jpg',
    link: 'https://www.coingecko.com/en/news',
  },
  {
    title: 'The Untold Winners of the Trump Memecoin Frenzy',
    image:
      'https://assets.coingecko.com/articles/images/2410029/large/Sentiment-Is-the-Gutter.jpg',
    link: 'https://www.coingecko.com/en/news',
  },
  {
    title:
      'Bitcoin Activity Hits 1-Year Low, but These Metrics Point to Bullish Moves',
    image:
      'https://assets.coingecko.com/articles/images/2410029/large/Sentiment-Is-the-Gutter.jpg',
    link: 'https://www.coingecko.com/en/news',
  },
  {
    title: 'BlackRock Increases Ownership of Strategy to 5%',
    image:
      'https://assets.coingecko.com/articles/images/2410029/large/Sentiment-Is-the-Gutter.jpg',
    link: 'https://www.coingecko.com/en/news',
  },
];

const CryptoNews = () => {
  return (
    <div className="max-w-4xl mx-auto py-10 p-4">
      <h2 className="text-2xl font-semibold mb-4 text-white/90">
        Latest Crypto News
      </h2>
      <div className="grid gap-6">
        {newsArticles.map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-5 bg-bodydark2 rounded-lg overflow-hidden transition-transform transform hover:bg-black/30"
          >
            <div className="p-4">
              <h3 className="text-base font-medium text-white/40">
                {article.title.slice(0, 40)}...
              </h3>
            </div>
            <div className="p-5 min-w-fit">
              <div className="bg-green-400 rounded-xl">
                <img
                  src={article.image}
                  alt={article.title}
                  width={128}
                  height={128}
                  className="w-16 h-16 object-cover"
                />
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CryptoNews;
