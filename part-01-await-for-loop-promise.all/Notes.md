
### Test when creating documents
- 1.000 users
    - 0.874
    - 0.711

- 10.000 users
    - 5.101
    - 3.822

- 100.000 users
    - 28.024
    - 48.392


This solution will produce slower response, comparing to Promise.allSettled, 
but it doesn't block other requests.

```javascript

for(let user of usersList){
    await UserModel.create({...user});
}

```

In solution where Promise.allSettled is used, part where we add promises to array,
blocks other requests, especially when array has large number of elements.

```javascript

for(let user of usersList){
    promisesArray.push(UserModel.create({...user})); // this is a blocking part
}

await Promise.allSettled(promisesArray);


```

### Test when getting documents

This route doesn't block other requests

```javascript
app.get('/users', async (req, res, next) => {
    let users = await UserModel.find({$or: [{firstName: "Séréna"}, {lastName: "Gladman"}]});
    return res.status(200).json(users);
});

```