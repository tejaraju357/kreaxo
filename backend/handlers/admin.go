package handlers

import (
	"net/http"
	"time"
	"vp-backend/database"
	"vp-backend/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// ===== CREATOR MANAGEMENT =====

type CreateCreatorRequest struct {
	Email              string  `json:"email" binding:"required"`
	Password           string  `json:"password" binding:"required"`
	Name               string  `json:"name" binding:"required"`
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
}

// AdminGetCreators returns all creators (admin view) — raw SQL
func AdminGetCreators(c *gin.Context) {
	rows, err := database.DB.Raw(`
		SELECT c.id, c.created_at, c.updated_at, c.user_id, c.name, c.bio, c.category,
		       c.insta_followers, c.insta_posts, c.instagram,
		       c.youtube, c.youtube_subscribers, c.youtube_videos,
		       c.price_post, c.price_video, c.profile_image, c.is_public,
		       u.id AS "user__id", u.email AS "user__email", u.phone AS "user__phone",
		       u.role AS "user__role", u.name AS "user__name", u.status AS "user__status",
		       u.created_at AS "user__created_at"
		FROM creators c
		LEFT JOIN users u ON u.id = c.user_id
		WHERE c.deleted_at IS NULL
		ORDER BY c.created_at DESC
	`).Rows()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch creators"})
		return
	}
	defer rows.Close()

	var creators []models.Creator
	for rows.Next() {
		var cr models.Creator
		var u models.User
		_ = rows.Scan(
			&cr.ID, &cr.CreatedAt, &cr.UpdatedAt, &cr.UserID, &cr.Name, &cr.Bio, &cr.Category,
			&cr.InstaFollowers, &cr.InstaPosts, &cr.Instagram,
			&cr.Youtube, &cr.YoutubeSubscribers, &cr.YoutubeVideos,
			&cr.PricePost, &cr.PriceVideo, &cr.ProfileImage, &cr.IsPublic,
			&u.ID, &u.Email, &u.Phone, &u.Role, &u.Name, &u.Status, &u.CreatedAt,
		)
		cr.User = u
		creators = append(creators, cr)
	}
	if creators == nil {
		creators = []models.Creator{}
	}
	c.JSON(http.StatusOK, creators)
}

// AdminCreateCreator creates a new creator with user account — raw SQL
func AdminCreateCreator(c *gin.Context) {
	var req CreateCreatorRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if email already exists
	var existingID uint
	database.DB.Raw("SELECT id FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1", req.Email).Scan(&existingID)
	if existingID > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	// Insert user
	var userID uint
	err := database.DB.Raw(`
		INSERT INTO users (created_at, updated_at, email, password, role, name, status)
		VALUES (?, ?, ?, ?, 'creator', ?, 'approved')
		RETURNING id
	`, time.Now(), time.Now(), req.Email, string(hashedPassword), req.Name).Scan(&userID).Error
	if err != nil || userID == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Insert creator profile
	var creatorID uint
	err = database.DB.Raw(`
		INSERT INTO creators (created_at, updated_at, user_id, name, bio, category,
		    insta_followers, insta_posts, instagram, youtube, youtube_subscribers, youtube_videos,
		    price_post, price_video, profile_image, is_public)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)
		RETURNING id
	`, time.Now(), time.Now(), userID, req.Name, req.Bio, req.Category,
		req.InstaFollowers, req.InstaPosts, req.Instagram, req.Youtube,
		req.YoutubeSubscribers, req.YoutubeVideos, req.PricePost, req.PriceVideo, req.ProfileImage,
	).Scan(&creatorID).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create creator"})
		return
	}

	var creator models.Creator
	database.DB.Raw(`
		SELECT c.*, u.id, u.email, u.phone, u.role, u.name, u.status
		FROM creators c LEFT JOIN users u ON u.id = c.user_id
		WHERE c.id = ? AND c.deleted_at IS NULL
	`, creatorID).Scan(&creator)

	c.JSON(http.StatusCreated, creator)
}

