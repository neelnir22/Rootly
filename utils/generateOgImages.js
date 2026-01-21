const cheerio = require('cheerio');

const ogImageModel = require('../models/ogImagesModel');

const ogImages = async (url) => {
  try {
    const $parsedHtml = await cheerio.fromURL(url);

    if (!$parsedHtml) {
      throw new Error('Cant Parse Given Url');
    }
    const parsedHtmlDescription = $parsedHtml('meta[name=description]').attr(
      'content',
    );

    const parsedHtmlTitle = $parsedHtml('meta[name=title]').attr('content');

    const parsedHtmlKeyword = $parsedHtml('meta[name=keywords]').attr(
      'content',
    );

    const parsedHtmlLink = $parsedHtml('link[rel=canonical]').attr('href');

    const parsedHtmlImage = $parsedHtml('meta[property=og:image]').attr(
      'content',
    );

    await ogImageModel.create({
      parsedHtmlTitle: parsedHtmlTitle,
      parsedHtmlKeyword: parsedHtmlKeyword,
      parsedHtmlLink: parsedHtmlLink,
      parsedHtmlImage: parsedHtmlImage,
      parsedHtmlDescription: parsedHtmlDescription,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = ogImages;
