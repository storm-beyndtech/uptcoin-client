"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var hostname = "https://www.uptcoin.com";
var pages = ["/", "/login", "/register", "/market", "/exchange"];
var generateSitemap = function () {
    var urls = pages
        .map(function (page) { return "<url><loc>".concat(hostname).concat(page, "</loc></url>"); })
        .join("\n");
    var sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n".concat(urls, "\n</urlset>");
    // Save the file in the "public" directory
    var outputPath = path_1.default.join(__dirname, "../public/sitemap.xml");
    fs_1.default.writeFileSync(outputPath, sitemap);
    console.log("✅ Sitemap generated successfully!");
};
// Run the function when the script is executed
generateSitemap();
