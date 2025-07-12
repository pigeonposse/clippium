# CLI documentation

This is a sample server Petstore server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.

## Commands

### pet-petId-uploadImage

Path: /pet/{petId}/uploadImage

#### Subcommands (pet-petId-uploadImage)

#### post

Method: post

##### Options (post)

- **`petId`** (string) _(required)_: ID of pet to update
- **`additionalMetadata`** (string): Additional data to pass to server
- **`file`** (string): file to upload

### pet

Path: /pet

#### Subcommands (pet)

#### post

Method: post

##### Options (post)

- **`body`** (object) _(required)_: Pet object that needs to be added to the store

#### put

Method: put

##### Options (put)

- **`body`** (object) _(required)_: Pet object that needs to be added to the store

### pet-findByStatus

Path: /pet/findByStatus

#### Subcommands (pet-findByStatus)

#### get

Method: get

##### Options (get)

- **`status`** (string) _(required)_: Status values that need to be considered for filter

### pet-findByTags

Path: /pet/findByTags

#### Subcommands (pet-findByTags)

#### get

Method: get

##### Options (get)

- **`tags`** (string) _(required)_: Tags to filter by

### pet-petId

Path: /pet/{petId}

#### Subcommands (pet-petId)

#### get

Method: get

##### Options (get)

- **`petId`** (string) _(required)_: ID of pet to return

#### post

Method: post

##### Options (post)

- **`petId`** (string) _(required)_: ID of pet that needs to be updated
- **`name`** (string): Updated name of the pet
- **`status`** (string): Updated status of the pet

#### delete

Method: delete

##### Options (delete)

- **`api_key`** (string):
- **`petId`** (string) _(required)_: Pet id to delete

### store-inventory

Path: /store/inventory

#### Subcommands (store-inventory)

#### get

Method: get

### store-order

Path: /store/order

#### Subcommands (store-order)

#### post

Method: post

##### Options (post)

- **`body`** (object) _(required)_: order placed for purchasing the pet

### store-order-orderId

Path: /store/order/{orderId}

#### Subcommands (store-order-orderId)


#### get

Method: get

##### Options (get)

- **`orderId`** (string) _(required)_: ID of pet that needs to be fetched

#### delete

Method: delete

##### Options (delete)

- **`orderId`** (string) _(required)_: ID of the order that needs to be deleted

### user-createWithList

Path: /user/createWithList

#### Subcommands (user-createWithList)


#### post

Method: post

##### Options (post)

- **`body`** (array) _(required)_: List of user object

### user-username

Path: /user/{username}

#### Subcommands (user-username)


#### get

Method: get

##### Options (get)

- **`username`** (string) _(required)_: The name that needs to be fetched. Use user1 for testing.

#### put

Method: put

##### Options (put)

- **`username`** (string) _(required)_: name that need to be updated
- **`body`** (object) _(required)_: Updated user object

#### delete

Method: delete

##### Options (delete)

- **`username`** (string) _(required)_: The name that needs to be deleted

### user-login

Path: /user/login

#### Subcommands (user-login)


#### get

Method: get

##### Options (get)

- **`username`** (string) _(required)_: The user name for login
- **`password`** (string) _(required)_: The password for login in clear text

### user-logout

Path: /user/logout

#### Subcommands (user-logout)


#### get

Method: get


### user-createWithArray

Path: /user/createWithArray

#### Subcommands (user-createWithArray)


#### post

Method: post

##### Options (post)

- **`body`** (array) _(required)_: List of user object

### user

Path: /user

#### Subcommands (user)


#### post

Method: post

##### Options (post)

- **`body`** (object) _(required)_: Created user object
