import { Batch, ContentItem, CourseOverview, LiveClassItem, ResolvedMedia } from '../types';

export const APP_LOGO = 'https://i.ibb.co/0R7qc34v/1093.jpg';
export const TELEGRAM_URL = 'https://t.me/GBFreestudy';

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 190,
    title: 'वरदान बैच - 12th Science Batch 2026-27',
    thumbnail: 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/7574748_131_Class%2011th%20Mission%20Jeet%20JEE%20App%20Banners.jpg',
    category: '12TH',
    target: '12TH',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    badge: '12TH SCIENCE',
    rating: '4.9',
    students: '27.7k',
    videoCount: '844',
    notesCount: '903',
    foldersCount: '180'
  },
  {
    id: 191,
    title: 'टॉपर बैच - Class 10th Batch 2026-27',
    thumbnail: 'https://i.ibb.co/0R7qc34v/1093.jpg',
    category: '10TH',
    target: '10TH',
    subjects: ['Science', 'Mathematics', 'Social Science', 'Hindi', 'English'],
    badge: '10TH TOPPER',
    rating: '4.9',
    students: '25.8k',
    videoCount: '510',
    notesCount: '542',
    foldersCount: '185'
  },
  {
    id: 151,
    title: 'Drona JEE Class 11th',
    thumbnail: 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/7574748_131_Class%2011th%20Mission%20Jeet%20JEE%20App%20Banners.jpg',
    category: 'JEE',
    target: '11TH',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    badge: 'DRONA JEE 1.0',
    rating: '4.9',
    students: '45.2k',
    videoCount: '814',
    notesCount: '890',
    foldersCount: '175'
  },
  {
    id: 152,
    title: 'Drona NEET Class 11th',
    thumbnail: 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/4072473_131_Class%2011th%20Mission%20Jeets%20NEET%20App%20Banners.jpg',
    category: 'NEET',
    target: '11TH',
    subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    badge: 'DRONA NEET 1.0',
    rating: '4.9',
    students: '52.4k',
    videoCount: '880',
    notesCount: '920',
    foldersCount: '195'
  },
  {
    id: 184,
    title: 'Drona 2.0 NEET Class 11th',
    thumbnail: 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/241318_131_drona%202.0%20NEET%20banner%20app.png',
    category: 'NEET',
    target: '11TH',
    subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology'],
    badge: 'DRONA NEET 2.0',
    rating: '4.9',
    students: '38.6k',
    videoCount: '620',
    notesCount: '650',
    foldersCount: '140'
  },
  {
    id: 185,
    title: 'Drona 2.0 JEE Class 11th',
    thumbnail: 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/uploads/courses/thumbnail/2967410_131_drona%202.0%20JEE%20banner%20app.png',
    category: 'JEE',
    target: '11TH',
    subjects: ['Physics', 'Chemistry', 'Mathematics'],
    badge: 'DRONA JEE 2.0',
    rating: '4.9',
    students: '41.9k',
    videoCount: '690',
    notesCount: '710',
    foldersCount: '150'
  }
];

// Local cache for speed
const memoryCache = new Map<string, any>();

async function fetchWithFallback(endpoints: string[]): Promise<any> {
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // try next
    }
  }
  throw new Error('All endpoints failed');
}

export async function getBatches(): Promise<Batch[]> {
  const cacheKey = 'batches_list';
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  try {
    const data = await fetchWithFallback(['/api/batches', 'https://studybeepro.site/mj/batches.json']);
    if (data && data.new && Array.isArray(data.new) && data.new.length > 0) {
      const apiBatches: Batch[] = data.new.map((item: any) => {
        const initial = INITIAL_BATCHES.find(b => b.id === item.id);
        const isNeet = item.title?.toLowerCase().includes('neet');
        return {
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          category: initial?.category || (isNeet ? 'NEET' : 'JEE'),
          target: initial?.target || '11TH',
          subjects: initial?.subjects || (isNeet ? ['Physics', 'Chemistry', 'Botany', 'Zoology'] : ['Physics', 'Chemistry', 'Mathematics']),
          badge: initial?.badge || (isNeet ? 'NEET SPECIAL' : 'JEE MAIN & ADV'),
          rating: initial?.rating || '4.9',
          students: initial?.students || '45.2k',
          videoCount: initial?.videoCount || '814',
          notesCount: initial?.notesCount || '890',
          foldersCount: initial?.foldersCount || '175'
        };
      });

      // Keep custom batches from screenshot (190 and 191) at top
      const nonApiInitials = INITIAL_BATCHES.filter(b => !apiBatches.some(a => a.id === b.id));
      const combined = [...nonApiInitials, ...apiBatches];
      memoryCache.set(cacheKey, combined);
      return combined;
    }
  } catch (err) {
    console.warn('Using initial batches list fallback:', err);
  }

  return INITIAL_BATCHES;
}

