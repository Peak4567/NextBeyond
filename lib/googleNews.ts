// ดึงข่าวการศึกษา/TCAS อัตโนมัติจาก Google News RSS (สาธารณะ ไม่ต้องใช้ API key)
// แคชผลลัพธ์ไว้ในหน่วยความจำสั้นๆ เพื่อไม่ให้ยิงคำขอไปที่ Google News ถี่เกินไป

export interface GoogleNewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate: string;
  image: string;
}

// รวมแหล่งข่าวทางการ (ทปอ.) และสำนักข่าวใหญ่ที่คนแชร์กันบ่อย (ไทยรัฐ) เข้ากับข่าวการศึกษาทั่วไป
// ผลลัพธ์ทุกรายการจะมีชื่อสำนักข่าวต้นทางกำกับไว้เสมอ (ดู source ใน GoogleNewsItem) และลิงก์กลับไปอ่านฉบับเต็มที่ต้นฉบับ
const GOOGLE_NEWS_QUERIES = [
  "TCAS มหาวิทยาลัย รับสมัคร",
  "การศึกษาไทย ทุนการศึกษา นักเรียน",
  "ทปอ TCAS ประกาศ",
  "site:thairath.co.th TCAS มหาวิทยาลัย รับสมัคร",
];

// รูปภาพธีมการศึกษา (Unsplash) ใช้หมุนเวียนเป็นภาพปกข่าวเมื่อ Google News ไม่มีรูปแนบมาให้
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=75",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=75",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=75",
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&q=75",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=75",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=75",
];

const ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

function decodeEntities(text: string) {
  return text
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&apos;|&nbsp;/g, (m) => ENTITY_MAP[m] ?? m)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .trim();
}

function stripTags(text: string) {
  return text.replace(/<[^>]*>/g, "");
}

function formatThaiDate(pubDate: string) {
  try {
    return new Date(pubDate).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return pubDate;
  }
}

async function fetchQuery(query: string, limit: number): Promise<GoogleNewsItem[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=th&gl=TH&ceid=TH:th`;

  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; NextBeyondNewsBot/1.0)" },
    next: { revalidate: 900 },
  });
  if (!response.ok) return [];

  const xml = await response.text();
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).slice(0, limit);

  return items.map((match, index) => {
    const block = match[1];
    const titleRaw = block.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "";
    const linkRaw = block.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? "";
    const pubDateRaw = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? "";
    const sourceRaw = block.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] ?? "Google News";

    const title = decodeEntities(stripTags(titleRaw)).replace(/\s*-\s*[^-]+$/, "");

    return {
      id: `${query}-${index}-${linkRaw.slice(-24)}`,
      title,
      link: linkRaw.trim(),
      source: decodeEntities(stripTags(sourceRaw)),
      pubDate: formatThaiDate(pubDateRaw),
      image: FALLBACK_IMAGES[(index + query.length) % FALLBACK_IMAGES.length],
    };
  });
}

interface CacheEntry {
  fetchedAt: number;
  items: GoogleNewsItem[];
}

let cache: CacheEntry | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 นาที

export async function getAutoUpdatedNews(limit = 6): Promise<{ items: GoogleNewsItem[]; fetchedAt: string }> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return { items: cache.items, fetchedAt: new Date(cache.fetchedAt).toISOString() };
  }

  try {
    const results = await Promise.all(GOOGLE_NEWS_QUERIES.map((q) => fetchQuery(q, limit)));
    const merged = results.flat().filter((item) => item.title && item.link);

    // ตัดชื่อข่าวซ้ำออก แล้วจำกัดจำนวนรายการที่แสดง
    const seen = new Set<string>();
    const deduped = merged.filter((item) => {
      if (seen.has(item.title)) return false;
      seen.add(item.title);
      return true;
    });

    cache = { fetchedAt: Date.now(), items: deduped.slice(0, limit) };
    return { items: cache.items, fetchedAt: new Date(cache.fetchedAt).toISOString() };
  } catch {
    return { items: cache?.items ?? [], fetchedAt: cache ? new Date(cache.fetchedAt).toISOString() : "" };
  }
}
