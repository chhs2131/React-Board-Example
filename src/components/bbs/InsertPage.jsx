import React, {useEffect, useState} from 'react';
import {Col, Row, Table} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import moment from "moment";

import {fs} from '../../firebaseInit';
import {addDoc, collection, onSnapshot} from 'firebase/firestore';

const InsertPage = () => {
    const [form, setForm] = useState({
        title: '',
        contents: '',
    });
    const {title, contents} = form;

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }
    const onInsert = async () => {
        if (title === "" || contents === "") {
            alert("제목과 내용을 입력하세요");
            return;
        }
        if (!window.confirm("등록하시겠습니까?")) return;

        const data = {
            email:sessionStorage.getItem('email'),
            title,
            contents,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
        console.log(data);

        await addDoc(collection(fs, 'posts'), data);
    }
    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1>글쓰기</h1>
                <div className='mt-5'>
                    <Form.Control onChange={onChangeForm} name="title" value={title} placeholder='제목을 입력하세요' className='mb-2'/>
                    <Form.Control onChange={onChangeForm} name="contents" value={contents} as="textarea" rows={10} placeholder='내용을 입력하세요!'/>
                    <div>
                        <Button onClick={onInsert} className='px-5 me-2'>등록</Button>
                        <Button variant='secondary'>취소</Button>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default InsertPage;
