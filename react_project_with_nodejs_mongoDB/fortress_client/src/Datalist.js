import React, { useState ,useEffect} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { Button ,Row,Col} from 'react-bootstrap';
import { FaTrash, FaEdit, FaSearch, FaFolderPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function DataList(Props) {
  const [showIcon, setShowIcon] = useState(false);
  const [showIconId, setShowIconId] = useState(null);
  const hostAddress = "http://localhost:8081"
  const navigate = useNavigate();
  const [isLogin,setIslogin]=useState(()=>{
    if(localStorage.getItem('token')){
      return true;
    }else{
      return false;
    }
  });
 
 
    

  async function onCreate(dataType) {
    navigate(`/Create/${dataType}/0`);
  }

  async function onEdit(dataType, dataId) {
    navigate(`/Edit/${dataType}/${dataId}`);
  }

  async function onDetails(dataType, dataId) {
    navigate(`/Details/${dataType}/${dataId}`);

  }

  const HandleItemClick = (id) => {
    setShowIconId(prevId => (prevId === id ? null : id));
  }

  return (
    <ListGroup>
      {Props.data && (<div className="alert alert-info" role="alert">
        <Row className="mb-3">
          <Col xs={10}>
            <p>搜尋結果</p>
            <p>共有 {Props.data.length} 項相關資料</p>
          </Col>
         {isLogin&&( <Col xs={2}>
            <Button variant="success" onClick={()=>onCreate(Props.status)}>
              <FaFolderPlus />
            </Button>
          </Col>)}
        </Row>


      </div>)}
      {Props.data.map(item => {
        if (Props.status === "Product") {
          return (
            <ListGroup.Item onClick={() => HandleItemClick(item.productId)}>
              <h5>產品名稱: {item.productName}</h5>
              <p>價錢: HK${item.price}</p>
              {showIconId === item.productId && (
                <>
                  <Button variant="info" onClick={() => onDetails("Product", item.productId)}>
                    <FaSearch />
                  </Button>
                  </>)}
                 {showIconId === item.productId &&isLogin&&(<>
                  <Button variant="warning" onClick={() => onEdit("Product", item.productId)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" onClick={() => Props.onDelete("Product", item.productId)}>
                    <FaTrash />
                  </Button>
                </>
              )}
            </ListGroup.Item>
          );
        } else if (Props.status === "Shop") {
          return (
            <ListGroup.Item onClick={() => HandleItemClick(item.shopId)}>
              <h5>分店: {item.shopname}</h5>
              <p>地址: {item.address}</p>
              <p>營業時間: {item.openingHour}</p>
              {showIconId === item.shopId && (
                <>
                  <Button variant="info" onClick={() => onDetails("Shop", item.shopId)}>
                    <FaSearch />
                  </Button>
                  </>)}
                  {showIconId === item.productId &&isLogin&&(<>
                  <Button variant="warning" onClick={() => onEdit("Shop", item.shopId)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" onClick={() => Props.onDelete("Shop", item.shopId)}>
                    <FaTrash />
                  </Button>
                </>
              )}
            </ListGroup.Item>
          );
        } else if (Props.status === "QA") {
          return (
            <ListGroup.Item onClick={() => HandleItemClick(item.qaId)}>
              <h5>Q: {item.Quentions}</h5>
              <p>A: {item.Answers}</p>
              {showIconId === item.qaId && (
                <>
                  <Button variant="info" onClick={() => onDetails("QA", item.qaId)}>
                    <FaSearch />
                  </Button>
                  </>)}
                  {showIconId === item.productId &&isLogin&&(<>
                  <Button variant="warning" onClick={() => onEdit("QA", item.qaId)}>
                    <FaEdit />
                  </Button>
                  <Button variant="danger" onClick={() => Props.onDelete("QA", item.qaId)}>
                    <FaTrash />
                  </Button>
                </>
              )}
            </ListGroup.Item>
          );
        }
        return null;
      })}
    </ListGroup>
  );

  DataList.defaultProps = {
    status: "Product"
  }
}

export default DataList;