// AdminDeleteCreator removes a creator — raw SQL
func AdminDeleteCreator(c *gin.Context) {
	id := c.Param("id")

	var userID uint
	database.DB.Raw("SELECT user_id FROM creators WHERE id = ? AND deleted_at IS NULL LIMIT 1", id).Scan(&userID)
	if userID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Creator not found"})
		return
	}

	now := time.Now()
	database.DB.Exec("UPDATE creators SET deleted_at = ? WHERE id = ?", now, id)
	database.DB.Exec("UPDATE users SET deleted_at = ? WHERE id = ?", now, userID)
	c.JSON(http.StatusOK, gin.H{"message": "Creator deleted"})
}

// ===== BRAND MANAGEMENT =====

type CreateBrandRequest struct {
	Email       string `json:"email" binding:"required"`
	Password    string `json:"password" binding:"required"`
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Industry    string `json:"industry"`
	Website     string `json:"website"`
	Logo        string `json:"logo"`
}

// AdminGetBrands returns all brands (admin view) — raw SQL
func AdminGetBrands(c *gin.Context) {
	var brands []models.Brand
	database.DB.Raw(`
		SELECT b.id, b.created_at, b.updated_at, b.user_id, b.name, b.description,
		       b.industry, b.website, b.logo, b.is_public
		FROM brands b
		WHERE b.deleted_at IS NULL
		ORDER BY b.created_at DESC
	`).Scan(&brands)
	if brands == nil {
		brands = []models.Brand{}
	}
	c.JSON(http.StatusOK, brands)
}

// AdminCreateBrand creates a new brand with user account — raw SQL
func AdminCreateBrand(c *gin.Context) {
	var req CreateBrandRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existingID uint
	database.DB.Raw("SELECT id FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1", req.Email).Scan(&existingID)
	if existingID > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)

	var userID uint
	err := database.DB.Raw(`
		INSERT INTO users (created_at, updated_at, email, password, role, name, status)
		VALUES (?, ?, ?, ?, 'brand', ?, 'approved')
		RETURNING id
	`, time.Now(), time.Now(), req.Email, string(hashedPassword), req.Name).Scan(&userID).Error
	if err != nil || userID == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	var brandID uint
	err = database.DB.Raw(`
		INSERT INTO brands (created_at, updated_at, user_id, name, description, industry, website, logo, is_public)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, true)
		RETURNING id
	`, time.Now(), time.Now(), userID, req.Name, req.Description, req.Industry, req.Website, req.Logo,
	).Scan(&brandID).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create brand"})
		return
	}

	var brand models.Brand
	database.DB.Raw("SELECT * FROM brands WHERE id = ? AND deleted_at IS NULL", brandID).Scan(&brand)
	c.JSON(http.StatusCreated, brand)
}

// AdminDeleteBrand removes a brand — raw SQL
func AdminDeleteBrand(c *gin.Context) {
	id := c.Param("id")

	var userID uint
	database.DB.Raw("SELECT user_id FROM brands WHERE id = ? AND deleted_at IS NULL LIMIT 1", id).Scan(&userID)
	if userID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Brand not found"})
		return
	}

	now := time.Now()
	database.DB.Exec("UPDATE brands SET deleted_at = ? WHERE id = ?", now, id)
	database.DB.Exec("UPDATE users SET deleted_at = ? WHERE id = ?", now, userID)
	c.JSON(http.StatusOK, gin.H{"message": "Brand deleted"})
}

// ===== WORKS MANAGEMENT =====

type CreateWorkRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	Category    string `json:"category"`
	IsFeatured  bool   `json:"is_featured"`
}

// AdminGetWorks returns all works — raw SQL
func AdminGetWorks(c *gin.Context) {
	var works []models.Work
	database.DB.Raw("SELECT * FROM works WHERE deleted_at IS NULL ORDER BY created_at DESC").Scan(&works)
	if works == nil {
		works = []models.Work{}
	}
	c.JSON(http.StatusOK, works)
}

// AdminCreateWork creates a new portfolio work — raw SQL
func AdminCreateWork(c *gin.Context) {
	var req CreateWorkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var work models.Work
	err := database.DB.Raw(`
		INSERT INTO works (created_at, updated_at, title, description, image_url, category, is_featured)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		RETURNING *
	`, time.Now(), time.Now(), req.Title, req.Description, req.ImageURL, req.Category, req.IsFeatured,
	).Scan(&work).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create work"})
		return
	}
	c.JSON(http.StatusCreated, work)
}

