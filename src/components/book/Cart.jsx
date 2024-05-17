import React, {useEffect, useState} from 'react';
import { app, db } from '../../firebaseInit'
import { getDatabase, onValue, ref, remove } from "firebase/database";
import {Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";

const Cart = () => {
    const uid = sessionStorage.getItem('uid');

    const [loading, setLoading] = useState(false)
    const [books, setBooks] = useState([]);

    const callAPI = () => {
        setLoading(true);

        onValue(ref(db, `cart/${uid}`), snapshot => {
            console.log(snapshot.key, snapshot.val());
            const rows=[];
            snapshot.forEach(row=> {
                rows.push({key: row.key, ...row.val()});
            });

            console.log(rows);
            setBooks(rows);
            setLoading(false);
        });

    }

    const onClickDelete = (book) => {
        if (window.confirm(`${book.title}을 장바구니에서 삭제하시겠습니까?`)) {
            remove(ref(db, `cart/${uid}/${book.isbn}`));
        }
    }

    useEffect(() => {
        callAPI();
    }, []);

    if (loading) return <h1 className='my-3'>로딩중입니다...</h1>
    return (
        <div>
           <h1 className='my-3'>장바구니</h1>

            <Table>
                <thead>
                <tr>
                    <td colSpan={2}>도서제목</td>
                    <td>가격</td>
                    <td>저자</td>
                    <td>삭제</td>
                </tr>
                </thead>
                <tbody>
                {books.map(book =>
                    <tr key={book.isbn}>
                        <td><img src={book.thumbnail} width="50px"/></td>
                        <td>{book.title}</td>
                        <td>{book.price}</td>
                        <td>{book.authors}</td>
                        <td><Button className="btn-sm" variant="danger" onClick={() => onClickDelete(book)}>삭제</Button></td>
                    </tr>
                )}
                </tbody>

            </Table>
        </div>
    );
};

export default Cart;