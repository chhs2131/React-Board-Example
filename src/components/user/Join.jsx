import React, {useState} from 'react';
import {Card, Col, InputGroup, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {app} from '../../firebaseInit'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'
import {useNavigate} from "react-router-dom";

const Join = () => {
    const navi = useNavigate();
    const auth = getAuth(app);
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        email: '',
        pass: ''
    })
    const {email, pass} = form;
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (email === "" || pass === "") {
            alert("이메일과 비밀번호를 입력해주세요.");
        } else {
            setLoading(true);
            createUserWithEmailAndPassword(auth, email,pass)
                .then(success => {
                    setLoading(false);
                    sessionStorage.setItem("email", email);
                    sessionStorage.setItem("uid", success.user.uid);

                    if (sessionStorage.getItem('target')) {
                        const target = sessionStorage.getItem('target');
                        sessionStorage.removeItem('target');
                        navi(target);
                    }
                    navi('/');
                })
                .catch(error => {
                    alert("에러: " + error.message);
                })

            setLoading(false);
        }
    }

    if (loading) return <h1 className='my-5'>로딩중입니다...</h1>
    return (
        <Row className='my-5 justify-content-center'>
            <Col md={6} lg={4}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>회원가입</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{width: 100}} className='justify-content-center'>
                                    이메일
                                </InputGroup.Text>
                                <Form.Control name="email" value={email} onChange={onChange} placeholder="ooo@naver.com"/>
                            </InputGroup>

                            <InputGroup className='mb-2'>
                                <InputGroup.Text style={{width: 100}} className='justify-content-center'>
                                    비밀번호
                                </InputGroup.Text>
                                <Form.Control name="pass" type="password" value={pass} onChange={onChange}/>
                            </InputGroup>
                            <div>
                                <Button type="submit" className='w-100'>회원가입</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default Join;