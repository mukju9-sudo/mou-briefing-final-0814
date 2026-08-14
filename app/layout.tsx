import './globals.css'
export const metadata = { title: '일일 대북 동향 브리핑' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}