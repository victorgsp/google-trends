const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

async function createDatabase(){
  db = await MongoClient.connect(`${url}/mydb`, { useNewUrlParser: true, useUnifiedTopology: true });
  db.close();
  console.log("Database created!");
}
async function getDbo(){
  try {
    db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    var dbo = db.db("mydb");
    dbo.db = db;
    return dbo;
  } catch (error) {
    throw error;
  }
};

async function createCollection(collectionName){
  let dbo = await getDbo();  
  try {
    await dbo.createCollection(collectionName);  
    console.log("Collection created!");
  } catch (error) {
    throw error;    
  }finally{
    dbo.db.close();
  }
}

async function insertOneCustomers(customer){
  let dbo = await getDbo();
  try {
    dbo.collection("customers").insertOne(customer);
    console.log("1 document inserted");
  } catch (error) {
    throw error;
  }finally{
    dbo.db.close();
  }
}

async function findCustomers(){
  var dbo = await getDbo(); 
  try {
    let customers = dbo.collection("customers").findOne({});
    return customers;
  } catch (error) {
    throw error;
  }
}

async function initDatabase(){
  await createDatabase();
  await createCollection("customers");
  await insertOneCustomers({ name: "Company Inc", address: "Highway 37" });
  let customers = await findCustomers();
  console.log("==================>customers", customers);
}

initDatabase();