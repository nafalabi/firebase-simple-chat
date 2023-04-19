package main

import (
	"firebase-simplechat/crontask/config"
	"firebase-simplechat/crontask/task"
)

func main() {
    fbapp, err := config.NewFirebaseApp()
    if (err != nil) { panic(err) }

    task.Clearstorage(fbapp)
    task.Clearfirestore(fbapp, 20);
    task.Inputinitialchat(fbapp);
}
