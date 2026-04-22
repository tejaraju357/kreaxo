package database

import (
	"log"
	"vp-backend/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var err error
	// Used URL-encoded password to safely handle the '@' symbol in 'VP@project-test01'
	dsn := "postgres://postgres.zcijydcieognlvsoxvdu:VP%40project-test01@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"
	DB, err = gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true, // Fixes issues with Supabase connection pooling
	}), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate all models (no drop - preserve existing data)
	err = DB.AutoMigrate(
		&models.User{},
		&models.Creator{},
		&models.Brand{},
		&models.CollaborationRequest{},
		&models.Work{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}


	// Hot-patch specifically addressing the NULL columns in Supabase for existing demo creators
	DB.Exec(`UPDATE creators SET instagram='https://instagram.com/aliceparker', youtube='', insta_followers=125000, insta_posts=245, youtube_subscribers=850000, youtube_videos=120, price_post=5000, price_video=12000 WHERE name = 'Alice Parker'`)
	DB.Exec(`UPDATE creators SET instagram='https://instagram.com/bobsmith_travel', youtube='', insta_followers=450000, insta_posts=890, youtube_subscribers=0, youtube_videos=0, price_post=8000, price_video=20000 WHERE name = 'Bob Smith'`)
	DB.Exec(`UPDATE creators SET youtube='https://youtube.com/@charliefitness', instagram='', insta_followers=0, insta_posts=0, youtube_subscribers=240000, youtube_videos=86, price_post=0, price_video=15000 WHERE name = 'Charlie Davis'`)
	DB.Exec(`UPDATE creators SET instagram='https://instagram.com/dianaprin', youtube='https://youtube.com/@diana_vlogs', insta_followers=1200000, insta_posts=1560, youtube_subscribers=450000, youtube_videos=32, price_post=15000, price_video=35000 WHERE name = 'Diana Prince'`)
	DB.Exec(`UPDATE creators SET youtube='https://youtube.com/@evanwright_gaming', instagram='', insta_followers=85000, insta_posts=45, youtube_subscribers=1200000, youtube_videos=450, price_post=5000, price_video=18000 WHERE name = 'Evan Wright'`)
	DB.Exec(`UPDATE creators SET instagram='https://instagram.com/fiona_decor', youtube='', insta_followers=320000, insta_posts=412, youtube_subscribers=0, youtube_videos=0, price_post=9000, price_video=25000 WHERE name = 'Fiona Gallagher'`)
	DB.Exec(`UPDATE creators SET youtube='https://youtube.com/@georgefilm', instagram='', insta_followers=0, insta_posts=0, youtube_subscribers=890000, youtube_videos=156, price_post=0, price_video=22000 WHERE name = 'George Miller'`)
	DB.Exec(`UPDATE creators SET instagram='https://instagram.com/hannahbaker.photo', youtube='', insta_followers=150000, insta_posts=670, youtube_subscribers=0, youtube_videos=0, price_post=6000, price_video=15000 WHERE name = 'Hannah Baker'`)
	DB.Exec(`UPDATE creators SET youtube='https://youtube.com/@iansomerhalder_weddings', instagram='', insta_followers=55000, insta_posts=89, youtube_subscribers=12000, youtube_videos=14, price_post=3000, price_video=10000 WHERE name = 'Ian Somerhalder'`)
	DB.Exec(`UPDATE creators SET instagram='https://instagram.com/juliarobertsugc', youtube='', insta_followers=12000, insta_posts=45, youtube_subscribers=0, youtube_videos=0, price_post=2000, price_video=5000 WHERE name = 'Julia Roberts'`)

	// Seed database with dummy data if not exists
	seedDatabase()
	// Always enforce correct admin credentials
	ensureAdminCredentials()

	log.Println("Database connected and migrated successfully")
}

