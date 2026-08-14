import fs from 'fs';
import path from 'path';

async function getData() {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return [];
  }
}

export default async function Dashboard() {
  const newsData = await getData();
  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="max-w-4xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8 pb-4 border-b-2 border-blue-900">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">일일 대북 동향 통합 브리핑</h1>
          <p className="text-gray-600 mt-1">{today} 기준 업데이트</p>
        </div>
        <a href="/scrap.pdf" download className="bg-blue-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
          📄 전체 스크랩 다운로드 (PDF)
        </a>
      </header>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 font-semibold w-24 text-center">보도일자</th>
              <th className="p-3 font-semibold w-28 text-center">보도매체</th>
              <th className="p-3 font-semibold">기사 핵심 내용</th>
            </tr>
          </thead>
          <tbody>
            {newsData.length > 0 ? (
              newsData.map((news: any, index: number) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-sm text-center text-gray-600">{news.date}</td>
                  <td className="p-3 text-sm text-center font-medium text-blue-800">{news.media}</td>
                  <td className="p-3 text-sm leading-relaxed text-gray-800">
                    <a href={news.url} target="_blank" rel="noreferrer" className="hover:underline">{news.summary}</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="p-6 text-center text-gray-500">데이터 대기 중</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}