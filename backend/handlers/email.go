package handlers

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
)

// SendAdminNotificationEmail sends an email to the admin using SMTP.
func SendAdminNotificationEmail(subject string, body string) error {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	senderEmail := os.Getenv("SMTP_EMAIL")
	senderPassword := os.Getenv("SMTP_PASSWORD")
	adminEmail := os.Getenv("ADMIN_NOTIFY_EMAIL")

	if host == "" || senderEmail == "" || senderPassword == "" || adminEmail == "" {
		log.Println("SMTP credentials not fully configured; skipping email notification.")
		return nil
	}

	auth := smtp.PlainAuth("", senderEmail, senderPassword, host)

	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", senderEmail, adminEmail, subject, body)

	err := smtp.SendMail(host+":"+port, auth, senderEmail, []string{adminEmail}, []byte(msg))
	if err != nil {
		log.Printf("Failed to send email: %v", err)
		return err
	}

	log.Printf("Admin notification email sent successfully: %s", subject)
	return nil
}
