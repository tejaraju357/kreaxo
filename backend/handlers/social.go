package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// ─── Request / Response types ───────────────────────────────────────────────

type FetchSocialRequest struct {
	Instagram string `json:"instagram"`
	Youtube   string `json:"youtube"`
}

type FetchSocialResponse struct {
	Instagram *InstagramStats `json:"instagram,omitempty"`
	Youtube   *YoutubeStats   `json:"youtube,omitempty"`
}

type InstagramStats struct {
	Followers    int    `json:"followers"`
	Posts        int    `json:"posts"`
	ProfileImage string `json:"profile_image"`
	Handle       string `json:"handle"`
}

type YoutubeStats struct {
	Subscribers int    `json:"subscribers"`
	Videos      int    `json:"videos"`
	ChannelName string `json:"channel_name"`
}

// ─── Endpoint ───────────────────────────────────────────────────────────────

// FetchSocialStats  POST /api/auth/fetch-social
func FetchSocialStats(c *gin.Context) {
	var req FetchSocialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	if req.Instagram == "" && req.Youtube == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Provide at least one social link"})
		return
	}

	resp := FetchSocialResponse{}

	if req.Instagram != "" {
		handle := normalizeInstagramHandle(req.Instagram)
		if handle != "" {
			if s := fetchInstagramStats(handle); s != nil {
				resp.Instagram = s
			} else {
				resp.Instagram = &InstagramStats{Handle: handle}
			}
		}
	}

	if req.Youtube != "" {
		if s := fetchYoutubeStats(req.Youtube); s != nil {
			resp.Youtube = s
		}
	}

	c.JSON(http.StatusOK, resp)
}

// ─── Helpers ────────────────────────────────────────────────────────────────

func normalizeInstagramHandle(input string) string {
	input = strings.TrimSpace(input)
	if strings.Contains(input, "instagram.com") {
		if parsed, err := url.Parse(input); err == nil {
			parts := strings.Split(strings.Trim(parsed.Path, "/"), "/")
			if len(parts) > 0 && parts[0] != "" {
				return parts[0]
			}
		}
	}
	return strings.TrimPrefix(input, "@")
}

func parseCompactNumber(s string) int {
	s = strings.TrimSpace(s)
	s = strings.ReplaceAll(s, ",", "")
	s = strings.ReplaceAll(s, "\u00a0", "")
	mul := 1.0
	lower := strings.ToLower(s)
	if strings.HasSuffix(lower, "k") {
		mul = 1_000
		s = s[:len(s)-1]
	} else if strings.HasSuffix(lower, "m") {
		mul = 1_000_000
		s = s[:len(s)-1]
	} else if strings.HasSuffix(lower, "b") {
		mul = 1_000_000_000
		s = s[:len(s)-1]
	}
	val, err := strconv.ParseFloat(strings.TrimSpace(s), 64)
	if err != nil {
		return 0
	}
	return int(val * mul)
}

func browserHeaders() map[string]string {
	return map[string]string{
		"User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
		"Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
		"Accept-Language": "en-US,en;q=0.9",
		"Accept-Encoding": "identity",
		"Cache-Control":   "no-cache",
		"Pragma":          "no-cache",
		"Sec-Fetch-Site":  "none",
		"Sec-Fetch-Mode":  "navigate",
		"Sec-Fetch-User":  "?1",
		"Sec-Fetch-Dest":  "document",
	}
}

func newHTTPClient() *http.Client {
	jar, _ := cookiejar.New(nil)
	return &http.Client{
		Timeout: 15 * time.Second,
		Jar:     jar,
	}
}

