# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

 ### **Class *PersistentManager* - method *store(tableName, object)***

PersistentManager.store(tableName, object) saves the object passed as parameters
in the table specified by tableName. the value of the keys of the object must be equal 
to the name of the columns.
The output, if everything goes well, is the last inserted ID.

**Criteria for method *store*:**
	

 - value of tableName
 - number of fields in object
 - value of keys of object






**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|tableName | present in DB |       
|          | not present in DB         |
| number of fields in object         |   equal to the # of columns - 1 (id is not present)       |
|          |   not equal to the # of columns - 1        |
| value of keys of object | same as the database columns |
| | at least one value is different from the database columns|




**Boundaries**:

In this case there is no boundary case.

| Criteria | Boundary values |
| -------- | --------------- |
|          |                 |
|          |                 |



**Combination of predicates**:


| value of tableName | number of fields in object     | value of keys of object                                   | Valid / Invalid | Description of the test case                              | Jest test case                                         |
|--------------------|--------------------------------|-----------------------------------------------------------|-----------------|-----------------------------------------------------------|--------------------------------------------------------|
| present in DB      | same as the database columns   | same as the database columns                              | V               | PersistentManager.store(tableName, object) -> lastID      | testStoreValid("User", user);                          |
|                    |                                | at least one value is different from the database columns | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("User", wrongKeys);                   |
|                    | not equal to the # of columns  | same as the database columns                              | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("User", wrongNumberOfFields);         |
|                    |                                | at least one value is different from the database columns | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("User", wrongKeysWrongNumber);        |
| not present in DB  | same as the database columns   | same as the database columns                              | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("wrong table", user);                 |
|                    |                                | at least one value is different from the database columns | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("wrong table", wrongKeys);            |
|                    | not equal to the # of columns  | same as the database columns                              | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("wrong table", wrongNumberOfFields);  |
|                    |                                | at least one value is different from the database columns | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("wrong table", wrongKeysWrongNumber); |


 ### **Class *PersistentManager* - method *loadAllRows(tableName)***
Loads a list containing all the objects saved in the database


**Criteria for method *store*:**
	

 - value of tableName
 - number of objects present in the table


**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|value of tableName | present in DB |       
|          | not present in DB         |
|   number of objects present in the table     |   > 0     |


**Boundaries**:


| Criteria | Boundary values |
| -------- | --------------- |
|   number of objects present in the table     |   0     |





| value of tableName | number of objects present in the table | Valid / Invalid | Description of the test case                             | Jest test case               |
|--------------------|----------------------------------------|-----------------|----------------------------------------------------------|------------------------------|
| present in DB      | >0                                     | V               | PersistentManager.loadAllRows(tableName) -> List&lt;Object> | testLoadValid("User", 1);    |
|                    | 0                                      | V               | PersistentManager.loadAllRows(tableName) -> Empty list   | testLoadValid("User", 0);    |
| not present in DB  | >0                                     | I               | PersistentManager.loadAllRows(tableName) -> Throw error  | testLoadInvalid("wrong", 1); |
|                    | 0                                      | I               | PersistentManager.loadAllRows(tableName) -> Throw error  | testLoadValid("wrong", 0);   |




# White Box Unit Tests

### Test cases definition
    
    
    <Report here all the created Jest test cases, and the units/classes under test >
    <For traceability write the class and method name that contains the test case>


| Unit name | Jest test case |
|--|--|
|||
|||
||||

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >


### Loop coverage analysis

    <Identify significant loops in the units and reports the test cases
    developed to cover zero, one or multiple iterations >

|Unit name | Loop rows | Number of iterations | Jest test case |
|---|---|---|---|
|||||
|||||
||||||



