import React, {useEffect, useState} from 'react';
import {Card, Col, InputGroup, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {fs} from '../../firebaseInit';
import {doc, setDoc, getDoc} from 'firebase/firestore';
import ModalAddress from "./ModalAddress";
import ModalPhoto from "./ModalPhoto";

const MyPage = () => {
    const uid = sessionStorage.getItem('uid');
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: '무기명',
        phone: '010-0000-0000',
        address1: '인천 미추홀구',
        address2: '인하대 2호관',
        email: sessionStorage.getItem('email'),
    })
    const {name, phone, address1, address2} = form;  // 비구조 할당 . form 내부값을 각 변수에 매칭시킴

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if (name === "") {
            alert("이름을 입력하세요!");
            return;
        }

        // 정보를 저장
        if (!window.confirm("변경된 내용을 저장할까요?")) {
            return;
        }
        setLoading(true);
        console.log(form);
        await setDoc(doc(fs, `users/${uid}`), form);
        setLoading(false);
    }

    const callAPI = async() => {
        setLoading(true);
        const res = await getDoc(doc(fs, `users/${uid}`));
        if(res.data()) {
            setForm(res.data());
        }
        setLoading(false);
    }

    useEffect(() => {
        callAPI();
    }, []);

    if (loading) return <h1 className='my-3'>로딩중입니다...</h1>
    return (
        <Row className='justify-content-center my-5'>
            <Col>
                <Card>
                    <Card.Header>
                        <h3>마이페이지</h3>
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={onSubmit}>
                            <ModalPhoto setLoading={setLoading} form={form} setForm={setForm}></ModalPhoto>
                            <InputGroup className='mb-2 mt-2'>
                                <InputGroup.Text>이름</InputGroup.Text>
                                <Form.Control name="name" value={name} onChange={onChangeForm}></Form.Control>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>전화</InputGroup.Text>
                                <Form.Control name="phone" value={phone} onChange={onChangeForm}></Form.Control>
                            </InputGroup>
                            <InputGroup className='mb-1'>
                                <InputGroup.Text>주소</InputGroup.Text>
                                <Form.Control disabled='true' name="address1" value={address1} onChange={onChangeForm}></Form.Control>
                                <ModalAddress form={form} setForm={setForm}></ModalAddress>
                                {/*<Button>검색</Button>*/}
                            </InputGroup>
                            <Form.Control name="address2" value={address2} placeholder='상세주소' onChange={onChangeForm}></Form.Control>
                            <div className='text-center mt-3'>
                                <Button className='px-5' type='submit'>저장</Button>
                                <span> </span>
                                <Button variant='secondary' className='ml-5'>취소</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default MyPage;
