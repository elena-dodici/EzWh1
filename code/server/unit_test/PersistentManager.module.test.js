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
            const lastID = await PersistentManager.store(tableName, object);
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

//LOAD ALL ROWS

async function testLoadValid(tableName, numberOfCalls) {

    describe('load all rows of a table', () => {

        beforeAll( async () => {
            await PersistentManager.deleteAll(tableName);
            
            for (let i = 0; i < numberOfCalls; i++) {
                await PersistentManager.store(tableName, user);
            }
        })

        test('test load all valid', async () => {
            const tuples = await PersistentManager.loadAllRows(tableName);
            return expect(tuples.length).toEqual(numberOfCalls);
        })

        afterAll( async () => {
            await PersistentManager.deleteAll(tableName);
        })
    });

}

async function testLoadInvalid(tableName, numberOfCalls) {

    describe('load all rows of a table invalid', () => {

        test('test load all invalid', async () => {
            return expect(PersistentManager.loadAllRows(tableName)).rejects.toThrow();
        })

    });

}


//load all rows 1 (> 0)
testLoadValid("User", 1);
//load all rows 0 (boundary case)
testLoadValid("User", 0);
//load all rows invalid table not in db > 0
testLoadInvalid("wrong", 1)
//load all rows invalid table not in db 0
testLoadInvalid("wrong", 0)
