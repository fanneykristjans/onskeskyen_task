# Ønskeskyen task

by Fanney Kristjansdottir

Instructions found [here](https://github.com/teamheylink/developer-interview).

---

## How to run

- Start docker daemon
- In the terminal (in the code root folder), write:

```
docker-compose up -d
```

it should result in something like:

```
[+] Running 1/1
 ⠿ Container onskeskyen-task-db-1  Started
```

- Now you have a mysql database running in Docker with the sample data given.
- Next, install all dependencies for the program to run locally:

```
npm install
```

Now, start the program:

```
npm run serve
```

---

## The API endpoints

The following endpoints are available:

- **`GET /paymentNotes`**
  - returns all payment notes
- **`GET /transactions/{paymentNoteId}`**
  - returns all transaction belonging to the given `paymentNoteId`
- **`POST /paymentNotes`**
  - expects the following body:

```
{
    "period_from_datetime": "yyyy-mm-dd hh:mm:ss",
    "period_to_datetime": "yyyy-mm-dd hh:mm:ss"
}
```

### Sample client:

---

```
  curl --location --request POST 'localhost:3000/paymentNotes' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "period_from_datetime": "2021-01-01 00:32:00",
      "period_to_datetime": "2021-01-01 00:34:00"
  }'
```

Then get all the payment notes:

```
  curl --location --request GET 'localhost:3000/paymentNotes' \
  --data-raw ''
```

Copy the payment_note_uuid and use it in the next GET request:

```
  curl --location --request GET 'localhost:3000/transactions/15f56374-3348-44b5-b145-e3809987fe12' \
  --data-raw ''
```

## Q&A

1. _What do you see as potential issues, if the volume of transactions per payment note is ever increasing?_

   The aggregations of transactions per payment note (SUM and COUNT) could become an issue since MySQL is hard to scale horizontally.

2. _If you had the option to choose any tech-stack & service(s) to help scale up the handling of an ever increasing volume of transactions, which would you choose & how would each chosen option help?_

   This could be batched and run during off-peak hours. We could implement a queueing system and have a separate service work on the queue. However, Cloud service providers offer fully-managed database services where scaling is taken care of, meaning we don't have to worry about computing resources.

3. _Would the chosen options change the architecture of the code written for this task? If so, explain briefly what would change._

   Adding a batching or queueing system would mean adding another service running separately. Also, with ever increasing data it would be better to separate the API service from the database service, towards a microservice arcitecture.

---

### Notes:

- There are a lot of duplicate inserts (same transaction_uuid) in the sql file, so I added an ignore statement to the inserts so that the script continutes.
- The instructions mention using `express` so that is the only library used and the rest is kept pretty raw. Using an ORM would make the code a lot nicer to work with but I tried to avoid over-engineering a small task like this.
