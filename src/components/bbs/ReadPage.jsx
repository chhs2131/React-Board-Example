import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Row, Col, Form } from 'react-bootstrap'
import {fs} from "../../firebaseInit";
import {collection, query, orderBy, getDoc, deleteDoc, doc} from 'firebase/firestore';
import Comments from "./Comments";

const ReadPage = () => {
    const navi = useNavigate();
    const [loading, setLoading] = useState(false);
    const { id} = useParams();
    const [post, setPost] = useState('')
    const myEmail = sessionStorage.getItem("email");

    const callAPI = async() => {
        setLoading(true);
        const docRef = doc(fs,`posts/${id}`);
        const res = await getDoc(docRef);

        setPost(res.data());
        setLoading(false);
    }
    const {email, date, title, contents} = post;

    useEffect(()=>{
        callAPI();
    }, []);

    const onClickDelete = async () => {
        if (!window.confirm(`${id}번 게시글을 삭제하실래요?`)) return;

        await deleteDoc(doc(fs, `/posts/${id}`));
        navi('/bbs');  // window.location.href = '/bbs';
    }

    if(loading) return <h1 className='my-5 text-center'>로딩중......</h1>
    return (
        <Row className='justify-content-center my-5'>
            <Col xs={10} md={8} lg={7}>
                <h1>게시글정보</h1>
                {myEmail === email &&
                    <div className='text-end mb-2'>
                        <a href={`/bbs/update/${post.id}`}>
                        <Button variant='success' size="sm" className='me-2'>수정</Button>
                        </a>

                        <Button variant='danger' size="sm" onClick={onClickDelete}>삭제</Button>
                    </div>
                }
                <Card>
                    <Card.Body>
                    <h5>{title}</h5>
                        <div className='text-muted'>
                            <span className='me-3'>{date}</span>
                            <span>{email}</span>
                        </div>
                        <hr/>
                        <div style={{whiteSpace: 'pre-wrap'}}>{contents}</div>
                    </Card.Body>
                </Card>
                <Comments></Comments>
           </Col>
        </Row>
    );
};

export default ReadPage;