func doGET(client *http.Client, targetURL string, extraHeaders map[string]string) ([]byte, int, error) {
	req, err := http.NewRequest("GET", targetURL, nil)
	if err != nil {
		return nil, 0, err
	}
	for k, v := range browserHeaders() {
		req.Header.Set(k, v)
	}
	for k, v := range extraHeaders {
		req.Header.Set(k, v)
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	return body, resp.StatusCode, err
}

// ─── Instagram ──────────────────────────────────────────────────────────────

func fetchInstagramStats(handle string) *InstagramStats {
	// Strategy 1 – Cookie-jar warm-up + web_profile_info private API
	if s := tryInstagramWithCookies(handle); s != nil && (s.Followers > 0 || s.Posts > 0) {
		log.Printf("[Instagram] Strategy 1 (cookie API) succeeded for @%s: %d followers", handle, s.Followers)
		return s
	}

	// Strategy 2 – i.instagram.com mobile API (no login needed for public profiles)
	if s := tryInstagramMobileAPI(handle); s != nil && (s.Followers > 0 || s.Posts > 0) {
		log.Printf("[Instagram] Strategy 2 (mobile API) succeeded for @%s: %d followers", handle, s.Followers)
		return s
	}

	// Strategy 3 – microlink.io description scrape
	if s := tryMicrolinkInstagram(handle); s != nil && (s.Followers > 0 || s.Posts > 0) {
		log.Printf("[Instagram] Strategy 3 (microlink) succeeded for @%s: %d followers", handle, s.Followers)
		return s
	}

	log.Printf("[Instagram] All strategies failed for @%s, returning handle only", handle)
	return &InstagramStats{Handle: handle}
}

// Strategy 1: warm cookie jar then call web_profile_info
func tryInstagramWithCookies(handle string) *InstagramStats {
	client := newHTTPClient()
	igBase, _ := url.Parse("https://www.instagram.com")

	// Warm-up: load the homepage so Instagram sets cookies (csrftoken, etc.)
	_, _, _ = doGET(client, "https://www.instagram.com/", nil)
	time.Sleep(500 * time.Millisecond)

	// Extract csrftoken from cookie jar
	csrfToken := ""
	for _, ck := range client.Jar.Cookies(igBase) {
		if ck.Name == "csrftoken" {
			csrfToken = ck.Value
		}
	}

	// Call the private API
	apiURL := fmt.Sprintf("https://www.instagram.com/api/v1/users/web_profile_info/?username=%s", handle)
	extra := map[string]string{
		"X-IG-App-ID":      "936619743392459",
		"X-Requested-With": "XMLHttpRequest",
		"X-CSRFToken":      csrfToken,
		"Referer":          "https://www.instagram.com/" + handle + "/",
		"Accept":           "application/json, text/plain, */*",
		"Sec-Fetch-Site":   "same-origin",
		"Sec-Fetch-Mode":   "cors",
		"Sec-Fetch-Dest":   "empty",
	}
	body, status, err := doGET(client, apiURL, extra)
	if err != nil || status != 200 {
		log.Printf("[Instagram] Strategy 1 failed for @%s: status=%d err=%v", handle, status, err)
		return nil
	}

	return parseInstagramAPIResponse(body, handle)
}

// Strategy 2: i.instagram.com mobile-style API
func tryInstagramMobileAPI(handle string) *InstagramStats {
	client := newHTTPClient()

	// Warm up with profile page first
	profileURL := "https://www.instagram.com/" + handle + "/"
	_, _, _ = doGET(client, profileURL, nil)
	time.Sleep(300 * time.Millisecond)

	igBase, _ := url.Parse("https://i.instagram.com")
	csrfToken := ""
	igwwwBase, _ := url.Parse("https://www.instagram.com")
	for _, ck := range client.Jar.Cookies(igwwwBase) {
		if ck.Name == "csrftoken" {
			csrfToken = ck.Value
		}
	}

	apiURL := fmt.Sprintf("https://i.instagram.com/api/v1/users/web_profile_info/?username=%s", handle)
	extra := map[string]string{
		"X-IG-App-ID":      "936619743392459",
		"X-IG-WWW-Claim":   "0",
		"X-Requested-With": "XMLHttpRequest",
		"X-CSRFToken":      csrfToken,
		"Referer":          profileURL,
		"Origin":           "https://www.instagram.com",
		"Accept":           "application/json",
		"Sec-Fetch-Site":   "same-site",
		"Sec-Fetch-Mode":   "cors",
		"Sec-Fetch-Dest":   "empty",
	}
	body, status, err := doGET(client, apiURL, extra)
	_ = igBase
	if err != nil || status != 200 {
		log.Printf("[Instagram] Strategy 2 (i.instagram.com) failed for @%s: status=%d err=%v", handle, status, err)
		return nil
	}

	return parseInstagramAPIResponse(body, handle)
}

func parseInstagramAPIResponse(body []byte, handle string) *InstagramStats {
	followers := 0
	posts := 0
	imgURL := ""

	followerRe := regexp.MustCompile(`"edge_followed_by"\s*:\s*\{\s*"count"\s*:\s*(\d+)`)
	mediaRe := regexp.MustCompile(`"edge_owner_to_timeline_media"\s*:\s*\{\s*"count"\s*:\s*(\d+)`)
	profilePicRe := regexp.MustCompile(`"profile_pic_url_hd"\s*:\s*"([^"]+)"`)

	// Also try alternate JSON field names used in newer API responses
	followerRe2 := regexp.MustCompile(`"follower_count"\s*:\s*(\d+)`)
	mediaRe2 := regexp.MustCompile(`"media_count"\s*:\s*(\d+)`)
	profilePicRe2 := regexp.MustCompile(`"profile_pic_url"\s*:\s*"([^"]+)"`)

	if m := followerRe.FindSubmatch(body); len(m) > 1 {
		followers, _ = strconv.Atoi(string(m[1]))
	} else if m := followerRe2.FindSubmatch(body); len(m) > 1 {
		followers, _ = strconv.Atoi(string(m[1]))
	}

	if m := mediaRe.FindSubmatch(body); len(m) > 1 {
		posts, _ = strconv.Atoi(string(m[1]))
	} else if m := mediaRe2.FindSubmatch(body); len(m) > 1 {
		posts, _ = strconv.Atoi(string(m[1]))
	}

	if m := profilePicRe.FindSubmatch(body); len(m) > 1 {
		imgURL = strings.ReplaceAll(string(m[1]), `\u0026`, "&")
	} else if m := profilePicRe2.FindSubmatch(body); len(m) > 1 {
		imgURL = strings.ReplaceAll(string(m[1]), `\u0026`, "&")
	}

	return &InstagramStats{Handle: handle, Followers: followers, Posts: posts, ProfileImage: imgURL}
}

type microlinkResp struct {
	Status string `json:"status"`
	Data   struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		Image       *struct {
			URL string `json:"url"`
		} `json:"image"`
	} `json:"data"`
}

