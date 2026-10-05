module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/css");

  eleventyConfig.addCollection("secrets", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/secrets/*.md");
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

    console.log("TAGS:", [...tags]);
    
    return [...tags];

  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};