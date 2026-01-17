import {NewsItem} from "../types";

const DEFAULT_OG_IMAGE = "https://conime.id/icons/og-cover.png";
export const updateMetaTags = (
  title: string,
  description: string,
  image?: string,
  url?: string,
  keywords?: string
) => {
  // Update Title
  document.title = title;

  console.log("SEO UPDATE:", {title, image, url});

  // Update Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", description);

  // Update Keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement("meta");
    metaKeywords.setAttribute("name", "keywords");
    document.head.appendChild(metaKeywords);
  }
  if (keywords) metaKeywords.setAttribute("content", keywords);

  // Update Canonical
  let linkCanonical = document.querySelector('link[rel="canonical"]');
  if (!linkCanonical) {
    linkCanonical = document.createElement("link");
    linkCanonical.setAttribute("rel", "canonical");
    document.head.appendChild(linkCanonical);
  }
  if (url) linkCanonical.setAttribute("href", url);

  // Update Open Graph Tags
  const setOG = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("property", property);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  setOG("og:title", title);
  setOG("og:description", description);
  setOG("og:site_name", "CoNime News Portal");
  setOG("og:locale", "id_ID");
  setOG(
  "og:type",
  url?.includes("/article/") ? "article" : "website"
);
  setOG("og:image", image || DEFAULT_OG_IMAGE);
  setOG("og:image:width", "1200");
  setOG("og:image:height", "630");


  if (url) setOG("og:url", url);

  // Update Twitter Tags
  const setTwitter = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  setTwitter("twitter:card", "summary_large_image");
  setTwitter("twitter:title", title);
  setTwitter("twitter:description", description);
  setTwitter("twitter:site", "@conime_id");
  setTwitter("twitter:creator", "@conime_id");
  setTwitter("twitter:image", image || DEFAULT_OG_IMAGE);
};

export const injectJSONLD = (data: object) => {
  const oldScript = document.getElementById("conime-jsonld");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.id = "conime-jsonld";
  script.type = "application/ld+json";
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
};

export const generateArticleSchema = (
  article: NewsItem,
  language: "id" | "en"
) => {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://conime.id/article/${article.id}`
    },
    headline: article.title[language],
    description: article.excerpt[language],
    image: [article.imageUrl],
    datePublished: article.date[language],
    dateModified: article.date[language],
    keywords: article.tags?.map(t => t[language]).join(", ") || "",
    author: {
      "@type": "Person",
      name: article.author,
      url: "https://conime.id/staff/redaksi"
    },
    publisher: {
      "@type": "Organization",
      name: "CoNime",
      logo: {
        "@type": "ImageObject",
        url: "https://conime.id/icons/logo.png"
      }
    }
  };
};

export const generateWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CoNime News Portal",
    url: "https://conime.id",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://conime.id/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
};
