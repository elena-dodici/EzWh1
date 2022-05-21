# Integration and API Test Report

Date:

Version:

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

     <report the here the dependency graph of the classes in EzWH, using plantuml or other tool>
     
# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence
    (ex: step1: class A, step 2: class A+B, step 3: class A+B+C, etc)> 
    <Some steps may  correspond to unit testing (ex step1 in ex above), presented in other document UnitTestReport.md>
    <One step will  correspond to API testing>

    The sequence we followed to test is bottom up. In fact we firstly tested the PersistentManager methods as unit tests.
    Then we tested the Manager classes using the already tested PersistentManager methods.
    Then we procedeed to test the APIs.
    For the API testing we tested every scenario in the official requirements.
    


#  Integration Tests

   <define below a table for each integration step. For each integration step report the group of classes under test, and the names of
     Jest test cases applied to them, and the mock ups used, if any> Jest test cases should be here code/server/unit_test

## Step 1
| Classes  | mock up used |Jest test cases |
|--|--|--|

|PersistentManager| | testStoreValid |
| || testStoreInvalid |
| || testLoadValid|
| || testLoadInvalid|
| || testDelete |
| || testInvalidUpdate|
| || testValidUpdate|
## Step 2
| Classes  | mock up used |Jest test cases |
|--|--|--|
|SKUManager | | define sku |
| | | define sku |
||define sku invalid|
|| test list all skus valid|
||change sku position valid|
|SKUITemManager|| test define sku item |
|| get item by rfid |
|| delete sku item |
|PositionManager|define position|
||load positions|
||modify position id|
|UserManager|load all users|
||delete user|
||define user|

## Step n 

| Classes  | mock up used |Jest test cases |
|--|--|--|
||||




# API testing - Scenarios


<If needed, define here additional scenarios for the application. Scenarios should be named
 referring the UC in the OfficialRequirements that they detail>

## Scenario UCx.y

| Scenario |  name |
| ------------- |:-------------:| 
|  Precondition     |  |
|  Post condition     |   |
| Step#        | Description  |
|  1     |  ... |  
|  2     |  ... |



# Coverage of Scenarios and FR


<Report in the following table the coverage of  scenarios (from official requirements and from above) vs FR. 
Report also for each of the scenarios the (one or more) API Mocha tests that cover it. >  Mocha test cases should be here code/server/test




| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
| 1-1         | FR2                             |  newSKU     |             
| 1-2         | FR2                             |   modifyPositionOfSku          |             
| 1-3         |  FR2                               |    modifyWeightVolume         |             
| 2-1         |    FR3                             |    newPosition         |             
| 2-2         |    FR3                             |      modifyPositionID       |             
| 2-3         |     FR3                            |        weightVolumeOfPosition     |           
| 2-4         |    FR3                             |      modifyAisleRowCol       |  
| 2-5         |    FR3                             |          delPosition   |    
| 3-1         |     FR5                            |        addingRO1     | 
| 3-2         |   FR5                              |       addingRO2      | 
| 4-1         |   FR1                              |       newUser      | 
| 4-2         |     FR1                            |      modifyUser       | 
| 4-3         |   FR1                              |      deleteUser       | 


# Coverage of Non Functional Requirements


<Report in the following table the coverage of the Non Functional Requirements of the application - only those that can be tested with automated testing frameworks.>


### 

| Non Functional Requirement | Test name |
| -------------------------- | --------- |
|                            |           |

