const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const itemCollectionName = "item";
const databaseName = "googletrends";

async function createDatabase(){
  try {
    db = await MongoClient.connect(`${url}/${databaseName}`, { useNewUrlParser: true, useUnifiedTopology: true });
    db.close();
    console.log("Database created!");  
  } catch (error) {
    throw error;
  }
  
}
async function getDbo(){
  try {
    db = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    var dbo = db.db(databaseName);
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

async function insertOneItem(item){
  let dbo = await getDbo();
  try {
    dbo.collection(itemCollectionName).insertOne(item);
    console.log("1 document inserted");
  } catch (error) {
    throw error;
  }finally{
    dbo.db.close();
  }
}

module.exports.findAllItems = findAllItems;
async function findAllItems(){
  var dbo = await getDbo(); 
  try {
    let items = dbo.collection(itemCollectionName).find({}).toArray();
    return items;
  } catch (error) {
    throw error;
  }
}


module.exports.insertOrUpdate = insertOrUpdate;
async function insertOrUpdate(item){
  let dbo = await getDbo();
  try {
    dbo.collection(itemCollectionName).replaceOne({title: item.title}, item, {upsert: true});
  } catch (error) {
    throw error;
  }finally{
    dbo.db.close();
  }
}

async function initDatabase(){
  await createDatabase();
  await createCollection(itemCollectionName);
  //await insertOneItem({ name: "Company Inc", address: "Highway 37" });
  let items = await findAllItems();
  console.log("==================>COUNT", items.length);
}

initDatabase();