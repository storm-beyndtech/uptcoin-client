import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  url: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, url }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="crypto, trading, exchange, bitcoin, ethereum, altcoins, Uptcoin, good rate" />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="https://www.uptcoin.com/logo.png" />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;
