
const fs = require("node:fs");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/logo-light.svg");
  
  eleventyConfig.addFilter("sortByTitle", function (recipes) {
    return [...recipes].sort(function (a, b) {
      return a.data.title.localeCompare(b.data.title, "ru");
    });
  });

  eleventyConfig.addCollection("secrets", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/secrets/*.md")
      .sort(function (a, b) {
        return a.data.title.localeCompare(b.data.title, "ru");
      });
  });

  
  eleventyConfig.addCollection("searchIndex", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/secrets/*.md")
      .map(function (item) {
        const content = fs.readFileSync(item.inputPath, "utf8");

        const headingIndex = content.search(
          /^##\s+Ингредиенты\s*$/im
        );

        let ingredients = "";

        if (headingIndex !== -1) {
          const afterHeading = content.slice(
            headingIndex + content.match(/^##\s+Ингредиенты\s*$/im)[0].length
          );

          const nextHeading = afterHeading.search(/^#{1,6}\s/m);

          ingredients = (
            nextHeading === -1
              ? afterHeading
              : afterHeading.slice(0, nextHeading)
          )
            .split(/\r?\n/)
            .map(function (line) {
              return line
                .replace(/^\s*[-*+]\s+/, "")
                .replace(/\*\*/g, "")
                .trim();
            })
            .filter(Boolean)
            .join(" ");
        }

        return {
          title: item.data.title,
          url: item.url,
          ingredients: ingredients
        };
      });
  });

  eleventyConfig.addCollection("tagList", function (collectionApi) {
    const tags = new Set();

    collectionApi.getFilteredByGlob("src/secrets/*.md").forEach(function (item) {
      if (item.data.tags) {
        item.data.tags.forEach(function (tag) {
          tags.add(tag);
        });
      }
    });

    return [...tags].sort(function (a, b) {
      return a.localeCompare(b, "ru");
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};