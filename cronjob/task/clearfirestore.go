package task

import (
	"context"
	"log"

	firebase "firebase.google.com/go"
	"google.golang.org/api/iterator"
)

func Clearfirestore (fbapp *firebase.App, batchSize int) {
    var totalDeletedDocs int = 0
    defer func() {
        err := recover()
        if (err != nil) {
            log.Fatalf("Error firestore: %v\n", err)
        } else {
            log.Printf("Success clearing firestore, %d doc(s) deleted\n", totalDeletedDocs)
        }
    }()

    ctx := context.Background()
    firestoreClient, err := fbapp.Firestore(ctx)
    if (err != nil) { panic(err) }

    col := firestoreClient.Collection("chat")
    bulkwriter := firestoreClient.BulkWriter(ctx)

    for {
        iter := col.Limit(batchSize).Documents(ctx)
        numDeleted := 0

        for {
            doc, err := iter.Next()
            if err == iterator.Done {
                break
            }
            if err != nil {
                panic(err)
            }

            bulkwriter.Delete(doc.Ref)
            numDeleted++
            totalDeletedDocs++
        }

        if numDeleted == 0 {
            bulkwriter.End()
            break
        }

        bulkwriter.Flush()
    }
}
