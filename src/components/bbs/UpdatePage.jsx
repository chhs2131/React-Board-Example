import React, {useEffect, useState} from 'react';
import {Col, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import moment from "moment/moment";
import {updateDoc, collection, doc, getDoc} from "firebase/firestore";
import {fs} from "../../firebaseInit";
import {useNavigate, useParams} from "react-router-dom";

const UpdatePage = () => {
    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const { id} = useParams();
    const myEmail = sessionStorage.getItem("email");
    const [form, setForm] = useState({
        title: '',
        contents: '',
    });
    const {email, date, title, contents} = form;

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]:e.target.value});
    }

    const callAPI = async() => {
        setLoading(true);
        const docRef = doc(fs,`posts/${id}`);
        const res = await getDoc(docRef);

        console.log(res.data());
        setForm(res.data());
        setLoading(false);
    }

    useEffect(()=>{
        callAPI();
    }, []);


    const onClickUpdate = async () => {
        if (title === "" || contents === "") {
            alert("제목과 내용을 입력하세요");
            return;
        }
        if (!window.confirm(`${id}번 게시글을 수정하실래요?`)) return;

        // const data = {
        //     email:sessionStorage.getItem('email'),
        //     title,
        //     contents,
        //     date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // }
        // console.log(data);

        await updateDoc(doc(fs, `posts/${id}`), form);

        navi(`/bbs/read/${id}`);
    }


    return (
        <Row className='my-5 justify-content-center'>
            <Col xs={12} md={10} lg={8}>
                <h1>수정하기</h1>
                <div className='mt-5'>
                    <Form.Control onChange={onChangeForm} name="title" value={title} placeholder='제목을 입력하세요' className='mb-2'/>
                    <Form.Control onChange={onChangeForm} name="contents" value={contents} as="textarea" rows={10} placeholder='내용을 입력하세요!'/>
                    <div>
                        <Button onClick={onClickUpdate} className='px-5 me-2'>수정</Button>
                        <Button variant='secondary'>취소</Button>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default UpdatePage;
