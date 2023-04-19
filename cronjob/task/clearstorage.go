package task

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/storage"
	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
)

func Clearstorage (fbapp *firebase.App) {
    var totalDeletedFiles int = 0
    defer func() {
        err := recover()
        if (err != nil) {
            log.Fatalf("Error storage: %v\n", err)
        } else {
            log.Printf("Success clearing storage, %d file(s) deleted\n", totalDeletedFiles)
        }
    }()

	client, err := fbapp.Storage(context.Background())
	if err != nil { panic(fmt.Sprintf("error getting storage client \"%v\"", err.Error())) }

	bucket, err := client.DefaultBucket()
    if err != nil { panic(fmt.Sprintf("error getting bucket \"%v\"", err.Error())) }

	folder := "chatimg"
	objs := bucket.Objects(context.Background(), &storage.Query{Prefix: folder})

	for  {
        obj, err := objs.Next()
        if (err == iterator.Done) {
            break
        }
        if err != nil { panic(fmt.Sprintf("error iterating storage objects \"%v\"", err.Error())) }

		if err := bucket.Object(obj.Name).Delete(context.Background()); err != nil {
            panic(fmt.Sprintf("error deleting file %s \"%s\"", obj.Name, err.Error()))
		}
        totalDeletedFiles += 1
	}
}
