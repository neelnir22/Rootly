const cheerio = require('cheerio');

const ogImageModel = require('../models/ogImagesModel');

const ogImages = (url) => {
  try {
    const results = Promise.all(
      url.map(async (newUrl) => {
        // console.log({ newUrl });
        const $parsedHtml = await cheerio.fromURL(newUrl);

        if (!$parsedHtml) {
          throw new Error('Cant Parse Given Url');
        }
        const parsedHtmlDescription = $parsedHtml(
          'meta[name=description]',
        ).attr('content');

        const parsedHtmlTitle = $parsedHtml('meta[name=title]').attr('content');

        const parsedHtmlKeyword = $parsedHtml('meta[name=keywords]').attr(
          'content',
        );

        const parsedHtmlLink = $parsedHtml('link[rel=canonical]').attr('href');

        const parsedHtmlImage = $parsedHtml('meta[property=og:image]').attr(
          'content',
        );
        const parsedFaviconImage = $parsedHtml(
          'link[rel=icon,size=144x144]',
        ).attr('href');

        return {
          url: newUrl,
          parsedHtmlTitle,
          parsedHtmlKeyword,
          parsedHtmlLink,
          parsedHtmlImage,
          parsedHtmlDescription,
          parsedFaviconImage,
        };
      }),
    );
    return results;
  } catch (err) {
    console.log(err);
  }
};

module.exports = ogImages;
