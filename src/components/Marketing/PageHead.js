import React from 'react';
import Helmet from 'react-helmet';

const PageHead = ({ title, description, imgUrl }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="title" content={title} />
    <meta name="description" content={description} />
    <meta name="twitter:card" content="summary" />
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="http://oasis.app" />
    {imgUrl && <meta property="og:image" content={imgUrl} />}
    <meta property="og:description" content={description} />
  </Helmet>
);

export default PageHead;
