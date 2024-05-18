import React, {useEffect, useState} from 'react';
import {onValue, ref, remove} from "firebase/database";
import {db} from "../../firebaseInit";
import {Button, Table} from "react-bootstrap";

const Favorite = () => {
    const [loading, setLoading] = useState(false)
    const [locals, setLocals] = useState([]);

    const uid = sessionStorage.getItem('uid');

    const callAPI = () => {
        setLoading(true);

        onValue(ref(db, `favorite/${uid}`), snapshot => {
            console.log(snapshot.key, snapshot.val());
            const rows=[];
            snapshot.forEach(row=> {
                rows.push({key: row.key, ...row.val()});
            });

            console.log(rows);
            setLocals(rows);
            setLoading(false);
        });
    }

    const onClickDelete = (local) => {
        if (window.confirm(`${local.id}을 장바구니에서 삭제하시겠습니까?`)) {
            setLoading(true);
            remove(ref(db, `favorite/${uid}/${local.id}`));
            setLoading(false);
        }
    }

    useEffect(() => {
        callAPI();
    }, []);

    return (
        <div>
            <h1 className='my-3'>즐겨찾기</h1>

            <Table striped bordered hover>
                <thead>
                <tr className='text-center'>
                    <td>ID</td>
                    <td>장소명</td>
                    <td>주소</td>
                    <td>전화</td>
                    <td>취소</td>
                </tr>
                </thead>
                <tbody>
                {locals.map(local =>
                    <tr key={local.id}>
                        <td>{local.id}</td>
                        <td>{local.place_name}</td>
                        <td>{local.address_name}</td>
                        <td>{local.phone}</td>
                        <td><Button onClick={() => onClickDelete(local)}>취소</Button></td>
                    </tr>
                )}
                </tbody>
            </Table>
        </div>
    );
};

export default Favorite;
