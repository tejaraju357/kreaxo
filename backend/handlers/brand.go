package handlers

import (
	"fmt"
	"net/http"
	"time"
	"vp-backend/database"
	"vp-backend/models"

	"github.com/gin-gonic/gin"
)

// BrandGetCreators returns all public creators — raw SQL
func BrandGetCreators(c *gin.Context) {
	var creators []models.Creator
	database.DB.Raw(`
		SELECT id, created_at, updated_at, user_id, name, bio, category,
		       insta_followers, insta_posts, instagram,
		       youtube, youtube_subscribers, youtube_videos,
		       price_post, price_video, profile_image, is_public
		FROM creators
		WHERE is_public = true AND deleted_at IS NULL
		ORDER BY insta_followers + youtube_subscribers DESC
	`).Scan(&creators)
	if creators == nil {
		creators = []models.Creator{}
	}
	c.JSON(http.StatusOK, creators)
}

// BrandSendRequest sends a collaboration request — raw SQL
func BrandSendRequest(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var brandID uint
	database.DB.Raw("SELECT id FROM brands WHERE user_id = ? AND deleted_at IS NULL LIMIT 1", userID).Scan(&brandID)
	if brandID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Brand profile not found"})
		return
	}

	var req struct {
		CreatorID uint   `json:"creator_id" binding:"required"`
		Message   string `json:"message"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check creator exists
	var creatorExists uint
	database.DB.Raw("SELECT id FROM creators WHERE id = ? AND deleted_at IS NULL LIMIT 1", req.CreatorID).Scan(&creatorExists)
	if creatorExists == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Creator not found"})
		return
	}

	// Check for duplicate pending request
	var dupID uint
	database.DB.Raw(`
		SELECT id FROM collaboration_requests
		WHERE brand_id = ? AND creator_id = ? AND status = 'pending' AND deleted_at IS NULL
		LIMIT 1
	`, brandID, req.CreatorID).Scan(&dupID)
	if dupID > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Request already sent to this creator"})
		return
	}

	var collabID uint
	err := database.DB.Raw(`
		INSERT INTO collaboration_requests (created_at, updated_at, brand_id, creator_id, status, message)
		VALUES (?, ?, ?, ?, 'pending', ?)
		RETURNING id
	`, time.Now(), time.Now(), brandID, req.CreatorID, req.Message).Scan(&collabID).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request"})
		return
	}

	var collabReq models.CollaborationRequest
	database.DB.Raw("SELECT * FROM collaboration_requests WHERE id = ? LIMIT 1", collabID).Scan(&collabReq)

	// Send Admin Email Notification
	go func() {
		var brandName, creatorName string
		database.DB.Raw("SELECT name FROM brands WHERE id = ? LIMIT 1", brandID).Scan(&brandName)
		database.DB.Raw("SELECT name FROM creators WHERE id = ? LIMIT 1", req.CreatorID).Scan(&creatorName)

		subject := fmt.Sprintf("New Collaboration Request: %s to %s", brandName, creatorName)
		body := fmt.Sprintf("Brand '%s' has proposed an offer to Creator '%s'.\n\nMessage:\n%s\n\nPlease log in to the admin dashboard to review.", brandName, creatorName, req.Message)
		_ = SendAdminNotificationEmail(subject, body)
	}()

	c.JSON(http.StatusCreated, collabReq)
}

// BrandGetRequests returns all sent requests by this brand — raw SQL
func BrandGetRequests(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var brandID uint
	database.DB.Raw("SELECT id FROM brands WHERE user_id = ? AND deleted_at IS NULL LIMIT 1", userID).Scan(&brandID)
	if brandID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Brand profile not found"})
		return
	}

	var requests []models.CollaborationRequest
	database.DB.Raw(`
		SELECT cr.id, cr.created_at, cr.updated_at, cr.brand_id, cr.creator_id, cr.status, cr.message,
		       c.name AS "creator__name", c.profile_image AS "creator__profile_image", c.category AS "creator__category"
		FROM collaboration_requests cr
		LEFT JOIN creators c ON c.id = cr.creator_id AND c.deleted_at IS NULL
		WHERE cr.brand_id = ? AND cr.deleted_at IS NULL
		ORDER BY cr.created_at DESC
	`, brandID).Scan(&requests)
	if requests == nil {
		requests = []models.CollaborationRequest{}
	}
	c.JSON(http.StatusOK, requests)
}

// BrandGetProfile returns current brand's profile — raw SQL
func BrandGetProfile(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var brand models.Brand
	database.DB.Raw(`
		SELECT b.id, b.created_at, b.updated_at, b.user_id, b.name, b.description,
		       b.industry, b.website, b.logo, b.is_public
		FROM brands b
		WHERE b.user_id = ? AND b.deleted_at IS NULL
		LIMIT 1
	`, userID).Scan(&brand)

	if brand.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Brand profile not found"})
		return
	}

	var user models.User
	database.DB.Raw("SELECT id, email, phone, role, name, status FROM users WHERE id = ? LIMIT 1", userID).Scan(&user)
	brand.User = user

	c.JSON(http.StatusOK, brand)
}