func tryMicrolinkInstagram(handle string) *InstagramStats {
	profileURL := "https://www.instagram.com/" + handle + "/"
	apiURL := "https://api.microlink.io?url=" + url.QueryEscape(profileURL)

	client := newHTTPClient()
	body, _, err := doGET(client, apiURL, nil)
	if err != nil {
		return nil
	}
	var result microlinkResp
	if err := json.Unmarshal(body, &result); err != nil || result.Status != "success" {
		return nil
	}

	desc := result.Data.Description
	followerRe := regexp.MustCompile(`(?i)([\d,.]+[KMBkmb]?)\s+Followers`)
	postsRe := regexp.MustCompile(`(?i)([\d,.]+[KMBkmb]?)\s+Posts`)

	followers, posts := 0, 0
	imgURL := ""
	if m := followerRe.FindStringSubmatch(desc); len(m) > 1 {
		followers = parseCompactNumber(m[1])
	}
	if m := postsRe.FindStringSubmatch(desc); len(m) > 1 {
		posts = parseCompactNumber(m[1])
	}
	if result.Data.Image != nil {
		imgURL = result.Data.Image.URL
	}
	return &InstagramStats{Handle: handle, Followers: followers, Posts: posts, ProfileImage: imgURL}
}

// ─── YouTube ─────────────────────────────────────────────────────────────────
// Uses YouTube Data API v3 if YOUTUBE_API_KEY env var is set,
// otherwise falls back to page-scraping with updated regexes.

func fetchYoutubeStats(channelInput string) *YoutubeStats {
	apiKey := os.Getenv("YOUTUBE_API_KEY")
	if apiKey != "" {
		if s := fetchYoutubeViaAPI(channelInput, apiKey); s != nil {
			log.Printf("[YouTube] API fetch succeeded: %s (%d subs, %d videos)", s.ChannelName, s.Subscribers, s.Videos)
			return s
		}
	}
	// Fallback: scrape the page
	ytURL := normalizeYoutubeURL(channelInput)
	if s := fetchYoutubePageScrape(ytURL); s != nil {
		return s
	}
	return nil
}

func normalizeYoutubeURL(input string) string {
	input = strings.TrimSpace(input)
	if strings.Contains(input, "youtube.com") || strings.Contains(input, "youtu.be") {
		return input
	}
	return "https://www.youtube.com/@" + strings.TrimPrefix(input, "@")
}

