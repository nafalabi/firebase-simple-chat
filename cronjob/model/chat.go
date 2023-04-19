package model

import (
	"time"
)

type ChatDocument struct {
    Uid         string `json:"uid"`
    Uname       string `json:"uname"`
    Upicture    string `json:"upicture"`
    Message     string `json:"message"`
    Chatpic     string `json:"chatpic"`
    CreatedAt   time.Time `json:"createdAt"`
}
