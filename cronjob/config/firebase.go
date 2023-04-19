package config

import (
	"context"
	"os"

	firebase "firebase.google.com/go"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

func NewFirebaseApp() (*firebase.App, error) {
    godotenv.Load()
    config := firebase.Config{
        StorageBucket: os.Getenv("FIREBASE_STORAGE_BUCKET"),
    }
    opt := option.WithCredentialsFile("./service-account.json")
    app, err := firebase.NewApp(context.Background(), &config, opt)
    return app, err
}
