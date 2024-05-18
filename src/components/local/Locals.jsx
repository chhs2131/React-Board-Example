import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Table, Button, Col, InputGroup, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";

import { app, db } from "../../firebaseInit";
import { getDatabase, ref, set, get } from "firebase/database";
import {useNavigate} from "react-router-dom";

const Locals = () => {
    const [query, setQuery] = useState("인하대학교")
    const [loading, setLoading] = useState(false)
    const [locals, setLocals] = useState([])
    const [page, setPage] = useState(1)

    const uid = sessionStorage.getItem('uid');
    const navi = useNavigate();

    const callAPI = async () => {
        setLoading(true);

        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${query}&size=10&page=${page}`;
        const config = {
            headers: {"Authorization": "KakaoAK a130d4bc5b0df2dd600ac87ffdda755a"}
        }
        const res = await axios.get(url, config);
        setLocals(res.data.documents);
        console.log(locals);

        setLoading(false);
    }

    useEffect(() => {
        callAPI();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        callAPI();
    };

    const onClickFavortie = async(local) => {
        if (!uid) {
            sessionStorage.setItem('target', '/locals');
            navi('/login');
        }

        if (window.confirm("즐겨찾기에 추가할까요?")) {
            setLoading(true);
            await get(ref(db, `favorite/${uid}/${local.id}`)).then(async snapshot => {
                if (snapshot.exists()) {
                    alert("이미 즐겨찾기에 있습니다!");
                } else {
                    await set(ref(db, `favorite/${uid}/${local.id}`), {...local});
                    alert("성공!");
                }
            }).finally(
                () => setLoading(false)
            );
        }
    }




    if (loading) return <h1 className='my-5'>로딩중입니다..</h1>
    return (
        <div>
            <h1 className='my-3'>지역검색</h1>

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

            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td>ID</td>
                        <td>장소명</td>
                        <td>주소</td>
                        <td>전화</td>
                        <td>즐겨찾기</td>
                    </tr>
                </thead>
                <tbody>
                {locals.map(local =>
                    <tr key={local.id}>
                        <td>{local.id}</td>
                        <td>{local.place_name}</td>
                        <td>{local.address_name}</td>
                        <td>{local.phone}</td>
                        <td><Button onClick={() => onClickFavortie(local)}>즐겨찾기</Button></td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default Locals;
