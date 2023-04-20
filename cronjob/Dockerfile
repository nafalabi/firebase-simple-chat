FROM golang:1.20.3-alpine3.17 as build

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . ./
RUN go build -o ./bin/cronjob


FROM alpine:3.17
ARG TZ=Asia/Jakarta
ARG FIREBASE_STORAGE_BUCKET

RUN test -n "$FIREBASE_STORAGE_BUCKET" || (echo "FIREBASE_STORAGE_BUCKET arg was not provided" && false)

ENV TZ=${TZ}
ENV FIREBASE_STORAGE_BUCKET=${FIREBASE_STORAGE_BUCKET}

RUN apk add dumb-init tzdata

COPY --from=build /app/service-account.json /app/bin/service-account.json
COPY --from=build /app/bin/cronjob /app/bin/cronjob

RUN echo "0 3 * * * cd /app/bin && ./cronjob" >> /etc/crontabs/root

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD ["crond", "-f", "-l", "2"]

