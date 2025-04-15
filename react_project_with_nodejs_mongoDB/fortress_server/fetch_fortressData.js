
import axios from "axios";
import { promises as fs } from "fs";
import mongoose from "mongoose";

const ShopDataPath = "./shopinfoJson.json";
const ProductDataPath = "./productinfoJson.json"
const QADataPath = "./QAjson.json"


async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/fortress');
       
        console.log('Conected to MongoDB');
    } catch (error) {
        console.error("Error connection to MongoDB:", error)
    }
}


async function disconnectDB() {
    try {
        await mongoose.disconnect();
        console.log("Disconned from MongoDB");
    } catch (err) {
        console.error("error disconnecting from MongoDB:", err);
    }
}


const productSchema = new mongoose.Schema({
    productId: { type: Number, require: true },
    cate: { type: String, require: true },
    brand: { type: String, require: true },
    price: { type: Number, require: true },
    productName: { type: String, require: true },
    OperationSystem: String,
    Color: String,
    Volume: String,
    Size: String,
    weight: String,
});
const Product = mongoose.model('Product', productSchema);

const shopSchema = new mongoose.Schema({
    shopId: { type: Number, require: true },
    region: { type: String, require: true },
    shopname: { type: String, require: true },
    address: { type: String, require: true },
    price: { type: Number, require: true },
    openingHour: { type: String, require: true },
    lat: { type: String, require: true },
    lng: { type: String, require: true },
});
const Shop = mongoose.model('Shop', shopSchema);

const qaSchema = new mongoose.Schema({
    qaId: { type: Number, require: true },
    Quentions: { type: String, require: true },
    keyWord: { type: String, require: true },
    Answers: { type: String, require: true },

});
const QA = mongoose.model('QA', qaSchema);

const userSchema = new mongoose.Schema({
    userId: { type: Number, require: true },
    fullName:{ type: String, require: true },
    userName: { type: String, require: true },
    password: { type: String, require: true },
    phoneNum: { type: String, require: true },
    email:{ type: String, require: true },

});
const User = mongoose.model('User', userSchema);

//createData
async function createData(dataType, data) {
  
    if (dataType === 'Product') {
        await Product.create(data);
    } else if (dataType === 'Shop') {
        await Shop.create(data);
    } else if ((dataType === 'QA')) {
        await QA.create(data);
    }else if ((dataType === 'User')) {
        await User.create(data);
    }
   
}

//findAllData
async function findData(dataType) {
    
    let data = [];
    if (dataType === 'Product') {
        data = await Product.find().sort({productId:1}).catch(error => console.error("Erro find data:", error));

    } else if (dataType === 'Shop') {
        data = await Shop.find().sort({shopId:1}).catch(error => console.error("Erro find data:", error));

    } else if ((dataType === 'QA')) {
        data = await QA.find().sort({qaId:1}).catch(error => console.error("Erro find data:", error));

    }else if ((dataType === 'User')) {
        data = await User.find().sort({userId:1}).catch(error => console.error("Erro find data:", error));

    }
    
    return data;

}

//update Data
async function updateDataById(dataType, id, data) {
    
    if (dataType === 'Product') {
        await Product.findOneAndUpdate({productId:id}, data).catch(error => console.error("Erro deleting data:", error));
    } else if (dataType === 'Shop') {
        await Shop.findOneAndUpdate({shopId:id}, data).catch(error => console.error("Erro deleting data:", error));
    } else if ((dataType === 'QA')) {
        await QA.findOneAndUpdate({qaId:id}, data).catch(error => console.error("Erro deleting data:", error));
    }else if ((dataType === 'User')) {
        await User.findOneAndUpdate({userId:id}, data).catch(error => console.error("Erro deleting data:", error));
    }
    
}

//delete Data
async function deleteDataById(dataType, id) {
    
    if (dataType === 'Product') {
        await Product.findOneAndDelete({productId:id},).catch(error => console.error("Erro deleting data:", error));
    } else if (dataType === 'Shop') {
        await Shop.findOneAndDelete({shopId:id},).catch(error => console.error("Erro deleting data:", error));
    } else if ((dataType === 'QA')) {
        await QA.findOneAndDelete({qaId:id},).catch(error => console.error("Erro deleting data:", error));
    }else if ((dataType === 'User')) {
        await User.findOneAndDelete({userId:id},).catch(error => console.error("Erro deleting data:", error));
    }
    
}

async function deleteDataFromId(dataType, id) {
    
    if (dataType === 'Product') {
        await Product.findByIdAndDelete(id).catch(error => console.error("Erro deleting data:", error));
    } else if (dataType === 'Shop') {
        await Shop.findByIdAndDelete(id).catch(error => console.error("Erro deleting data:", error));
    } else if ((dataType === 'QA')) {
        await QA.findByIdAndDelete(id).catch(error => console.error("Erro deleting data:", error));
    }
    
}


async function getJson(url) {
    return await axios.get(url);
}

async function readJsonFile(dataPath) {
    let getData = await fs.readFile(dataPath, "utf8");

    return getData;
}



async function writeJsonToMongoDB(dataPath, dataType) {
    try {
        
        let getData = await fs.readFile(dataPath, "utf8");
        let allData = JSON.parse(getData);

        const promises = allData.map(data => createData(dataType, data));

        await Promise.all(promises);

        console.log("All Data write to MongoDB");

    } catch (error) {
        console.error("Error Catch:", error);
    } 
}

async function run() {
    await connectDB();
    // await Product.deleteMany({});
    //  await Shop.deleteMany({});
    // await QA.deleteMany({});
    // await writeJsonToMongoDB(ProductDataPath, "Product");
    // await writeJsonToMongoDB(ShopDataPath, "Shop");
    // await writeJsonToMongoDB(QADataPath, "QA");
    // let product = await findData("Product");
    // let shop = await findData("Shop");
    // let qa = await findData("QA");
    // console.log(product.length);
    // console.log(shop.length);
    //  console.log(qa.length);
//    await User.deleteMany({});
}
run();


async function writeJsonFile(datapath, data) {
    return await fs.writeFile(datapath, data);
}

//await QA.deleteMany({});

export { connectDB, disconnectDB, createData, deleteDataById, updateDataById, findData, readJsonFile, writeJsonFile, getJson };

