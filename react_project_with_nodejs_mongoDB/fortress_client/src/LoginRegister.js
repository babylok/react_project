import React, { useState } from 'react';
import { Container, Form, Button, Nav,Row,Col} from 'react-bootstrap';
import './LoginRegister.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const hostAddress = "http://localhost:8081"
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    userName: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phoneNum: '',
    password: '',
    confirmPassword: '',
  });
 

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    //e.preventDefault();

    try {
      const response = await axios.post(`${hostAddress}/login`, loginData);

      localStorage.setItem('token', response.data.token);
     // alert(localStorage.getItem('token'));
     navigate('/');
    } catch (error) {
      alert('Login failed.Invalid username or password');
    }

  };

  const handleRegisterSubmit = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.post(`${hostAddress}/registration`, registerData);
      setIsLogin(!isLogin)
    } catch (error) {
      alert('Register failed.');
    }
  };

  const goHome=()=>{
    navigate('/');
  }

  return (
    <Container className="auth-container">
      <Row>
        <Col>
        </Col>
        <Col xs={1}>
          <p className='closeButton' onClick={goHome}>✖</p>
        </Col>
      </Row>
     
      <h2>{isLogin ? 'LOGIN' : 'SIGN UP'}</h2>
      {isLogin ? (
        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your userName..."
              name="userName"
              value={loginData.userName}
              onChange={handleLoginChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password..."
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formRememberMe">
            <Form.Check
              type="checkbox"
              label="Remember me"
              name="rememberMe"
              checked={loginData.rememberMe}
              onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
            />
          </Form.Group>
          <div className="social-login">

          </div>
          <Button variant="primary" className="btn-login" onClick={handleLoginSubmit}>
            LOGIN
          </Button>
          
          {/*(<div className="social-login">
            <p>Or login with</p>
            <Button variant="outline-primary" className="social-button">Facebook</Button>
            <Button variant="outline-danger" className="social-button">Google</Button>
          </div>)*/}
        </Form>
      ) : (
        <Form onSubmit={handleRegisterSubmit}>
          
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your full name..."
              name="fullName"
              value={registerData.fullName}
              onChange={handleRegisterChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a username..."
              name="userName"
              value={registerData.userName}
              onChange={handleRegisterChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formUsername">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter you phone number..."
              name="phoneNum"
              value={registerData.phoneNum}
              onChange={handleRegisterChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email address..."
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password..."
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password again..."
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="btn-signup">
            Sign up
          </Button>
        </Form>
      )}
      <Nav.Link onClick={() => setIsLogin(!isLogin)} className="text-center">
        {isLogin ? 'Not a member? Sign up now' : 'Already have an account? Login'}
      </Nav.Link>
    </Container>
  );
};

export default LoginRegister;