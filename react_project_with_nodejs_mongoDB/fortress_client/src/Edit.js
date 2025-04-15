import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AppMain.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col, Navbar, Nav, NavDropdown, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import AddressSearch from './AddressScearch';

const EditPage = () => {
    const { dataType, dataId, typeMode } = useParams();
    const [dataTille, setDataTitle] = useState("");
    const [recieveData, setRecieveData] = useState("")
    const dataGet = useRef();
    const [newDataId, setNewDataId] = useState("");
    const [cate, setCate] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState(99999);
    const [productName, setProductNameData] = useState("");
    const [OperationSystem, setOperationSystem] = useState("");
    const [Color, setColor] = useState("");
    const [Volume, setVolume] = useState("");
    const [Size, setSize] = useState("");
    const [weight, setweight] = useState("");
    const [region, setRegion] = useState("");
    const [shopname, setShopname] = useState("");
    const [address, setAddress] = useState("");
    const [openingHour, setOpeningHour] = useState("");
    const [shopLat, setShopLat] = useState("");
    const [shopLng, setShopLng] = useState("");
    const [Quentions, setQuentions] = useState("");
    const [keyWord, setKeyWord] = useState("");
    const [Answers, setAnswers] = useState("");
    const [isLogin,setIslogin]=useState(()=>{
            if(localStorage.getItem('token')){
              return true;
            }else{
              return false;
            }
          });
          
    const hostAddress = "http://localhost:8081";
    const navigate = useNavigate();


    useEffect(() => {
        if (typeMode === "Details") {
            readData(dataType, dataId);
        } else if (typeMode === "Create") {
            setPrice(0);
            readData(dataType)
        } else if (typeMode === "Edit") {
            readData(dataType, dataId);
        }
        if(!isLogin&&typeMode!='Details'){
            navigate('/login');
        }
    }, [typeMode]);

    async function readData(dataType, dataId = "") {

        if (dataType === "Product") {
            if (typeMode === "Details") {
                setDataTitle("產品資料");
            } else if (typeMode === "Create") {
                setDataTitle("新增產品");
            } else if (typeMode === "Edit") {
                setDataTitle("編輯產品");
            }

        } else if (dataType === "Shop") {
            setDataTitle("商店");
        } else if (dataType === "QA") {
            setDataTitle("常見問題");
        }
        if (typeMode === "Edit" || typeMode === "Details") {
            const getData = await axios.get(`${hostAddress}/read?dataType=${dataType}&dataId=${dataId}`);
            setRecieveData(getData.data[0]);
            initData(dataType, getData.data[0]);
        }





    }

    const initData = (dataType, data = recieveData) => {
        if (dataType === "Product") {
            setCate(data.cate);
            setBrand(data.brand);
            setProductNameData(data.productName);
            setPrice(data.price);
            setOperationSystem(data.OperationSystem);
            setColor(data.Color);
            setVolume(data.Volume);
            setweight(data.weight);
            setSize(data.Size);
        } else if (dataType === "Shop") {
            setRegion(data.region);
            setShopname(data.shopname);
            setAddress(data.address);
            setOpeningHour(data.openingHour);
        } else if (dataType === "QA") {
            setQuentions(data.Quentions);
            setAnswers(data.Answers);
            setKeyWord(data.keyWord);
        }
    }


    const HandleReset = () => {
        initData(dataType)
    }

    const HandleSubmit = async () => {
        const confirmed = window.confirm("確定儲存嗎？");
        let isError=false;
        if (typeMode === "Create") {
            if (confirmed) {
               
                if (!newDataId) {
                    alert("ID required.");
                } else {
                    const exsitData = await axios.get(`${hostAddress}/read?dataType=${dataType}&dataId=${newDataId}`)
                    if (exsitData.data.length > 0) {
                        alert("Exiting ID.Please input a new one.");
                    } else {
                        if (dataType === "Product") {
                            const newData = {
                                "productId": newDataId,
                                "cate": cate,
                                "brand": brand,
                                "price": price,
                                "productName": productName,
                                "OperationSystem": OperationSystem,
                                "Color": Color,
                                "Volume": Volume,
                                "Size": weight,
                                "weight": Size
                            }
                            try{
                                await axios.post(`${hostAddress}/create?dataType=${dataType}`, newData,{
                                    headers:{
                                        'Authorization':`Bearer ${localStorage.getItem('token')}`,
                                        'Content-Type':'Application/json'
                                    }
                                });
                            }catch(error){
                                if(error.response.status===401){
                                    isError=true;
                                    navigate('/login');
                                } 
                            }
                            
                        } else if (dataType === "Shop") {
                            const newData = {
                                "shopId": newDataId,
                                "region": region,
                                "shopname": shopname,
                                "address": address,
                                "openingHour": openingHour,
                                "lat": shopLat,
                                "lng": shopLng
                            }
                            try{
                                await axios.post(`${hostAddress}/create?dataType=${dataType}`, newData,{
                                    headers:{
                                        'Authorization':`Bearer ${localStorage.getItem('token')}`,
                                        'Content-Type':'Application/json'
                                    }
                                });
                            }catch(error){
                                if(error.response.status===401){
                                    isError=true;
                                    navigate('/login');
                                } 
                            }
                            
                        } else if (dataType === "QA") {
                            const newData = {
                                "qaId": newDataId,
                                "Quentions": Quentions,
                                "keyWord": keyWord,
                                "Answers": Answers
                            }
                            try{
                                await axios.post(`${hostAddress}/create?dataType=${dataType}`, newData,{
                                    headers:{
                                        'Authorization':`Bearer ${localStorage.getItem('token')}`,
                                        'Content-Type':'Application/json'
                                    }
                                });
                            }catch(error){
                                if(error.response.status===401){
                                    isError=true;
                                    navigate('/login');
                                } 
                            }
                            
                        }
                        if(!isError) navigate(`/`)
                    }
                }
            }
        } else if (typeMode === "Edit") {
            if (confirmed) {
                if (dataType === "Product") {
                    const newData = {
                        "productId": dataId,
                        "cate": cate,
                        "brand": brand,
                        "price": price,
                        "productName": productName,
                        "OperationSystem": OperationSystem,
                        "Color": Color,
                        "Volume": Volume,
                        "Size": weight,
                        "weight": Size
                    }
                    try{
                        await axios.put(`${hostAddress}/update?dataType=${dataType}&dataId=${dataId}`, newData, {
                            headers:{
                                'Authorization':`Bearer ${localStorage.getItem('token')}`,
                                'Content-Type':'Application/json'
                            }
                        });
                    }catch(error){
                        isError=true;
                        if(error.response.status===401){
                            navigate('/login');
                        } 
                    }
                    
                } else if (dataType === "Shop") {
                    const newData = {
                        "shopId": dataId,
                        "region": region,
                        "shopname": shopname,
                        "address": address,
                        "openingHour": openingHour,
                        "lat": shopLat,
                        "lng": shopLng
                    }
                    try{
                        await axios.put(`${hostAddress}/update?dataType=${dataType}&dataId=${dataId}`, newData,{
                            headers:{
                                'Authorization':`Bearer ${localStorage.getItem('token')}`,
                                'Content-Type':'Application/json'
                            }
                        });
                    }catch(error){
                        isError=true;
                        if(error.response.status===401){
                            navigate('/login');
                        } 
                    }
                    
                } else if (dataType === "QA") {
                    const newData = {
                        "qaId": dataId,
                        "Quentions": Quentions,
                        "keyWord": keyWord,
                        "Answers": Answers
                    }
                    try{
                        await axios.put(`${hostAddress}/update?dataType=${dataType}&dataId=${dataId}`, newData,{
                            headers:{
                                'Authorization':`Bearer ${localStorage.getItem('token')}`,
                                'Content-Type':'Application/json'
                            }
                        });
                    }catch(error){
                        isError=true;
                        if(error.response.status===401){
                            navigate('/login');
                        } 
                    }
                    
                }

                if(!isError) navigate(`/`)

            }
        }
    }

    const HandleCancle = () => {
        if (typeMode !== "Details") {
            const confirmed = window.confirm("資料未儲存,確定退出嗎？");
            if (confirmed) {
                navigate(`/`)
            }
        }else{
            navigate('/');
        }


    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">{dataTille}</h1>

            <Form>
                {typeMode === "Edit" && (<Row className="mb-3">

                    {<Col xs={4}>
                        <label>{dataTille}ID:{dataId} </label>
                    </Col>}
                </Row>)}
                <Row>
                    {typeMode === "Create" && (
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">{dataTille}ID: </InputGroup.Text>
                            <Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setNewDataId(e.target.value)}
                                value={newDataId}
                            />
                        </InputGroup>
                    )}
                </Row>

                {dataType === "Product" && (
                    <Row className="mb-3">

                        <InputGroup xs={4}>
                            <InputGroup xs={4}>
                                <InputGroup.Text id="inputGroup-sizing-sm">產品名: </InputGroup.Text>
                                {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                    aria-label="Small"
                                    aria-describedby="inputGroup-sizing-sm"
                                    onChange={e => setProductNameData(e.target.value)}
                                    value={productName}
                                />)}
                                {typeMode === "Details" && (<Form.Control
                                    aria-label="Small"
                                    aria-describedby="inputGroup-sizing-sm"
                                    readOnly
                                    value={brand}
                                />)}
                            </InputGroup>
                            <InputGroup xs={4}>
                                <InputGroup.Text id="inputGroup-sizing-sm">價錢: </InputGroup.Text>
                                {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                    aria-label="Small"
                                    aria-describedby="inputGroup-sizing-sm"
                                    onChange={e => setPrice(e.target.value)}
                                    value={price}
                                />)}
                                {typeMode === "Details" && (<Form.Control
                                    aria-label="Small"
                                    aria-describedby="inputGroup-sizing-sm"
                                    readOnly
                                    value={price}
                                />)}
                            </InputGroup>
                            <InputGroup.Text id="inputGroup-sizing-sm">產品類別: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setCate(e.target.value)}
                                value={cate}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={cate}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">品牌: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setBrand(e.target.value)}
                                value={brand}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={brand}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">系統: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setOperationSystem(e.target.value)}
                                value={OperationSystem}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={OperationSystem}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">顏色: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setColor(e.target.value)}
                                value={Color}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={Color}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">體積: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setVolume(e.target.value)}
                                value={Volume}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={Volume}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">重量: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setweight(e.target.value)}
                                value={weight}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={weight}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">呎吋: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setSize(e.target.value)}
                                value={Size}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={Size}
                            />)}
                        </InputGroup>

                    </Row>
                )}

                {dataType === "Shop" && (
                    <Row className="mb-3">

                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">分店: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setShopname(e.target.value)}
                                value={shopname}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={shopname}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">營業時間: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setOpeningHour(e.target.value)}
                                value={openingHour}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={openingHour}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">地區: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setRegion(e.target.value)}
                                value={region}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={region}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">地址: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setAddress(e.target.value)}
                                value={address}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={address}
                            />)}
                        </InputGroup>
                    </Row>

                )}


                {dataType === "QA" && (
                    <Row className="mb-3">

                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">問題: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setQuentions(e.target.value)}
                                value={Quentions}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={Quentions}
                            />)}
                        </InputGroup>
                        <InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">答案: </InputGroup.Text>
                            {(typeMode === "Edit" || typeMode === "Create") && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setAnswers(e.target.value)}
                                value={Answers}
                            />)}
                            {typeMode === "Details" && (<Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                readOnly
                                value={Answers}
                            />)}
                        </InputGroup>
                        {(typeMode === "Edit" || typeMode === "Create") && (<InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">關鍵字: </InputGroup.Text>
                            <Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setKeyWord(e.target.value)}
                                value={keyWord}
                            />
                        </InputGroup>
                        )}
                    </Row>

                )}


                <Row className="-mb3">
                    {(typeMode === "Edit" || typeMode === "Create") && (<Col>
                        <Button variant="primary" onClick={HandleReset} >重設</Button>
                    </Col>)}
                    {(typeMode === "Edit" || typeMode === "Create") && (<Col>
                        <Button variant="success" onClick={HandleSubmit}>保存並返回</Button>
                    </Col>)}
                    <Col>
                        <Button variant="warning" onClick={HandleCancle}>取消</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default EditPage;