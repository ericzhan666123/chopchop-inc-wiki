import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL??"https://chop-chop-inc-wiki.pages.dev"),title:{default:"Chop Chop Inc. Wiki",template:"%s | Chop Chop Inc. Wiki"},description:"Recipes, items, characters and world data for Chop Chop Inc."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
