import express from 'express';
import { createData, deleteDataById, updateDataById, findData } from './fetch_fortressData.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app=express();
const JWT_SECRET="my-secret"
app.use(express.json());
app.use(cors());
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.stauts === 400 && "body" in err) {
        return res.stauts(400).json({ err: "Invalid JSON input" });
    }
    next(err);
});


const authenticate = async(req, res, next) => {
    const { userName, password } = req.body;
    console.log("username",userName);
    const users = await findData("User");
    console.log(users);
    const user = users.find(u => u.userName === userName);
    if (user && bcrypt.compareSync(password, user.password)) {
        req.user = { "userId": user.userId, "userName": user.userName }

        next();
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }

}

const authorize = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];

        if (!token) {
            console.log("Unauthorized");
            return res.status(401).send('Unauthorized');
        }

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.log('incalid TOken');
                return res.status(403).send('Invalid token');
            }
            console.log(user)
            req.user=user;
            next();
        });
    } catch (error) {
        console.log(error);
    }

};


//login
app.post('/login', authenticate, (req, res) => {
    console.log(req.user);
    const token = jwt.sign({ userId: req.user.userId }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

async function generateHastPassword(pwd){
    return await bcrypt.hash(pwd,10);
}

app.post('/registration',async(req,res)=>{   
    const inputData=req.body;
    console.log(JSON.stringify(inputData));
    inputData.password=await generateHastPassword(inputData.password);
    const currentUsers=await findData("User");
    inputData.userId=currentUsers.length+1;
    console.log(inputData);
    await createData("User",inputData);
    const users=await findData("User");
    res.status(201).json(users);
});


//shop location search
function haversinDistance(coords1, coords2, isMiles = false) {
    const toRad = x => x * Math.PI / 180;
    const lat1 = coords1.latitude;
    const lon1 = coords1.longitude;
    const lat2 = coords2.latitude;
    const lon2 = coords2.longitude;

    const R = 6371; //earth radius(km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.pow(Math.sin(dLon / 2), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    if (isMiles) {
        distance /= 1.60934;
    }
    return distance;
}


//Create data method
app.post("/create",authorize,async (req, res) => {
    const { dataType } = req.query;
    console.log(dataType);
    if (!dataType) {
        return res.status(400).json({ "err": "dataType is required." });
    }
    try {

        let inputData = req.body;
        console.log(inputData);
        await createData(dataType, inputData);
        let dataObj = await findData(dataType);
        res.status(201).json(dataObj);
        console.log("Add  Data success");
    } catch (err) {
        res.status(500).json({ "err": "Error catched: Internal Server Error." });
        console.log("Error catched: Add data fail.")
        console.log(err);
    }
});

//Read data method
app.get("/read", async (req, res) => {
    const { dataType, dataId, keyWord, range, location } = req.query;
    if (!dataType) {
        return res.status(400).json({ "err": "dataType is required." });
    }
    if (location && dataType !== "Shop") {
        return res.status(400).json({ "err": "location is only valid for dataType 'Shop'." });
    }
    if (range && (!keyWord || dataType !== "Product")) {
        return res.status(400).json({ "err": "price range is only valid with keyword and dataType 'Product'." });
    }

    try {
        let dataObj = await findData(dataType);
        if (dataId) {
            if (dataType == "Product") {
                dataObj = dataObj.filter(item => item.productId == dataId);
            }
            if (dataType == "Shop") {
                dataObj = dataObj.filter(item => item.shopId == dataId);
            }
            if (dataType == "QA") {
                dataObj = dataObj.filter(item => item.qaId == dataId);
            }
            console.log("Get Data by ID success");
        } else if (keyWord && dataType == "Product") {

            dataObj = dataObj.filter(item => item.productName.toLowerCase().includes(keyWord.toLowerCase()));
            if (range) {
                const [lowerBound, upperBound] = range.split('-').map(Number);
                dataObj = dataObj.filter(item => item.price >= lowerBound && item.price <= upperBound);
                console.log("Search product's Data with success");
            }

        } else if (keyWord && dataType == "QA") {
            dataObj = dataObj.filter(QA => QA.keyWord.includes(keyWord));
            console.log('search Q&A with keywords success');
        } else if (location && dataType == "Shop") {
            let coords1 = { latitude: location.split(',')[0], longitude: location.split(',')[1] }
            let coords2 = { latitude: 11.261651, longitude: 114.2245132 };
            dataObj = dataObj.filter(shop => {
                coords2 = { latitude: shop.lat, longitude: shop.lng };
                return haversinDistance(coords1, coords2) <= 2;
            });
            console.log('search shop success');

        }
        dataObj.length > 0 ? res.status(200).json(dataObj) : res.end('[]');
    } catch (err) {
        res.status(500).json({ "err": "Error catched: Get data fail." })
        console.log("Error catched: Search data fail,");
        console.log(err);
    }
});

//Update data method
app.put("/update", authorize ,async (req, res) => {
    const { dataType, dataId } = req.query;
    if (!dataType || !dataId) {
        return res.status(400).json({ "err": "dataType & dataId are required." });
    }
    try {
        let inputData = req.body;

        let preDataObj = await findData(dataType);
        if (dataType === "Product") {
            if (!preDataObj.some(data => data.productId == dataId)) {
                throw Error(`Data with ID ${dataId} not found.`);
            }
        } else if (dataType === "Shop") {
            if (!preDataObj.some(data => data.shopId == dataId)) {
                throw Error(`Data with ID ${dataId} not found.`);
            }
        } else if (dataType === "QA") {
            if (!preDataObj.some(data => data.qaId == dataId)) {
                throw Error(`Data with ID ${dataId} not found.`);
            }
        }

        await updateDataById(dataType, dataId, inputData);
        let dataObj = await findData(dataType);
        res.status(200).json(dataObj);
        console.log("Update Data success");

    } catch (err) {
        if (err.message.includes("not found")) {
            return res.status(404).json({ "err": err.message });
        }
        res.status(500).json({ "Error": "Error catched: Edit  data fail." });
        console.log("Error catched: Edit data fail.");
        console.log(err);
    }
});

//Delete data methods
app.delete("/delete",authorize, async (req, res) => {
    const { dataType, dataId } = req.query;
    if (!dataType || !dataId) {
        return res.status(400).json({ "err": "dataType & dataId are required." });
    }
    try {
        let preDataObj = await findData(dataType);
        if (dataType === "Product") {
            if (!preDataObj.some(data => data.productId == dataId)) {
                throw Error(`Data with ID ${dataId} not found.`)
            }
        } else if (dataType === "Shop") {
            if (!preDataObj.some(data => data.shopId == dataId)) {
                throw Error(`Data with ID ${dataId} not found.`)
            }
        } else if (dataType === "QA") {
            if (!preDataObj.some(data => data.qaId == dataId)) {
                throw Error(`Data with ID ${dataId} not found.`)
            }
        }
        await deleteDataById(dataType, dataId)
        let dataObj = await findData(dataType);
        console.log("Delete Data success")
        res.end(JSON.stringify(dataObj));
       
    } catch (err) {
        if (err.message.includes("not found")) {
            return res.status(404).json({ "err": err.message });
        }
        res.status(500).json({ "Error": "Error catched: Delete  data fail." });
        console.log("Error catched: Delete  data fail.");
        console.log(err);
    }
});



let Server = app.listen(8081, () => {
    let host = Server.address().address;
    let port = Server.address().port;
    console.log("RESTful API Server start...");
    console.log(`Please visit the website http://${host}:${port}`);
});
