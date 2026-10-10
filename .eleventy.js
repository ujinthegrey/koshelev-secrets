
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