func ensureAdminCredentials() {
	correctEmail := "priyathamtella@gmail.com"
	correctPassword := "reechomedia"
	
	var admin models.User
	// Check if admin with correct email exists
	if err := DB.Where("email = ? AND role = ?", correctEmail, "admin").First(&admin).Error; err != nil {
		// Try to find admin by role and update
		if err2 := DB.Where("role = ?", "admin").First(&admin).Error; err2 == nil {
			DB.Model(&admin).Updates(map[string]interface{}{
				"email":    correctEmail,
				"password": correctPassword,
				"name":     "Priyatham Tella",
				"status":   "approved",
			})
		}
	} else {
		// Admin already has correct email, just ensure password is correct
		DB.Model(&admin).Update("password", correctPassword)
	}
}

func seedDatabase() {
	var count int64
	DB.Model(&models.User{}).Where("role = ?", "admin").Count(&count)
	if count > 0 {
		return // Already seeded
	}

	adminPass := "reechomedia"
	creatorPass := "creator123"
	brandPass := "brand123"

	// Admin
	admin := models.User{Email: "priyathamtella@gmail.com", Password: adminPass, Role: "admin", Name: "Priyatham Tella", Status: "approved"}
	DB.Create(&admin)

	// Creators
	creators := []models.User{
		{Email: "alice@creator.com", Password: creatorPass, Role: "creator", Name: "Alice Parker", Status: "approved"},
		{Email: "bob@creator.com", Password: creatorPass, Role: "creator", Name: "Bob Smith", Status: "approved"},
		{Email: "charlie@creator.com", Password: creatorPass, Role: "creator", Name: "Charlie Davis", Status: "approved"},
		{Email: "diana@creator.com", Password: creatorPass, Role: "creator", Name: "Diana Prince", Status: "approved"},
		{Email: "evan@creator.com", Password: creatorPass, Role: "creator", Name: "Evan Wright", Status: "approved"},
		{Email: "fiona@creator.com", Password: creatorPass, Role: "creator", Name: "Fiona Gallagher", Status: "approved"},
		{Email: "george@creator.com", Password: creatorPass, Role: "creator", Name: "George Miller", Status: "approved"},
		{Email: "hannah@creator.com", Password: creatorPass, Role: "creator", Name: "Hannah Baker", Status: "approved"},
		{Email: "ian@creator.com", Password: creatorPass, Role: "creator", Name: "Ian Somerhalder", Status: "approved"},
		{Email: "julia@creator.com", Password: creatorPass, Role: "creator", Name: "Julia Roberts", Status: "approved"},
		{Email: "kevin@creator.com", Password: creatorPass, Role: "creator", Name: "Kevin Hart", Status: "approved"},
		{Email: "liam@creator.com", Password: creatorPass, Role: "creator", Name: "Liam Neeson", Status: "approved"},
		{Email: "mia@creator.com", Password: creatorPass, Role: "creator", Name: "Mia Khalifa", Status: "approved"},
		{Email: "noah@creator.com", Password: creatorPass, Role: "creator", Name: "Noah Centineo", Status: "approved"},
		{Email: "olivia@creator.com", Password: creatorPass, Role: "creator", Name: "Olivia Rodrigo", Status: "approved"},
	}
	for i := range creators {
		DB.Create(&creators[i])
	}

	cProfs := []models.Creator{
		{UserID: creators[0].ID, Name: "Alice Parker", Bio: "Tech gracefully unpacked.", Category: "Tech", InstaFollowers: 125000, InstaPosts: 245, YoutubeSubscribers: 850000, YoutubeVideos: 120, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"},
		{UserID: creators[1].ID, Name: "Bob Smith", Bio: "Traveling the world.", Category: "Lifestyle", InstaFollowers: 450000, InstaPosts: 890, YoutubeSubscribers: 0, YoutubeVideos: 0, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600"},
		{UserID: creators[2].ID, Name: "Charlie Davis", Bio: "Fitness motivation.", Category: "Fitness", InstaFollowers: 0, InstaPosts: 0, YoutubeSubscribers: 240000, YoutubeVideos: 86, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=600"},
		{UserID: creators[3].ID, Name: "Diana Prince", Bio: "Fashion icon.", Category: "Influencer", InstaFollowers: 1200000, InstaPosts: 1560, YoutubeSubscribers: 450000, YoutubeVideos: 32, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600"},
		{UserID: creators[4].ID, Name: "Evan Wright", Bio: "Gaming highlights.", Category: "Gaming", InstaFollowers: 85000, InstaPosts: 45, YoutubeSubscribers: 1200000, YoutubeVideos: 450, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=600"},
		{UserID: creators[5].ID, Name: "Fiona Gallagher", Bio: "Home decor.", Category: "Influencer", InstaFollowers: 320000, InstaPosts: 412, YoutubeSubscribers: 0, YoutubeVideos: 0, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=600"},
		{UserID: creators[6].ID, Name: "George Miller", Bio: "Film making tutorials.", Category: "Videographer", InstaFollowers: 0, InstaPosts: 0, YoutubeSubscribers: 890000, YoutubeVideos: 156, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600"},
		{UserID: creators[7].ID, Name: "Hannah Baker", Bio: "Product photography.", Category: "Photographer", InstaFollowers: 150000, InstaPosts: 670, YoutubeSubscribers: 0, YoutubeVideos: 0, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600"},
		{UserID: creators[8].ID, Name: "Ian Somerhalder", Bio: "Cinematic wedding videography.", Category: "Videographer", InstaFollowers: 55000, InstaPosts: 89, YoutubeSubscribers: 12000, YoutubeVideos: 14, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600"},
		{UserID: creators[9].ID, Name: "Julia Roberts", Bio: "Minimalist product UGC.", Category: "UGC", InstaFollowers: 12000, InstaPosts: 45, YoutubeSubscribers: 0, YoutubeVideos: 0, IsPublic: true, ProfileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"},
	}
	for _, c := range cProfs {
		DB.Create(&c)
	}

	// Brands
	brands := []models.User{
		{Email: "nike@brand.com", Password: brandPass, Role: "brand", Name: "Nike", Status: "approved"},
		{Email: "samsung@brand.com", Password: brandPass, Role: "brand", Name: "Samsung", Status: "approved"},
		{Email: "gymshark@brand.com", Password: brandPass, Role: "brand", Name: "Gymshark", Status: "approved"},
		{Email: "zara@brand.com", Password: brandPass, Role: "brand", Name: "Zara", Status: "approved"},
		{Email: "razer@brand.com", Password: brandPass, Role: "brand", Name: "Razer", Status: "approved"},
		{Email: "dyson@brand.com", Password: brandPass, Role: "brand", Name: "Dyson", Status: "approved"},
		{Email: "spotify@brand.com", Password: brandPass, Role: "brand", Name: "Spotify", Status: "approved"},
		{Email: "gopro@brand.com", Password: brandPass, Role: "brand", Name: "GoPro", Status: "approved"},
	}
	for i := range brands {
		DB.Create(&brands[i])
	}

	var savedBrands []models.Brand
	bProfs := []models.Brand{
		{UserID: brands[0].ID, Name: "Nike", Description: "Global athletics and apparel.", Industry: "Sports", IsPublic: true, Logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150"},
		{UserID: brands[1].ID, Name: "Samsung", Description: "Innovative electronics.", Industry: "Technology", IsPublic: true, Logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=150"},
		{UserID: brands[2].ID, Name: "Gymshark", Description: "Fitness apparel and accessories.", Industry: "Fitness", IsPublic: true, Logo: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=150"},
		{UserID: brands[3].ID, Name: "Zara", Description: "Fast fashion retail company.", Industry: "Fashion", IsPublic: true, Logo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=150"},
		{UserID: brands[4].ID, Name: "Razer", Description: "High performance gaming hardware.", Industry: "Gaming", IsPublic: true, Logo: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=150"},
		{UserID: brands[5].ID, Name: "Dyson", Description: "Innovative home appliances.", Industry: "Home", IsPublic: true, Logo: "https://images.unsplash.com/photo-1558024920-b41e1887dc32?auto=format&fit=crop&q=80&w=150"},
		{UserID: brands[6].ID, Name: "Spotify", Description: "Digital music streaming service.", Industry: "Entertainment", IsPublic: true, Logo: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=150"},
		{UserID: brands[7].ID, Name: "GoPro", Description: "Versatile action cameras.", Industry: "Technology", IsPublic: true, Logo: "https://images.unsplash.com/photo-1526330541165-8db58e1c6628?auto=format&fit=crop&q=80&w=150"},
	}
	for i, b := range bProfs {
		DB.Create(&b)
		bProfs[i] = b
		savedBrands = append(savedBrands, b)
	}

	var savedCreators []models.Creator
	DB.Find(&savedCreators)

	// dummy Works
	DB.Create(&models.Work{Title: "Nike Summer Campaign Shoot", Description: "A fantastic launch video featuring top creators in action.", Category: "Videography", IsFeatured: true, ImageURL: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=600"})
	DB.Create(&models.Work{Title: "Samsung S24 Product Shots", Description: "High-quality product photography highlighting new features.", Category: "Photography", IsFeatured: true, ImageURL: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?auto=format&fit=crop&q=80&w=600"})
	DB.Create(&models.Work{Title: "Gymshark TikTok Haul", Description: "User Generated Content showing off the summer collection.", Category: "UGC", IsFeatured: true, ImageURL: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600"})
	DB.Create(&models.Work{Title: "Razer Social Media Takeover", Description: "Managing interactions during the new keyboard launch.", Category: "SMM", IsFeatured: true, ImageURL: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=600"})
	DB.Create(&models.Work{Title: "Zara Lookbook Reel", Description: "Fast-paced, trendy editing for the fall fashion line.", Category: "Editing", IsFeatured: true, ImageURL: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=600"})
	DB.Create(&models.Work{Title: "GoPro Action Reel", Description: "Extreme sports footage compilation.", Category: "Videography", IsFeatured: true, ImageURL: "https://images.unsplash.com/photo-1526330541165-8db58e1c6628?auto=format&fit=crop&q=80&w=600"})
	DB.Create(&models.Work{Title: "Spotify Wrapped Campaign", Description: "Social media graphics and animation for end of year.", Category: "Editing", IsFeatured: true, ImageURL: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=80&w=600"})
	DB.Create(&models.Work{Title: "Dyson Airwrap Tutorial", Description: "Step-by-step user generated styling tutorial.", Category: "UGC", IsFeatured: true, ImageURL: "https://images.unsplash.com/photo-1558024920-b41e1887dc32?auto=format&fit=crop&q=80&w=600"})

	// dummy Collaborations
	DB.Create(&models.CollaborationRequest{BrandID: savedBrands[0].ID, CreatorID: savedCreators[1].ID, Status: "accepted", Message: "We love your travel vlogs. Let's do a shoot with our new running shoes!"})
	DB.Create(&models.CollaborationRequest{BrandID: savedBrands[1].ID, CreatorID: savedCreators[0].ID, Status: "accepted", Message: "We want to send you the new S24 to review."})
	DB.Create(&models.CollaborationRequest{BrandID: savedBrands[2].ID, CreatorID: savedCreators[2].ID, Status: "pending", Message: "Are you open to being a brand ambassador?"})
	DB.Create(&models.CollaborationRequest{BrandID: savedBrands[4].ID, CreatorID: savedCreators[4].ID, Status: "rejected", Message: "Would you like to feature our new headset stream?"})
	DB.Create(&models.CollaborationRequest{BrandID: savedBrands[7].ID, CreatorID: savedCreators[6].ID, Status: "accepted", Message: "Shoot our new camera in the mountains!"})

	log.Println("Database seeded fully! Log in as admin@collab.com/admin123")
}
