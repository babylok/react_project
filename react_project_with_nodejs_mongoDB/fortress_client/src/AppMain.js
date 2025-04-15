import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DropMenu from './DropMenu';
import './AppMain.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col, Navbar, Nav, NavDropdown, InputGroup } from 'react-bootstrap';
import axios from "axios";
import DataList from './Datalist';
import AddressSearch from './AddressScearch';
import { useNavigate } from 'react-router-dom';
import { FaAlignRight } from 'react-icons/fa';


const apiKey = 'xVPEpJFKGdgH99K7_mvbWDCoexcWGGoWZLmWYOgnruQ';
const hostAddress = "http://localhost:8081"

function AppMain() {
    const [activeKey, setActiveKey] = useState("Read")
    const [placeholderKeyword, setPlaceholderKeyword] = useState("");
    const [keywordLable, setKeywordLable] = useState("");
    const [recieveData, setRecieveData] = useState("");
    const [isNotMatch, setIsNotMatch] = useState(false);
    const [cateStatus, setCateStatus] = useState("");
    const [dataId, setDataId] = useState("");
    const [lowerPrice, setLowerPrice] = useState("");
    const [upperPrice, setUpperPrice] = useState("");
    const [keyWord, setkeyWord] = useState("");
    const [coorPosition, setCoorPosition] = useState("");
    const navigate = useNavigate();
    const [isLogin,setIslogin]=useState(()=>{
        if(localStorage.getItem('token')){
          return true;
        }else{
          return false;
        }
      });



    function NavOnClick(navKey) {
        setActiveKey(navKey);
    }

    function HandleClassSection(e) {
        if (e.target.value === "Product") {
            setCateStatus("Product");
            setKeywordLable("產品名搜尋")
            setPlaceholderKeyword("產品名/關鍵字");
            setRecieveData("");
        } else if (e.target.value === "Shop") {
            setCateStatus("Shop");
            setKeywordLable("鄰近商店搜尋");
            setPlaceholderKeyword("地址查询");
            setRecieveData("");
        } else if (e.target.value === "QA") {
            setCateStatus("QA");
            setKeywordLable("關鍵字搜尋");
            setPlaceholderKeyword("問題/關鍵字");
            setRecieveData("");
        }
    }

    async function deleteTask(dataType, dataId) {
        const confirmed = window.confirm("您確定要刪除這項資料嗎？");

        if (confirmed) {
            try {
                await axios.delete(`${hostAddress}/delete?dataType=${dataType}&dataId=${dataId}`,{
                    headers:{
                        'Authorization':`Bearer ${localStorage.getItem('token')}`,
                        'Content-Type':'Application/json'
                    }
                });
                
                if (dataType = "Product") {
                    setRecieveData(recieveData.filter(data => data.productId != dataId))
                } else if (dataType = "Shop") {
                    setRecieveData(recieveData.filter(data => data.shopId != dataId))
                } else if (dataType = "qa") {
                    setRecieveData(recieveData.filter(data => data.qaId != dataId))
                }
                console.log("刪除成功");
            } catch (error) {
                if(error.response.status===401){
                    navigate('/login');
                } 
            }
        } else {
            console.log("刪除操作已取消");
        }
    }


    const HandleSubmit = async () => {
        setRecieveData("");
        setIsNotMatch(false);
        if (cateStatus === "Product") {
            if (keyWord) {
                if (lowerPrice && upperPrice) {
                    const getData = await axios.get(`${hostAddress}/read?dataType=Product&keyWord=${keyWord}&range=${lowerPrice}-${upperPrice}`);
                    const data = getData.data;
                    data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
                } else {
                    const getData = await axios.get(`${hostAddress}/read?dataType=Product&keyWord=${keyWord}`);
                    const data = getData.data;
                    data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
                }
            } else if (dataId) {
                const getData = await axios.get(`${hostAddress}/read?dataType=Product&dataId=${dataId}`);
                const data = getData.data;
                data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
            }
            else {
                const getData = await axios.get(`${hostAddress}/read?dataType=Product`);
                const data = getData.data;
                data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
            }
        } else if (cateStatus === "Shop") {
            if (coorPosition) {
                const getData = await axios.get(`${hostAddress}/read?dataType=Shop&location=${coorPosition}`);

                const data = getData.data;
                data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
            } else if (dataId) {
                const getData = await axios.get(`${hostAddress}/read?dataType=Shop&dataId=${dataId}`);
                const data = getData.data;
                data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
            } else {
                const getData = await axios.get(`${hostAddress}/read?dataType=Shop`);
                const data = getData.data;
                data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
            }

        } else if (cateStatus === "QA") {
            if (keyWord) {
                const getData = await axios.get(`${hostAddress}/read?dataType=QA&keyWord=${keyWord}`);
                const data = getData.data;
                data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
            } else if (dataId) {
                const getData = await axios.get(`${hostAddress}/read?dataType=QA&dataId=${dataId}`);
                const data = getData.data;
                data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
            } else {
                const getData = await axios.get(`${hostAddress}/read?dataType=QA`);
                const data = getData.data;
                data.length > 0 ? setRecieveData(data) : setIsNotMatch(true);
            }

        }
    }

    const handleRangeChange = (e) => {
    }
    const HandleLogin=()=>{
        navigate('/login');
    }

    const HandleLogout=()=>{
        localStorage.removeItem('token');
        setIslogin(false);
    }

    return (
        <div className="container mt-5">
            <Row className="mb-3">
                <Col xs={2}>
                </Col>
                <Col>
                <h1 className="text-center mb-4">Fortress</h1>
                </Col>
                <Col xs={2} >
                {isLogin?(<Button onClick={HandleLogout} >Logout</Button>):(<Button onClick={HandleLogin}>Login</Button>)}
                </Col>
            </Row>
            

            <Form>
                <Row className="mb-3">
                    <Col xs={8}>
                        <Form.Group >
                            <Form.Select onChange={(e) => HandleClassSection(e)}>
                                {!cateStatus && (<option value="">選擇類別</option>)}
                                <option value="Product">產品</option>
                                <option value="Shop">商店</option>
                                <option value="QA">常見問題</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    {<Col xs={4}>
                        {cateStatus && (<InputGroup xs={4}>
                            <InputGroup.Text id="inputGroup-sizing-sm">ID: </InputGroup.Text>
                            <Form.Control
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={e => setDataId(e.target.value)}
                            />
                        </InputGroup>)}
                    </Col>}
                </Row>
                {(cateStatus === "Product" || cateStatus === "QA") && (<Row className="mb-3">
                    <Form.Group>
                        <Form.Label>{keywordLable}</Form.Label>
                        <Form.Control type="text" placeholder={placeholderKeyword} onChange={e => setkeyWord(e.target.value)} />
                    </Form.Group>
                </Row>)}
                {cateStatus === "Shop" && (<Row className="mb-3">
                    <AddressSearch setCoorPosition={setCoorPosition} />
                </Row>)}
                {cateStatus === "Product" && (<Row className="mb-3">
                    <Col xs={2}>
                        <Form.Label>價錢由</Form.Label>
                    </Col>
                    <Col xs={4}>
                        <Form.Select onChange={e => setLowerPrice(e.target.value)}>
                            <option value="">選擇金額</option>
                            <option value="0">0</option>
                            <option value="1000">1000</option>
                            <option value="2000">2000</option>
                            <option value="3000">3000</option>
                            <option value="4000">4000</option>
                            <option value="5000">5000</option>
                            <option value="6000">6000</option>
                            <option value="7000">7000</option>
                            <option value="8000">8000</option>
                            <option value="9000">9000</option>
                        </Form.Select>
                    </Col>
                    <Col xs={2}>
                        <Form.Label>至</Form.Label>
                    </Col>
                    <Col xs={4}>
                        <Form.Select onChange={e => setUpperPrice(e.target.value)}>
                            <option value="">選擇金額</option>
                            {lowerPrice < 1000 && (<option value="1000">1000</option>)}
                            {lowerPrice < 2000 && (<option value="2000">2000</option>)}
                            {lowerPrice < 3000 && (<option value="3000">3000</option>)}
                            {lowerPrice < 4000 && (<option value="4000">4000</option>)}
                            {lowerPrice < 5000 && (<option value="5000">5000</option>)}
                            {lowerPrice < 6000 && (<option value="6000">6000</option>)}
                            {lowerPrice < 7000 && (<option value="7000">7000</option>)}
                            {lowerPrice < 8000 && (<option value="8000">8000</option>)}
                            {lowerPrice < 9000 && (<option value="9000">9000</option>)}
                            {lowerPrice < 10000 && (<option value="10000">10000</option>)}
                        </Form.Select>
                    </Col>
                </Row>)}
                <Row className="-mb3">
                    <Col>
                        <Button variant="primary" type="submit" >重設</Button>
                    </Col>
                    <Col>
                        <Button variant="success" onClick={HandleSubmit}>搜尋</Button>
                    </Col>
                </Row>
            </Form>
            {isNotMatch && (<div className="alert alert-info" role="alert">
                <p>搜尋結果</p>
                <p>沒有相關資料</p>
            </div>)}
            {recieveData && recieveData.length > 0 && (

                <DataList status={cateStatus} data={recieveData} onDelete={deleteTask} />
            )}
        </div>
    )
}

export default AppMain;