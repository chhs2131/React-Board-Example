import React, {useEffect, useState} from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useParams} from "react-router-dom";

import {fs} from "../../firebaseInit";
import {deleteDoc, doc, addDoc, updateDoc, collection, onSnapshot, query, orderBy, where} from 'firebase/firestore';
import {Col, FormControl, Row} from "react-bootstrap";
import moment from "moment/moment";

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [contents, setContents] = useState('');
    const email = sessionStorage.getItem('email');
    const {id} = useParams();

    const callAPI = () => {
        const q = query(
            collection(fs, 'comments'),
            where('pid', '==', id),
            orderBy('date', 'desc')
        );

        onSnapshot(q, snapshot => {
            let rows = [];
            snapshot.forEach(row => {
                rows.push({id: row.id, ...row.data()});
            });
            const data = rows.map(row => row && {...row,
                ellp: true,
                isEdit: false,
                originContents: row.contents,
            });
            setComments(data);
        });
    }

    useEffect(() => {
        callAPI();
    }, []);

    const onClickInsert = () => {
        sessionStorage.setItem('target', `/bbs/read/${id}`);
        window.location.href = '/login';
    }

    const onInsert = async () => {
        if (contents === "") {
            alert("내용을 입력해주세요.")
            return;
            // contents, date, email, id, pid
        }

        const data = {
            email: email,
            contents: contents,
            pid: id,
            date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        }
        console.log(data);

        await addDoc(collection(fs, 'comments'), data);
        alert("댓글을 등록하였습니다.");
        setContents("");
    }

    const onClickContents = (id) => {
        const data = comments.map(com => com.id === id ? {
                ...com, ellp: !com.ellp
            } : com
        );

        setComments(data);
    }

    const onClickDelete = async (id) => {
        if (!window.confirm(`${id}번 댓글을 삭제하실래요?`)) return;

        await deleteDoc(doc(fs, `/comments/${id}`));
    }

    const onClickUpdate = (id) => {
        const data = comments.map(com => com.id === id ? {...com, isEdit: true} : com);
        setComments(data);
    }

    const onChangeContents = (e, id) => {
        const data = comments.map(com => com.id === id ? {
            ...com, contents: e.target.value} : com);
        setComments(data);
    }

    const onClickSave = async (com) => {
        if (com.originContents === com.contents) {
            onClickCancel(com);
            return;
        }
        if (!window.confirm("변경하시겠습니까?")) return;
        await updateDoc(doc(fs, `/comments/${com.id}`), com);
    };

    const onClickCancel = (com) => {
        if (com.contents !== com.originContents) {
            if (!window.confirm("작성중인 내용이 있습니다. 취소할까요?")) {
                return;
            }
        }
        const data = comments.map((c) =>
            c.id === com.id ? { ...c, isEdit: false, contents: c.originContents } : c
        );
        setComments(data);
    };

    // 댓글 등록
    return (
        <div className='my-5'>
            {!email ?
                <div className='text-end'>
                    <Button className='px-5' onClick={onClickInsert}>댓글등록</Button>
                </div>
                :
                <div>
                    <Form.Control as="textarea" rows={3} placeholder='댓글 내용을 입력하세요.' value={contents} onChange={(e) => setContents(e.target.value)}>
                    </Form.Control>
                    <div className='text-end mt-2'>
                        <Button onClick={onInsert}>등록</Button>
                    </div>
                </div>
            }
            <div className='my-5'>
                {comments.map(com =>
                    <div key={com.id}>
                        <Row>
                            <Col className='text-muted'>
                                <span className='me-2'>{com.email}</span>
                                <span>{com.date}</span>
                            </Col>
                            {email === com.email && !com.isEdit &&
                                <Col>
                                    <div className='text-end mb-2'>
                                        <Button variant='success' size="sm" className='me-2'
                                                onClick={() => onClickUpdate(com.id)}>수정</Button>
                                        <Button variant='danger' size="sm"
                                                onClick={() => onClickDelete(com.id)}>삭제</Button>
                                    </div>
                                </Col>
                            }

                            {email === com.email && com.isEdit &&
                                <Col>
                                    <div className='text-end mb-2'>
                                        <Button variant='success' size="sm" className='me-2'
                                                onClick={() => onClickSave(com)}>저장</Button>
                                        <Button variant='' size="sm"
                                                onClick={() => onClickCancel(com)}>취소</Button>
                                    </div>
                                </Col>
                            }
                        </Row>
                        {/*<div style={{whiteSpace: 'pre-wrap', cursor: 'pointer'}}>*/}

                        {com.isEdit ?
                            <Form.Control onChange={(e) => onChangeContents(e, com.id)} value={com.contents} as="textarea" rows={5}></Form.Control>
                            :
                            <div
                                className={com.ellp && "ellipsis"}
                                style={{ whiteSpace: "pre-wrap", cursor: "pointer" }}
                                onClick={() => onClickContents(com.id)} >
                                {com.contents}
                            </div>
                        }
                        <hr/>
                    </div>)}
            </div>
        </div>
    );
};

export default Comments;
