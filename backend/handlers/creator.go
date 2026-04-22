package handlers

import (
	"net/http"
	"time"
	"vp-backend/database"
	"vp-backend/models"

	"github.com/gin-gonic/gin"
)

// CreatorGetBrands returns brands — raw SQL
func CreatorGetBrands(c *gin.Context) {
	var brands []models.Brand
	database.DB.Raw(`
		SELECT id, created_at, updated_at, user_id, name, description, industry, website, logo, is_public
		FROM brands
		WHERE is_public = true AND deleted_at IS NULL
		ORDER BY name ASC
	`).Scan(&brands)
	if brands == nil {
		brands = []models.Brand{}
	}
	c.JSON(http.StatusOK, brands)
}

// CreatorGetRequests returns collaboration requests received by this creator — raw SQL
func CreatorGetRequests(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var creatorID uint
	database.DB.Raw("SELECT id FROM creators WHERE user_id = ? AND deleted_at IS NULL LIMIT 1", userID).Scan(&creatorID)
	if creatorID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Creator profile not found"})
		return
	}

	var requests []models.CollaborationRequest
	database.DB.Raw(`
		SELECT cr.id, cr.created_at, cr.updated_at, cr.brand_id, cr.creator_id, cr.status, cr.message,
		       b.id AS "brand__id", b.name AS "brand__name", b.logo AS "brand__logo", b.industry AS "brand__industry"
		FROM collaboration_requests cr
		LEFT JOIN brands b ON b.id = cr.brand_id AND b.deleted_at IS NULL
		WHERE cr.creator_id = ? AND cr.deleted_at IS NULL
		ORDER BY cr.created_at DESC
	`, creatorID).Scan(&requests)
	if requests == nil {
		requests = []models.CollaborationRequest{}
	}
	c.JSON(http.StatusOK, requests)
}

// CreatorRespondRequest allows a creator to accept or reject a request — raw SQL
func CreatorRespondRequest(c *gin.Context) {
	userID, _ := c.Get("user_id")
	requestID := c.Param("id")

	var creatorID uint
	database.DB.Raw("SELECT id FROM creators WHERE user_id = ? AND deleted_at IS NULL LIMIT 1", userID).Scan(&creatorID)
	if creatorID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Creator profile not found"})
		return
	}

	var collabReq models.CollaborationRequest
	database.DB.Raw("SELECT id, creator_id, brand_id, status, message FROM collaboration_requests WHERE id = ? AND deleted_at IS NULL LIMIT 1", requestID).Scan(&collabReq)
	if collabReq.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Request not found"})
		return
	}
	if collabReq.CreatorID != creatorID {
		c.JSON(http.StatusForbidden, gin.H{"error": "This request is not for you"})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Status != "accepted" && req.Status != "rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status must be 'accepted' or 'rejected'"})
		return
	}

	database.DB.Exec("UPDATE collaboration_requests SET status = ?, updated_at = ? WHERE id = ?", req.Status, time.Now(), requestID)
	collabReq.Status = req.Status
	c.JSON(http.StatusOK, collabReq)
}

// CreatorGetProfile returns current creator's full profile — raw SQL
func CreatorGetProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var creator models.Creator
	database.DB.Raw(`
		SELECT c.id, c.created_at, c.updated_at, c.user_id, c.name, c.bio, c.category,
		       c.insta_followers, c.insta_posts, c.instagram,
		       c.youtube, c.youtube_subscribers, c.youtube_videos,
		       c.price_post, c.price_video, c.profile_image, c.is_public
		FROM creators c
		WHERE c.user_id = ? AND c.deleted_at IS NULL
		LIMIT 1
	`, userID).Scan(&creator)

	if creator.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Creator profile not found"})
		return
	}

	// Fetch associated user separately
	var user models.User
	database.DB.Raw("SELECT id, email, phone, role, name, status, created_at FROM users WHERE id = ? LIMIT 1", userID).Scan(&user)
	creator.User = user

	c.JSON(http.StatusOK, creator)
}

// CreatorUpdateProfile updates the creator's profile — raw SQL
func CreatorUpdateProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var creatorID uint
	database.DB.Raw("SELECT id FROM creators WHERE user_id = ? AND deleted_at IS NULL LIMIT 1", userID).Scan(&creatorID)
	if creatorID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Creator profile not found"})
		return
	}

	var req struct {
		Name               string  `json:"name"`
		Bio                string  `json:"bio"`
		Category           string  `json:"category"`
		InstaFollowers     int     `json:"insta_followers"`
		InstaPosts         int     `json:"insta_posts"`
		Instagram          string  `json:"instagram"`
		Youtube            string  `json:"youtube"`
		YoutubeSubscribers int     `json:"youtube_subscribers"`
		YoutubeVideos      int     `json:"youtube_videos"`
		PricePost          float64 `json:"price_post"`
		PriceVideo         float64 `json:"price_video"`
		ProfileImage       string  `json:"profile_image"`
		IsPublic           *bool   `json:"is_public"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Build update only for provided fields
	updates := map[string]interface{}{"updated_at": time.Now()}
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Bio != "" {
		updates["bio"] = req.Bio
	}
	if req.Category != "" {
		updates["category"] = req.Category
	}
	if req.InstaFollowers > 0 {
		updates["insta_followers"] = req.InstaFollowers
	}
	if req.InstaPosts > 0 {
		updates["insta_posts"] = req.InstaPosts
	}
	if req.Instagram != "" {
		updates["instagram"] = req.Instagram
	}
	if req.Youtube != "" {
		updates["youtube"] = req.Youtube
	}
	if req.YoutubeSubscribers > 0 {
		updates["youtube_subscribers"] = req.YoutubeSubscribers
	}
	if req.YoutubeVideos > 0 {
		updates["youtube_videos"] = req.YoutubeVideos
	}
	if req.PricePost > 0 {
		updates["price_post"] = req.PricePost
	}
	if req.PriceVideo > 0 {
		updates["price_video"] = req.PriceVideo
	}
	if req.ProfileImage != "" {
		updates["profile_image"] = req.ProfileImage
	}
	if req.IsPublic != nil {
		updates["is_public"] = *req.IsPublic
	}

	database.DB.Model(&models.Creator{}).Where("id = ?", creatorID).Updates(updates)

	var creator models.Creator
	database.DB.Raw(`
		SELECT c.id, c.created_at, c.updated_at, c.user_id, c.name, c.bio, c.category,
		       c.insta_followers, c.insta_posts, c.instagram,
		       c.youtube, c.youtube_subscribers, c.youtube_videos,
		       c.price_post, c.price_video, c.profile_image, c.is_public
		FROM creators c WHERE c.id = ? AND c.deleted_at IS NULL LIMIT 1
	`, creatorID).Scan(&creator)

	c.JSON(http.StatusOK, creator)
}
