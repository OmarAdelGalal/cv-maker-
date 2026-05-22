import './globals.css';
import React from 'react';
import Script from 'next/script';
import InteractiveBackground from '../components/InteractiveBackground';
import { Analytics } from "@vercel/analytics/next"
export const metadata = {
  title: 'SmartPath AI - Free ATS Resume Builder & Analyzer',
  description: 'Create an ATS-friendly professional resume for free using Google Gemini AI. Instantly scan formatting, analyze keyword match density, optimize experience bullet points, and download your clean vector-text PDF to secure more interviews.',
  keywords: [
    'ATS resume builder', 'ATS friendly CV', 'AI resume optimizer', 'Gemini CV builder', 
    'free ATS scanner', 'resume keyword density checker', 'ATS CV template', 
    'job tailoring generator', 'vector text PDF CV', 'professional summary writer'
  ],
  authors: [{ name: 'SmartPath AI' }],
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'SmartPath AI - Free ATS Resume Builder & AI CV Optimizer',
    description: 'Create an ATS-friendly professional resume for free using Google Gemini AI. Scan formatting, analyze keyword match density, and download a clean PDF.',
    url: 'https://smartpath-ai.vercel.app',
    siteName: 'SmartPath AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartPath AI - Free ATS Resume Builder & AI CV Optimizer',
    description: 'Generate parser-friendly resumes with Google Gemini AI. Instant scoring checklist, keyword matching, and PDF print formatting.',
  },
  other: {
    'google-adsense-account': 'ca-pub-2429659904005180',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Dynamic Premium Background Motion Elements */}
        <div className="dynamic-bg-container">
          <div className="bg-blob bg-blob-1"></div>
          <div className="bg-blob bg-blob-2"></div>
          <div className="bg-blob bg-blob-3"></div>
          <div className="bg-perspective-grid"></div>
        </div>
        <InteractiveBackground />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2429659904005180"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
