const PersistentManager = require('../bin/DB/PersistentManager');

//STORE OBJECTS
const user = {
    username: "test@test.it",
    password: "password",
    name: "John",
    surname: "Smith", 
    type: "manager"
}

const wrongKeys = {
    username: "test@test.it",
    password: "password",
    name: "John",
    surname: "Smith", 
    error: "manager"
}

const wrongNumberOfFields = {
    username: "test@test.it",
    password: "password",
    name: "John",
    surname: "Smith", 
    type: "manager",
    additional: "add"
}

const wrongKeysWrongNumber = {
    username: "test@test.it",
    password: "password",
    name: "John",
    error: "Smith"
}

let insertedId;

async function testStoreValid(tableName, object) {
    describe('store user', () => {

        test('test store valid', async () => {
            await PersistentManager.startTransaction();
            const lastID = await PersistentManager.store(tableName, object);
            await PersistentManager.commitTransaction();
            expect(lastID).toEqual(expect.any(Number));
            insertedId = lastID
        })
    
        afterEach(() => {
            PersistentManager.delete('id', insertedId, "User");
        })
    })
    
}

async function testStoreInvalid(tableName, object) {
    test('test store invalid', async () => {
        await PersistentManager.startTransaction();
        return expect(PersistentManager.store(tableName, object)).rejects.toThrow();
    })
}

//Correct table, correct number of fields, correct keys
testStoreValid("User", user);
//Correct table, correct # of fields, wrong keys
testStoreInvalid("User", wrongKeys);
//Correct table, wrong number of fields, correct keys
testStoreInvalid("User", wrongNumberOfFields);
//Correct table, wrong number of fields, wrong keys
testStoreInvalid("User", wrongKeysWrongNumber);
//Incorrect table, correct object
testStoreInvalid("wrong table", user);
//Incorrect table, correct # of fields, wrong keys
testStoreInvalid("wrong table", wrongKeys);
//Incorrect table, wrong number of fields, correct keys
testStoreInvalid("wrong table", wrongNumberOfFields);
//Incorrect table, wrong number of fields, wrong keys
testStoreInvalid("wrong table", wrongKeysWrongNumber);
