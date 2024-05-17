import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Card, Col, InputGroup, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {FaCartShopping} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";
import { app, db } from "../../firebaseInit";
import { getDatabase, ref, set, get } from "firebase/database";


const Books = () => {
    // const db = getDatabase(app);
    const navi = useNavigate();
    const uid = sessionStorage.getItem('uid');

    const [query, setQuery] = useState('리액트');
    const [loading, setLoading] = useState(false)
    const [books, setBooks] = useState([])
    const [page, setPage] = useState(1);

    const callAPI = async () => {
        const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&page=${page}&size=12`;
        const config = {
            headers: {"Authorization": "KakaoAK a130d4bc5b0df2dd600ac87ffdda755a"}
        }

        setLoading(true);
        const res = await axios.get(url, config);
        setBooks(res.data.documents)
        setLoading(false);
    }

    useEffect(() => {
        callAPI();

        set(ref(db, "test/" + "abcd"), {
            "123":
            "44567",
        });
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    };

    const onClickCart = (book) => {
        if (uid) {
            // 장바구니에 도서 넣기
            if (window.confirm(`"${book.title}"\n장바구니에 넣으실래요?`)) {
                get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot => {
                    if (snapshot.exists()) {
                        alert("이미 장바구니에 있습니다!");
                    } else {
                        set(ref(db, `cart/${uid}/${book.isbn}`), {...book});
                        alert("성공!");
                    }
                });
            }
        } else {
            sessionStorage.setItem('target', '/books');
            navi('/login');
        }
    };


    if (loading) return <h1 className='my-3'>로딩중입니다...</h1>
    return (
        <div>
            <h1 className='my-3'>도서검색</h1>
            <Row className='mb-2'>
                <Col xs={8} md={6} lg={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control placeholder='검색어' value={query} onChange={(e) => setQuery(e.target.value)}>
                            </Form.Control>
                            <Button type="submit">
                                검색
                            </Button>
                        </InputGroup>
                    </form>
                </Col>
            </Row>
            <Row>
                {books.map(book =>
                    <Col key={book.isbn} xs={6} md={3} lg={2} className='mb-2'>
                        <Card>
                            <Card.Body className='justify-content-center d-flex'>
                                <img src={book.thumbnail || 'http://via.placeholder.com/120x170'}/>
                            </Card.Body>
                            <Card.Footer>
                                <div className='ellipsis'>
                                    {book.title}
                                </div>

                                <FaCartShopping
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "20px",
                                        color: "green",
                                    }} onClick={() => onClickCart(book)}/>
                            </Card.Footer>
                        </Card>
                    </Col>
                )}
            </Row>
            <div className='text-center my-3'>
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>이전</Button>
                <span className='mx-2'>{page}</span>
                <Button onClick={() => setPage(page + 1)} disabled={page === 999}>다음</Button>
            </div>
        </div>
    );
};

export default Books;
