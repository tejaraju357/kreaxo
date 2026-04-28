package handlers

import (
	"fmt"
	"net/http"
	"vp-backend/database"
	"vp-backend/models"

	"github.com/gin-gonic/gin"
)

// PublicGetWorks returns portfolio works visible to everyone — raw SQL
func PublicGetWorks(c *gin.Context) {
	var works []models.Work
	database.DB.Raw("SELECT * FROM works WHERE deleted_at IS NULL ORDER BY created_at DESC").Scan(&works)
	if works == nil {
		works = []models.Work{}
	}
	c.JSON(http.StatusOK, works)
}

// PublicGetFeaturedWorks returns featured works only — raw SQL
func PublicGetFeaturedWorks(c *gin.Context) {
	var works []models.Work
	database.DB.Raw("SELECT * FROM works WHERE is_featured = true AND deleted_at IS NULL ORDER BY created_at DESC").Scan(&works)
	if works == nil {
		works = []models.Work{}
	}
	c.JSON(http.StatusOK, works)
}

// PublicGetCreators returns limited public creator info — raw SQL
func PublicGetCreators(c *gin.Context) {
	var creators []models.Creator
	database.DB.Raw(`
		SELECT id, name, category, profile_image, bio,
		       insta_followers, insta_posts, instagram,
		       youtube, youtube_subscribers, youtube_videos,
		       price_post, price_video, is_public
		FROM creators
		WHERE is_public = true AND deleted_at IS NULL
		ORDER BY insta_followers + youtube_subscribers DESC
	`).Scan(&creators)
	if creators == nil {
		creators = []models.Creator{}
	}
	c.JSON(http.StatusOK, creators)
}

// PublicGetBrands returns limited public brand info — raw SQL
func PublicGetBrands(c *gin.Context) {
	var brands []models.Brand
	database.DB.Raw(`
		SELECT id, name, industry, logo, description
		FROM brands
		WHERE is_public = true AND deleted_at IS NULL
		ORDER BY name ASC
	`).Scan(&brands)
	if brands == nil {
		brands = []models.Brand{}
	}
	c.JSON(http.StatusOK, brands)
}

// PublicGetStats returns public statistics — raw SQL (single round-trip)
func PublicGetStats(c *gin.Context) {
	var stats struct {
		Creators       int64 `json:"creators"`
		Brands         int64 `json:"brands"`
		Collaborations int64 `json:"collaborations"`
	}
	database.DB.Raw(`
		SELECT
		  (SELECT COUNT(*) FROM creators WHERE deleted_at IS NULL) AS creators,
		  (SELECT COUNT(*) FROM brands WHERE deleted_at IS NULL) AS brands,
		  (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'accepted' AND deleted_at IS NULL) AS collaborations
	`).Scan(&stats)
	c.JSON(http.StatusOK, stats)
}

// ContactUs handles contact form submissions and sends an email to the admin
func ContactUs(c *gin.Context) {
	var req struct {
		Name    string `json:"name" binding:"required"`
		Email   string `json:"email" binding:"required"`
		Subject string `json:"subject"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	go func() {
		subject := fmt.Sprintf("New Contact Us Request: %s", req.Subject)
		body := fmt.Sprintf("You have received a new message from the website contact form.\n\nName: %s\nEmail: %s\nSubject: %s\n\nMessage:\n%s", req.Name, req.Email, req.Subject, req.Message)
		_ = SendAdminNotificationEmail(subject, body)
	}()

	c.JSON(http.StatusOK, gin.H{"message": "Your message has been sent successfully."})
}
