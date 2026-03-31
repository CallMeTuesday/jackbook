export interface YouTubeVideo {
  videoId: string
  title: string
  channelTitle: string
  thumbnail: string
  description: string
}

export interface YouTubeSearchResult {
  videos: YouTubeVideo[]
  error?: string
}

function parseItems(data: any): YouTubeVideo[] {
  return (data.items || []).map((item: any) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnail:
      item.snippet.thumbnails.medium?.url ||
      item.snippet.thumbnails.default?.url ||
      '',
    description: item.snippet.description,
  }))
}

async function ytFetch(url: string, accessToken?: string): Promise<Response> {
  return fetch(url, accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined)
}

function handleError(res: Response, body: any): YouTubeSearchResult {
  if (res.status === 403) return { videos: [], error: 'YouTube API quota exceeded. Please try again later.' }
  return { videos: [], error: body.error?.message || 'Failed to fetch videos' }
}

const STYLE_QUERY: Record<string, string> = {
  house: 'House Dance Tutorial',
  hiphop: 'Hip Hop Dance Tutorial',
  locking: 'Locking Dance Tutorial',
  popping: 'Popping Dance Tutorial',
  breaking: 'Breaking Dance Tutorial',
  waacking: 'Waacking Dance Tutorial',
  vogue: 'Voguing Tutorial',
}

/** Search for a dance tutorial for a specific move name and style. */
export async function searchMoveVideos(
  moveName: string,
  auth: { apiKey: string } | { accessToken: string },
  style = 'house'
): Promise<YouTubeSearchResult> {
  const styleLabel = STYLE_QUERY[style] ?? STYLE_QUERY.house
  const query = encodeURIComponent(`${moveName} ${styleLabel}`)
  return searchQuery(query, auth)
}

/** Free-form YouTube search with a raw query string. */
export async function searchFreeQuery(
  query: string,
  auth: { apiKey: string } | { accessToken: string }
): Promise<YouTubeSearchResult> {
  return searchQuery(encodeURIComponent(query), auth)
}

/** Fetch video details (title, channel, thumbnail) for a list of video IDs in one request. */
export async function getVideosByIds(
  videoIds: string[],
  auth: { apiKey: string } | { accessToken: string }
): Promise<Record<string, { title: string; channelTitle: string; thumbnail: string }>> {
  if (videoIds.length === 0) return {}
  const ids = videoIds.join(',')
  const base = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids}`

  let res: Response
  if ('apiKey' in auth) {
    res = await ytFetch(`${base}&key=${auth.apiKey}`)
  } else {
    res = await ytFetch(base, auth.accessToken)
  }

  if (!res.ok) return {}

  const data = await res.json()
  const result: Record<string, { title: string; channelTitle: string; thumbnail: string }> = {}
  for (const item of data.items || []) {
    result[item.id] = {
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail:
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url ||
        '',
    }
  }
  return result
}

async function searchQuery(
  encodedQuery: string,
  auth: { apiKey: string } | { accessToken: string }
): Promise<YouTubeSearchResult> {
  const base = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodedQuery}`

  let res: Response
  if ('apiKey' in auth) {
    res = await ytFetch(`${base}&key=${auth.apiKey}`)
  } else {
    res = await ytFetch(base, auth.accessToken)
  }

  if (!res.ok) {
    const body = await res.json()
    return handleError(res, body)
  }

  return { videos: parseItems(await res.json()) }
}
