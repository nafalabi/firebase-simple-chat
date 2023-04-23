# Firebase Simple Chat
> Showcase implementation of a single-room chat app using firebase with google authentication and cronjob

Tech used:
- React.js
- Firebase
- Go (cronjob)

## Prerequisite
1. Create a firebase project
2. Configure firestore, storage, authentication and firebase websdk from firebase console
3. Setup respective .env files using the template from `./.env.sample` & `./cronjob/.env.sample`
4. Generate and download firebase service account from console and copy to `./cronjob/service-account.json`
5. (Optional) publish firestore & storage rule with firebase CLI `npx firebase deploy --only storage,firestore`

## To Build

### Build with Docker
Make sure you have docker installed then run `docker compose up`

### Build without Docker
- build frontend `yarn build`
- build cronjob `cd cronjob; go mod download; go build -o cronjob`
- host frontend files with firebase hosting `yarn run deploy:hosting` or with your prefered hosting
- add this line into your crontab `0 3 * * *  cd $APPDIR/cronjob && ./cronjob` (run every day at 3am)
