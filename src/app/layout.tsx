import type { Metadata } from 'next'; import './globals.css';
export const metadata: Metadata = { title:'LEUFAY LINK SHOPPE | LEUFAY PRODUCTION', description:'Discover fashion, collections, merchandise, accessories, parfum and more from LEUFAY PRODUCTION.', openGraph:{title:'LEUFAY LINK SHOPPE | LEUFAY PRODUCTION',description:'Discover your next favorite.'} };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="id"><body>{children}</body></html>; }