// extractYoutubeChannelID resolves a YouTube URL to a channel ID using the Data API search
func fetchYoutubeViaAPI(channelInput, apiKey string) *YoutubeStats {
	channelInput = strings.TrimSpace(channelInput)

	// Extract the handle / channel name from the URL
	handle := channelInput
	if strings.Contains(channelInput, "youtube.com") {
		parsed, err := url.Parse(channelInput)
		if err == nil {
			path := strings.Trim(parsed.Path, "/")
			parts := strings.Split(path, "/")
			// e.g. @MrBeast, channel/UCxxxxxx, c/MrBeast
			if len(parts) > 0 {
				handle = strings.TrimPrefix(parts[len(parts)-1], "@")
			}
		}
	} else {
		handle = strings.TrimPrefix(handle, "@")
	}

	client := newHTTPClient()

	// Step 1: resolve handle → channel ID via forHandle parameter
	searchURL := fmt.Sprintf(
		"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&forHandle=%s&key=%s",
		url.QueryEscape(handle), apiKey,
	)
	body, status, err := doGET(client, searchURL, map[string]string{"Accept": "application/json"})
	if err != nil || status != 200 {
		log.Printf("[YouTube API] forHandle lookup failed: status=%d err=%v", status, err)
		// Try search as fallback
		return fetchYoutubeViaSearch(handle, apiKey, client)
	}

	return parseYoutubeAPIResponse(body, handle, apiKey, client)
}

func fetchYoutubeViaSearch(handle, apiKey string, client *http.Client) *YoutubeStats {
	searchURL := fmt.Sprintf(
		"https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=%s&maxResults=1&key=%s",
		url.QueryEscape(handle), apiKey,
	)
	body, status, err := doGET(client, searchURL, map[string]string{"Accept": "application/json"})
	if err != nil || status != 200 {
		log.Printf("[YouTube API] search fallback failed: status=%d", status)
		return nil
	}

	// Extract channel ID from search result
	var searchResp struct {
		Items []struct {
			ID struct {
				ChannelID string `json:"channelId"`
			} `json:"id"`
		} `json:"items"`
	}
	if err := json.Unmarshal(body, &searchResp); err != nil || len(searchResp.Items) == 0 {
		return nil
	}
	channelID := searchResp.Items[0].ID.ChannelID

	// Now get stats for this channel ID
	statsURL := fmt.Sprintf(
		"https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=%s&key=%s",
		channelID, apiKey,
	)
	body2, status2, err2 := doGET(client, statsURL, map[string]string{"Accept": "application/json"})
	if err2 != nil || status2 != 200 {
		return nil
	}
	return parseYoutubeAPIResponse(body2, handle, apiKey, client)
}

func parseYoutubeAPIResponse(body []byte, handle, apiKey string, client *http.Client) *YoutubeStats {
	var apiResp struct {
		Items []struct {
			Snippet struct {
				Title string `json:"title"`
			} `json:"snippet"`
			Statistics struct {
				SubscriberCount string `json:"subscriberCount"`
				VideoCount      string `json:"videoCount"`
			} `json:"statistics"`
		} `json:"items"`
	}
	if err := json.Unmarshal(body, &apiResp); err != nil || len(apiResp.Items) == 0 {
		log.Printf("[YouTube API] Failed to parse response or no items found")
		// Maybe the handle resolution failed; try search
		return fetchYoutubeViaSearch(handle, apiKey, client)
	}

	item := apiResp.Items[0]
	subs, _ := strconv.Atoi(item.Statistics.SubscriberCount)
	videos, _ := strconv.Atoi(item.Statistics.VideoCount)
	return &YoutubeStats{
		ChannelName: item.Snippet.Title,
		Subscribers: subs,
		Videos:      videos,
	}
}

// ── Scraping fallback (no API key) ──────────────────────────────────────────

