package handlers

import (
	"net/http"
	"time"
	"vp-backend/database"
	"vp-backend/middleware"
	"vp-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  models.User `json:"user"`
}

type RegisterRequest struct {
	Name               string  `json:"name" binding:"required"`
	Email              string  `json:"email" binding:"required"`
	Phone              string  `json:"phone" binding:"required"`
	Password           string  `json:"password" binding:"required"`
	Role               string  `json:"role" binding:"required"`
	Instagram          string  `json:"instagram"`
	Youtube            string  `json:"youtube"`
	InstaFollowers     int     `json:"insta_followers"`
	InstaPosts         int     `json:"insta_posts"`
	YoutubeSubscribers int     `json:"youtube_subscribers"`
	YoutubeVideos      int     `json:"youtube_videos"`
	PricePost          float64 `json:"price_post"`
	PriceVideo         float64 `json:"price_video"`
	ProfileImage       string  `json:"profile_image"`
	Category           string  `json:"category"`
}

// Login handles user authentication — raw SQL
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
		return
	}

	var user models.User
	database.DB.Raw(`
		SELECT id, created_at, updated_at, email, phone, password, role, name, status
		FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1
	`, req.Email).Scan(&user)

	if user.ID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if user.Password != req.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if user.Role != "admin" && user.Status != "approved" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Account pending admin approval"})
		return
	}

	claims := &middleware.Claims{
		UserID: user.ID,
		Email:  user.Email,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(middleware.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	user.Password = "" // scrub before sending
	c.JSON(http.StatusOK, LoginResponse{Token: tokenString, User: user})
}

// Register handles creation of a new user — raw SQL
func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	if req.Role != "creator" && req.Role != "brand" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Role must be creator or brand"})
		return
	}

	// Check email uniqueness
	var existingID uint
	database.DB.Raw("SELECT id FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1", req.Email).Scan(&existingID)
	if existingID > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
		return
	}

	// Plain text password as per user request

	// Insert user
	var userID uint
	err := database.DB.Raw(`
		INSERT INTO users (created_at, updated_at, email, phone, password, role, name, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
		RETURNING id
	`, time.Now(), time.Now(), req.Email, req.Phone, req.Password, req.Role, req.Name,
	).Scan(&userID).Error
	if err != nil || userID == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Create profile based on role
	if req.Role == "creator" {
		database.DB.Exec(`
			INSERT INTO creators (created_at, updated_at, user_id, name, instagram, youtube,
			    insta_followers, insta_posts, youtube_subscribers, youtube_videos,
			    price_post, price_video, profile_image, category, is_public)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)
		`, time.Now(), time.Now(), userID, req.Name, req.Instagram, req.Youtube,
			req.InstaFollowers, req.InstaPosts, req.YoutubeSubscribers, req.YoutubeVideos,
			req.PricePost, req.PriceVideo, req.ProfileImage, req.Category,
		)
	} else if req.Role == "brand" {
		database.DB.Exec(`
			INSERT INTO brands (created_at, updated_at, user_id, name, logo, is_public)
			VALUES (?, ?, ?, ?, ?, false)
		`, time.Now(), time.Now(), userID, req.Name, req.ProfileImage,
		)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registration successful, pending admin approval"})
}

// GetMe returns current user info — raw SQL
func GetMe(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var user models.User
	database.DB.Raw(`
		SELECT id, created_at, updated_at, email, phone, role, name, status
		FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1
	`, userID).Scan(&user)
	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}
