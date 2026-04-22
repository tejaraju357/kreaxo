package main

import (
	"bufio"
	"log"
	"os"
	"strings"
	"vp-backend/database"
	"vp-backend/handlers"
	"vp-backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// loadEnv reads a .env file (if present) and sets unset env vars
func loadEnv(filename string) {
	f, err := os.Open(filename)
	if err != nil {
		return // .env is optional
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}
		key := strings.TrimSpace(parts[0])
		val := strings.TrimSpace(parts[1])
		if os.Getenv(key) == "" {
			os.Setenv(key, val)
		}
	}
}

func main() {
	// Load environment variables from .env file (optional)
	loadEnv(".env")

	// Connect to database
	database.Connect()

	r := gin.Default()

	// CORS configuration for React frontend
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// ======================= PUBLIC ROUTES ====================
	public := r.Group("/api/public")
	{
		public.GET("/works", handlers.PublicGetWorks)
		public.GET("/works/featured", handlers.PublicGetFeaturedWorks)
		public.GET("/creators", handlers.PublicGetCreators)
		public.GET("/brands", handlers.PublicGetBrands)
		public.GET("/stats", handlers.PublicGetStats)
	}

	// ==================== AUTH ROUTES =======================
	auth := r.Group("/api/auth")
	{
		auth.POST("/login", handlers.Login)
		auth.POST("/register", handlers.Register)
		auth.POST("/fetch-social", handlers.FetchSocialStats) // public: fetch social media stats
	}

	// ==================== PROTECTED ROUTES ====================
	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/me", handlers.GetMe)
	}

	// ==================== ADMIN ROUTES ====================
	admin := r.Group("/api/admin")
	admin.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("admin"))
	{
		// Stats
		admin.GET("/stats", handlers.AdminGetStats)

		// Creators
		admin.GET("/creators", handlers.AdminGetCreators)
		admin.POST("/creators", handlers.AdminCreateCreator)
		admin.DELETE("/creators/:id", handlers.AdminDeleteCreator)

		// Brands
		admin.GET("/brands", handlers.AdminGetBrands)
		admin.POST("/brands", handlers.AdminCreateBrand)
		admin.DELETE("/brands/:id", handlers.AdminDeleteBrand)

		// Works
		admin.GET("/works", handlers.AdminGetWorks)
		admin.POST("/works", handlers.AdminCreateWork)
		admin.DELETE("/works/:id", handlers.AdminDeleteWork)

		// Collaborations
		admin.GET("/collaborations", handlers.AdminGetCollaborations)

		// User Registrations / Approvals
		admin.GET("/users/pending", handlers.AdminGetPendingUsers)
		admin.PUT("/users/:id/status", handlers.AdminUpdateUserStatus)
	}

	// ==================== BRAND ROUTES ====================
	brand := r.Group("/api/brand")
	brand.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("brand"))
	{
		brand.GET("/profile", handlers.BrandGetProfile)
		brand.GET("/creators", handlers.BrandGetCreators)
		brand.POST("/request", handlers.BrandSendRequest)
		brand.GET("/requests", handlers.BrandGetRequests)
	}

	// ==================== CREATOR ROUTES ====================
	creator := r.Group("/api/creator")
	creator.Use(middleware.AuthMiddleware(), middleware.RoleMiddleware("creator"))
	{
		creator.GET("/profile", handlers.CreatorGetProfile)
		creator.PUT("/profile", handlers.CreatorUpdateProfile)
		creator.GET("/brands", handlers.CreatorGetBrands)
		creator.GET("/requests", handlers.CreatorGetRequests)
		creator.PUT("/requests/:id", handlers.CreatorRespondRequest)
	}

	log.Println("Server starting on :3595")
	if err := r.Run(":3595"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