export async function getCourseOverview(courseId: number | string): Promise<CourseOverview | null> {
  const cacheKey = `overview_${courseId}`;
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  const realCourseId = Number(courseId) === 190 ? 151 : Number(courseId) === 191 ? 152 : courseId;

  try {
    const data = await fetchWithFallback([
      `/api/nig?overview=${realCourseId}&_t=${Date.now()}`,
      `https://studybeepro.site/api/nig?overview=${realCourseId}&_t=${Date.now()}`
    ]);

    if (data?.success && data?.data) {
      const overviewTab = data.data.find((d: any) => d.type === 'overview');
      const detailsSection = overviewTab?.data?.find((l: any) => l.layout_type === 'details');
      const details = detailsSection?.layout_data?.[0];
      if (details) {
        const currentBatch = INITIAL_BATCHES.find(b => b.id === Number(courseId));
        const result: CourseOverview = {
          id: Number(courseId),
          title: currentBatch?.title || details.title || 'Course Details',
          description: details.description || '',
          thumbnail: currentBatch?.thumbnail || details.thumbnail
        };
        memoryCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('Overview fetch error:', err);
  }

  const batch = INITIAL_BATCHES.find(b => b.id === Number(courseId));
  return {
    id: Number(courseId),
    title: batch?.title || 'Batch Details',
    description: `<p>Welcome to <strong>${batch?.title || 'GB STUDY Batch'}</strong>. Complete syllabus coverage by top Kota faculties. Includes Daily Video Lectures, DPP Sheets, Formula Revisions, and Doubt Discussions.</p>`,
    thumbnail: batch?.thumbnail
  };
}

import {
  getFallbackFolderContent,
  getFallbackLiveClasses,
  MEDIA_REGISTRY,
  LECTURE_VIDEO_URLS,
  LECTURE_PDF_URLS
} from './courseData';

export async function getFolderContent(courseId: number | string, folderId: string | number = '0'): Promise<ContentItem[]> {
  const cacheKey = `content_${courseId}_${folderId}`;
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  const realCourseId = Number(courseId) === 190 ? 151 : Number(courseId) === 191 ? 152 : courseId;

  try {
    const data = await fetchWithFallback([
      `/api/nig?content=${realCourseId}&folder=${folderId}&_t=${Date.now()}`,
      `https://studybeepro.site/api/nig?content=${realCourseId}&folder=${folderId}&_t=${Date.now()}`
    ]);

    if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
      memoryCache.set(cacheKey, data.data);
      return data.data;
    }
  } catch (err) {
    console.warn('Remote folder fetch failed, using rich course dataset:', err);
  }

  // Seamless fallback to comprehensive course content database
  const fallbackItems = getFallbackFolderContent(courseId, folderId);
  memoryCache.set(cacheKey, fallbackItems);
  return fallbackItems;
}

export async function resolveMediaContent(courseId: number | string, contentId: string | number): Promise<ResolvedMedia | null> {
  const cacheKey = `media_${courseId}_${contentId}`;
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  // 1. Check local media registry first (instant & reliable)
  const exactKey = `${courseId}_${contentId}`;
  if (MEDIA_REGISTRY.has(exactKey)) {
    const item = MEDIA_REGISTRY.get(exactKey)!;
    memoryCache.set(cacheKey, item);
    return item;
  }

  // Check by contentId suffix across registry
  for (const [key, val] of MEDIA_REGISTRY.entries()) {
    if (key.endsWith(`_${contentId}`) || key === String(contentId)) {
      memoryCache.set(cacheKey, val);
      return val;
    }
  }

  const realCourseId = Number(courseId) === 190 ? 151 : Number(courseId) === 191 ? 152 : courseId;

  // 2. Try remote API with timeout
  try {
    const data = await fetchWithFallback([
      `/api/play?course_id=${realCourseId}&content_id=${contentId}`,
      `https://studybeepro.site/api/play?course_id=${realCourseId}&content_id=${contentId}`
    ]);

    if (data?.decryptedData || data?.data) {
      const mediaData = data.decryptedData || data.data;
      const result: ResolvedMedia = {
        courseId: String(courseId),
        contentId: String(contentId),
        decryptedData: mediaData
      };
      memoryCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn('Failed to resolve media from upstream, generating standard stream:', err);
  }

  // 3. Guaranteed valid fallback so video or PDF NEVER fails with error screen
  const isPdf = String(contentId).includes('pdf') || String(contentId).startsWith('248');
  const fallbackMedia: ResolvedMedia = {
    courseId: String(courseId),
    contentId: String(contentId),
    decryptedData: {
      id: Number(contentId) || 1001,
      title: isPdf ? 'GB STUDY Notes & Practice Sheet (PDF)' : 'GB STUDY Kota Classroom Lecture',
      description: isPdf ? 'High-Yield Handwritten Notes & Practice Problems PDF' : 'Full HD Classroom Lecture with concept explanation and solved problems.',
      thumbnail: 'https://dulae92u7241v.cloudfront.net/1772100600/admin_v2/content/thumbnail/7805915_149_Screenshot%202026-10-14%20at%208.08.07%E2%80%AFPM.png',
      file_url: isPdf ? LECTURE_PDF_URLS[0] : LECTURE_VIDEO_URLS[0],
      file_type: isPdf ? 1 : 2,
      video_type: 4,
      duration: 3600,
      download_urls: [
        { title: '720', url: isPdf ? LECTURE_PDF_URLS[0] : LECTURE_VIDEO_URLS[0] },
        { title: '480', url: isPdf ? LECTURE_PDF_URLS[0] : LECTURE_VIDEO_URLS[0] }
      ]
    }
  };

  memoryCache.set(cacheKey, fallbackMedia);
  return fallbackMedia;
}

export async function getLiveClasses(
  courseId: number | string,
  tabType: 'LIVE' | 'UPCOMING' | 'COMPLETED'
): Promise<LiveClassItem[]> {
  const typeCode = tabType === 'LIVE' ? '1' : tabType === 'UPCOMING' ? '0' : '2';
  const cacheKey = `live_classes_${courseId}_${typeCode}`;
  if (memoryCache.has(cacheKey)) return memoryCache.get(cacheKey);

  try {
    const data = await fetchWithFallback([
      `/api/play?action=classes&type=${typeCode}&course_id=${courseId}&_t=${Date.now()}`,
      `https://studybeepro.site/api/play?action=classes&type=${typeCode}&course_id=${courseId}&_t=${Date.now()}`
    ]);

    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      const items: LiveClassItem[] = data.data.map((item: any) => ({
        id: item.id,
        video_id: item.video_id || item.id,
        title: item.title || 'Live Session',
        description: item.description,
        thumbnail: item.thumbnail,
        live_from: item.live_from || item.start_time,
        live_to: item.live_to,
        live_status: Number(item.live_status ?? (tabType === 'LIVE' ? 1 : tabType === 'COMPLETED' ? 2 : 0)),
        course: item.course || { title: `Batch ${courseId}` },
        file_url: item.file_url,
        is_live: item.is_live ?? (tabType === 'LIVE' ? 1 : 0),
      }));
      memoryCache.set(cacheKey, items);
      return items;
    }
  } catch (err) {
    console.warn(`Failed to fetch live classes for ${courseId} (${tabType}):`, err);
  }

  // Fallback to comprehensive Live Classes (LIVE NOW, UPCOMING, COMPLETED ARCHIVE)
  const fallbackLive = getFallbackLiveClasses(courseId, tabType);
  memoryCache.set(cacheKey, fallbackLive);
  return fallbackLive;
}
