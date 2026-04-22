package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a system user (admin, creator, or brand)
type User struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	Email     string         `json:"email" gorm:"uniqueIndex;not null"`
	Phone     string         `json:"phone"`
	Password  string         `json:"-" gorm:"not null"`
	Role      string         `json:"role" gorm:"not null"` // "admin", "creator", "brand"
	Name      string         `json:"name" gorm:"not null"`
	Status    string         `json:"status" gorm:"default:'pending'"` // "pending", "approved", "rejected"
}

// Creator represents a content creator profile
type Creator struct {
	ID           uint           `json:"id" gorm:"primarykey"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
	UserID       uint           `json:"user_id" gorm:"uniqueIndex"`
	User         User           `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Name         string         `json:"name" gorm:"not null"`
	Bio          string         `json:"bio"`
	Category     string         `json:"category"`
	InstaFollowers int          `json:"insta_followers"`
	InstaPosts     int          `json:"insta_posts"`
	Instagram      string       `json:"instagram"`
	Youtube            string   `json:"youtube"`
	YoutubeSubscribers int      `json:"youtube_subscribers"`
	YoutubeVideos      int      `json:"youtube_videos"`
	PricePost          float64  `json:"price_post"`
	PriceVideo         float64  `json:"price_video"`
	ProfileImage       string   `json:"profile_image"`
	IsPublic     bool           `json:"is_public" gorm:"default:true"`
}

// Brand represents a brand profile
type Brand struct {
	ID          uint           `json:"id" gorm:"primarykey"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
	UserID      uint           `json:"user_id" gorm:"uniqueIndex"`
	User        User           `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Name        string         `json:"name" gorm:"not null"`
	Description string         `json:"description"`
	Industry    string         `json:"industry"`
	Website     string         `json:"website"`
	Logo        string         `json:"logo"`
	IsPublic    bool           `json:"is_public" gorm:"default:true"`
}

// CollaborationRequest represents a collab request from brand to creator
type CollaborationRequest struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	BrandID   uint           `json:"brand_id" gorm:"not null"`
	Brand     Brand          `json:"brand,omitempty" gorm:"foreignKey:BrandID"`
	CreatorID uint           `json:"creator_id" gorm:"not null"`
	Creator   Creator        `json:"creator,omitempty" gorm:"foreignKey:CreatorID"`
	Status    string         `json:"status" gorm:"default:'pending'"` // "pending", "accepted", "rejected"
	Message   string         `json:"message"`
}

// Work represents portfolio/showcase items visible publicly
type Work struct {
	ID          uint           `json:"id" gorm:"primarykey"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
	Title       string         `json:"title" gorm:"not null"`
	Description string         `json:"description"`
	ImageURL    string         `json:"image_url"`
	Category    string         `json:"category"`
	IsFeatured  bool           `json:"is_featured" gorm:"default:false"`
}
