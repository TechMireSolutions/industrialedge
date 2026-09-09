import React, { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useLocation } from 'react-router-dom';

export default function SEOManager() {
  const { settings } = useSettings();
  const location = useLocation();

  useEffect(() => {
    if (!settings) return;

    const { seo, general, branding } = settings;

    // Update Document Title
    const siteName = general?.siteName || '';
    const metaTitle = seo?.metaTitle || '';
    const pageTitle = metaTitle ? `${metaTitle} | ${siteName}` : siteName;

    if (pageTitle) {
      document.title = pageTitle;
    }

    // Update Meta Description
    let metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (!metaDescriptionTag && seo?.metaDescription) {
      metaDescriptionTag = document.createElement('meta');
      metaDescriptionTag.name = 'description';
      document.head.appendChild(metaDescriptionTag);
    }
    if (metaDescriptionTag && seo?.metaDescription) {
      metaDescriptionTag.content = seo.metaDescription;
    }

    // Update Favicon
    if (branding?.favicon?.storagePath) {
      const faviconUrl = branding.favicon.storagePath;
      if (faviconUrl) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = faviconUrl;
      }
    }

    // Inject Google Analytics
    if (seo?.googleAnalyticsId) {
      let gaScript = document.getElementById('ga-script');
      if (!gaScript) {
        gaScript = document.createElement('script');
        gaScript.id = 'ga-script';
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${seo.googleAnalyticsId}`;
        document.head.appendChild(gaScript);

        let gaInline = document.createElement('script');
        gaInline.id = 'ga-inline';
        gaInline.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${seo.googleAnalyticsId}');
        `;
        document.head.appendChild(gaInline);
      }
    }

    // Inject Meta Pixel
    if (seo?.metaPixelId) {
      let pixelScript = document.getElementById('meta-pixel');
      if (!pixelScript) {
        pixelScript = document.createElement('script');
        pixelScript.id = 'meta-pixel';
        pixelScript.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${seo.metaPixelId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(pixelScript);
      } else {
        // Track page view on route change if pixel exists
        if (window.fbq) {
          window.fbq('track', 'PageView');
        }
      }
    }
  }, [settings, location.pathname]);

  return null;
}
