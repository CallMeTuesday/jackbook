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

/** Search for a house dance tutorial for a specific move name. */
export async function searchMoveVideos(
  moveName: string,
  auth: { apiKey: string } | { accessToken: string }
): Promise<YouTubeSearchResult> {
  const query = encodeURIComponent(`House Dance Tutorial ${moveName}`)
  return searchQuery(query, auth)
}

/** Free-form YouTube search with a raw query string. */
export async function searchFreeQuery(
  query: string,
  auth: { apiKey: string } | { accessToken: string }
): Promise<YouTubeSearchResult> {
  return searchQuery(encodeURIComponent(query), auth)
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
