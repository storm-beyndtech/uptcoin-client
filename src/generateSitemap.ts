import fs from "fs";
import path from "path";

const hostname = "https://www.uptcoin.com";
const pages = ["/", "/login", "/register", "/market", "/exchange"];

const generateSitemap = () => {
  const urls = pages
    .map((page) => `<url><loc>${hostname}${page}</loc></url>`)
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  // Save the file in the "public" directory
  const outputPath = path.join(__dirname, "../public/sitemap.xml");
  fs.writeFileSync(outputPath, sitemap);

  console.log("✅ Sitemap generated successfully!");
};

// Run the function when the script is executed
generateSitemap();
