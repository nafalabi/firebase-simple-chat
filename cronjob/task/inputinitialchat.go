package task

import (
	"context"
	"log"
	"time"

	firebase "firebase.google.com/go"
)

func Inputinitialchat (fbapp *firebase.App) {
    defer func() {
        err := recover()
        if (err != nil) {
            log.Fatalf("Error input initial chat: %v\n", err)
        } else {
            log.Printf("Success adding initial chat\n")
        }
    }()

    ctx := context.Background()
    firestore, err := fbapp.Firestore(ctx)
    if (err != nil) { panic(err) }

    data := make(map[string]interface{})
    data["uid"] = "info-bot";
    data["uname"] = "Information [BOT]";
    data["upicture"] = nil;
    data["message"] = "Hi, welcome!\n\nThis is a simple demo chat app using firebase, you are free to send chats or images!\n\nNo data is collected, all the data will be purged daily with a cronjob.\n\nHappy Testing!";
    data["createdAt"] = time.Now();

    docRef, res, err := firestore.Collection("chat").Add(ctx, data);
    if (err != nil) { panic(err) }

    _, _ = docRef, res
}
