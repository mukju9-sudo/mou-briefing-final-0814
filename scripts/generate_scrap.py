import json
import os
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime

def fetch_free_news():
    try:
        # 1. 구글 뉴스 RSS 호출 (비용 무료, API Key 불필요)
        query = urllib.parse.quote("통일부 OR 북한 when:1d")
        url = f"https://news.google.com/rss/search?q={query}&hl=ko&gl=KR&ceid=KR:ko"
        
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        # 2. XML 데이터 파싱
        root = ET.fromstring(xml_data)
        channel = root.find('channel')
        
        news_data = []
        today_str = datetime.now().strftime("%Y-%m-%d")
        
        # 3. 최신 뉴스 15개 추출 (AI 요약 대신 '기사 제목'을 직접 노출)
        for item in channel.findall('item')[:15]:
            title = item.find('title').text if item.find('title') is not None else "제목 없음"
            link = item.find('link').text if item.find('link') is not None else "#"
            source = item.find('source').text if item.find('source') is not None else "언론사"
            
            news_data.append({
                "date": today_str,
                "media": source,
                "summary": title,  # 대시보드 화면에 표출될 기사 제목
                "url": link
            })
            
        # 4. JSON 파일로 저장 (Vercel 대시보드 연동용)
        os.makedirs("public", exist_ok=True)
        with open("public/data.json", "w", encoding="utf-8") as f:
            json.dump(news_data, f, ensure_ascii=False, indent=2)
            
    except Exception as e:
        print(f"Error fetching news: {e}")

def generate_dummy_pdf():
    # Vercel 빌드 에러 방지용 기본 PDF 파일 생성
    os.makedirs("public", exist_ok=True)
    with open("public/scrap.pdf", "wb") as f:
        f.write(b"%PDF-1.4\n%Empty PDF for System Stability")

if __name__ == "__main__":
    fetch_free_news()
    generate_dummy_pdf()
    print("비용 제로(Zero-Cost) 기반 일일 뉴스 스크랩 처리가 완료되었습니다.")