func fetchYoutubePageScrape(channelURL string) *YoutubeStats {
	client := newHTTPClient()
	body, status, err := doGET(client, channelURL, nil)
	if err != nil || status != 200 {
		log.Printf("[YouTube Scrape] Failed to fetch %s: status=%d err=%v", channelURL, status, err)
		return nil
	}
	pageStr := string(body)
	stats := &YoutubeStats{}

	// Channel name from <title>
	titleRe := regexp.MustCompile(`(?i)<title>([^<]+?)(?:-\s*YouTube)?</title>`)
	if m := titleRe.FindStringSubmatch(pageStr); len(m) > 1 {
		stats.ChannelName = strings.TrimSpace(strings.ReplaceAll(m[1], "- YouTube", ""))
	}

	// ── Isolate channel header block to avoid capturing "Related Channels" ──────
	searchStr := pageStr
	headerStart := strings.Index(pageStr, `"pageHeaderViewModel"`)
	if headerStart == -1 {
		headerStart = strings.Index(pageStr, `"c4TabbedHeaderRenderer"`)
	}
	if headerStart == -1 {
		headerStart = strings.Index(pageStr, `"header":`)
	}
	if headerStart != -1 {
		endLimit := headerStart + 15000 // 15KB bounds is more than enough for the header JSON
		if endLimit > len(pageStr) {
			endLimit = len(pageStr)
		}
		searchStr = pageStr[headerStart:endLimit]
	}

	// ── Subscriber count — multiple patterns YouTube uses ──────────────────
	subPatterns := []*regexp.Regexp{
		regexp.MustCompile(`"subscriberCountText"\s*:\s*"([^"]+)"`),
		regexp.MustCompile(`"subscriberCountText"\s*:\s*\{[^}]*?"simpleText"\s*:\s*"([^"]+)"`),
		regexp.MustCompile(`"subscriberCountText"\s*:\s*\{"simpleText"\s*:\s*"([^"]+)"`),
		regexp.MustCompile(`"subscribers"\s*:\s*\{"simpleText"\s*:\s*"([^"]+)"`),
		regexp.MustCompile(`"subscriberCountText"\s*:\s*\{"runs"\s*:\s*\[\{"text"\s*:\s*"([^"]+)"`),
		regexp.MustCompile(`"subscriberCountText"\s*:\s*\{"accessibility"\s*:\s*\{"accessibilityData"\s*:\s*\{"label"\s*:\s*"([^"]+)"`),
		regexp.MustCompile(`{"content":"([^"]+)\s*subscribers?"}`),
	}
	for _, re := range subPatterns {
		if m := re.FindStringSubmatch(searchStr); len(m) > 1 {
			raw := m[1]
			// Clean up string
			raw = regexp.MustCompile(`(?i)\s*(subscribers?)\s*$`).ReplaceAllString(raw, "")
			raw = strings.ReplaceAll(raw, " million", "M") // some labels say "1.2 million"
			raw = strings.TrimSpace(raw)
			if val := parseCompactNumber(raw); val > 0 {
				stats.Subscribers = val
				break
			}
		}
	}

	// ── Video count ────────────────────────────────────────────────────────
	// We prioritize "videoCount" and replace Atoi with parseCompactNumber
	// to handle approximate formats like "1.5K videos" falling back correctly.
	videoPatterns := []*regexp.Regexp{
		regexp.MustCompile(`"videoCount"\s*:\s*"([\d,]+)"`), // This is the EXACT video count from inner JSON
		regexp.MustCompile(`"videosCountText"\s*:\s*\{"runs"\s*:\s*\[\{"text"\s*:\s*"([^"]+)"`),
		regexp.MustCompile(`"videoCountText"\s*:\s*\{"runs"\s*:\s*\[\{"text"\s*:\s*"([^"]+)"`),
		regexp.MustCompile(`"videoCount(?:Text)?"\s*:\s*\{"simpleText"\s*:\s*"([^"]+)`),
		regexp.MustCompile(`{"content":"([^"]+)\s*videos?"}`),
	}
	for _, re := range videoPatterns {
		if m := re.FindStringSubmatch(searchStr); len(m) > 1 {
			raw := strings.ReplaceAll(m[1], ",", "")
			// Deal with formatting like "1.5K videos"
			raw = regexp.MustCompile(`(?i)\s*(videos?)\s*$`).ReplaceAllString(raw, "")
			raw = strings.TrimSpace(raw)
			if val := parseCompactNumber(raw); val > 0 {
				stats.Videos = val
				break
			}
		}
	}

	log.Printf("[YouTube Scrape] %s: %d subs, %d videos", channelURL, stats.Subscribers, stats.Videos)
	return stats
}