// AdminDeleteWork removes a work — raw SQL
func AdminDeleteWork(c *gin.Context) {
	id := c.Param("id")
	result := database.DB.Exec("UPDATE works SET deleted_at = ? WHERE id = ? AND deleted_at IS NULL", time.Now(), id)
	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Work not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Work deleted"})
}

// AdminGetCollaborations returns all collaboration requests — raw SQL
func AdminGetCollaborations(c *gin.Context) {
	var requests []models.CollaborationRequest
	database.DB.Raw(`
		SELECT cr.*, 
		       b.id, b.name, b.logo, b.industry,
		       c.id, c.name, c.profile_image, c.category
		FROM collaboration_requests cr
		LEFT JOIN brands b ON b.id = cr.brand_id AND b.deleted_at IS NULL
		LEFT JOIN creators c ON c.id = cr.creator_id AND c.deleted_at IS NULL
		WHERE cr.deleted_at IS NULL
		ORDER BY cr.created_at DESC
	`).Scan(&requests)
	if requests == nil {
		requests = []models.CollaborationRequest{}
	}
	c.JSON(http.StatusOK, requests)
}

// AdminGetStats returns dashboard statistics — raw SQL
func AdminGetStats(c *gin.Context) {
	var creatorCount, brandCount, collabCount, workCount, acceptedCount int64

	database.DB.Raw("SELECT COUNT(*) FROM creators WHERE deleted_at IS NULL").Scan(&creatorCount)
	database.DB.Raw("SELECT COUNT(*) FROM brands WHERE deleted_at IS NULL").Scan(&brandCount)
	database.DB.Raw("SELECT COUNT(*) FROM collaboration_requests WHERE deleted_at IS NULL").Scan(&collabCount)
	database.DB.Raw("SELECT COUNT(*) FROM works WHERE deleted_at IS NULL").Scan(&workCount)
	database.DB.Raw("SELECT COUNT(*) FROM collaboration_requests WHERE status = 'accepted' AND deleted_at IS NULL").Scan(&acceptedCount)

	c.JSON(http.StatusOK, gin.H{
		"creators":       creatorCount,
		"brands":         brandCount,
		"collaborations": collabCount,
		"works":          workCount,
		"accepted":       acceptedCount,
	})
}

// ===== REGISTRATION APPROVALS =====

// AdminGetPendingUsers returns users pending approval — raw SQL
func AdminGetPendingUsers(c *gin.Context) {
	var users []models.User
	database.DB.Raw(`
		SELECT id, created_at, updated_at, email, phone, role, name, status
		FROM users
		WHERE status = 'pending' AND deleted_at IS NULL
		ORDER BY created_at DESC
	`).Scan(&users)
	if users == nil {
		users = []models.User{}
	}
	c.JSON(http.StatusOK, users)
}

type UpdateUserStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

// AdminUpdateUserStatus updates a user's approval status — raw SQL
func AdminUpdateUserStatus(c *gin.Context) {
	id := c.Param("id")
	var req UpdateUserStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status is required"})
		return
	}
	if req.Status != "approved" && req.Status != "rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	var user models.User
	database.DB.Raw("SELECT id, role, name, email, status FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1", id).Scan(&user)
	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	database.DB.Exec("UPDATE users SET status = ?, updated_at = ? WHERE id = ?", req.Status, time.Now(), id)

	if req.Status == "approved" {
		if user.Role == "creator" {
			database.DB.Exec("UPDATE creators SET is_public = true, updated_at = ? WHERE user_id = ? AND deleted_at IS NULL", time.Now(), user.ID)
		} else if user.Role == "brand" {
			database.DB.Exec("UPDATE brands SET is_public = true, updated_at = ? WHERE user_id = ? AND deleted_at IS NULL", time.Now(), user.ID)
		}
	}

	user.Status = req.Status
	c.JSON(http.StatusOK, gin.H{"message": "User status updated to " + req.Status, "user": user})
}
