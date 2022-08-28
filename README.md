## Install and Launch the API

After cloning the repository and with the credentials included in the `.env` configuration file, we are going to install it and for that we need [Docker](https://www.docker.com) installed to build the images.

We run the commands:

```bash
$ docker build -t will-bank/node-mongo:latest .
```

And then:

```bash
$ docker-compose up
```

It's a process that can take a few minutes, but after that, we'll have everything we need to use the endpoints.

## Test
To run the tests, we use:

```bash
# unit tests
$ yarn test
```

## Database

We are currently using the [Mongo Database](https://www.mongodb.com/pt-br) for the simple fact that we do not need to design a schema in the database, as the payment service was created in a generic way and can be scaled to other types of payment, not just ticket.

## Swagger

The swagger server runs on `http://localhost:4001/swagger`

## Application

### Create User

Example to create user on endpoint: `http://localhost:4001/user` - `POST`
```json
{
    "isAdmin": true,
    "firstName": "Jack",
    "lastName": "Ryan",
    "email": "jack.ryan@gmail.com",
    "password": "1234567aA@"
}
```

When we create a user, it already returns an accessToken so we can use it on other endpoints that require authentication.

### Login

Example for logging into the application: `http://localhost:4001/auth/login` - `POST`
```json
{
    "email": "jack.ryan@gmail.com",
    "password": "1234567aA@"
}
```

Return example:

```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

Now we can use endpoints that require authentication.

### Payment

To pay a ticket it's necessary to be authenticated and make a request to `http://localhost:4001/payment/ticket` - `POST`

Payload example:

```json
{
    "billet": "82650000001132311699000900202215332047616454199",
    "amount": "2000"
}
```

Return example

```json
{
    "paymentDate": "2022-08-27T21:41:56.630Z",
    "retryPay": 0,
    "errorMessage": null,
    "_id": "630a8fa49899184a20507af4",
    "userId": "630a85d6d75c5a002dc83844",
    "metadata": {
        "cashBackValueReceived": 420,
        "billet": "82650000001132311699000900202215332047616454199",
        "amount": "2000",
        "transactiondId": "416c203b-1842-4a10-baad-fbfab50de355"
    },
    "paymentType": "TICKET",
    "status": "SUCCESS",
    "createdAt": "2022-08-27T21:41:56.632Z",
    "updatedAt": "2022-08-27T21:41:56.632Z",
    "__v": 0
}
```

### Cash back
Only those who can register a cashback rule are users who are administrators of the application. If when you registered a user informed the property `isAdmin: true`, the user is an administrator and you can register cashback rules.

The rule

To register a cash back rule it is necessary to make a request to `http://localhost:4001/cash-back/rules` - `POST`

Payload example:

```json

{
     "active": true,
     "from": 2000,
     "to": 5000,
     "percentage": 4
}
```

With this rule registered, any user who makes the payment of a ticket whose value is between 2000 and 5000, will earn 4% cashback that will be added to the account balance.

### Transaction History

All users can see the history of payments made. To do this, simply make a request to `http://localhost:4001/payment/transactions` - `GET`.
This endpoint returns to us, in a paged form, all the transactions carried out by the logged-in user. To see all available filters, see swagger.

### Fault Tolerance
When making the payment of a ticket, in case there is any failure in the entire flow, we will register the payment request with the data informed and a cron job will work to try to make the payment again up to 3 times in a period of 30 minutes, that is, every 10 minutes it will try to make the payment of the ticket again, if it is not successful, we will send an email to the user informing that there was an error when processing the payment of the ticket and that he should contact the call center .

