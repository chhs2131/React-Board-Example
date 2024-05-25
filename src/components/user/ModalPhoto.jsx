import React, {useState} from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {st, fs} from '../../firebaseInit';
import {getStorage, uploadBytes, ref, getDownloadURL} from 'firebase/storage';
import {setDoc, doc} from "firebase/firestore";

const ModalPhoto = ({setLoading, form, setForm}) => {
    const uid = sessionStorage.getItem('uid');
    const [fileName, setFileName] = useState(form.photo);
    const [file, setFile] = useState(null);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onCompleted = (e) => {
    }

    const style={
        cursor: 'pointer',
        borderRadius: '50%',
        width: '80px'
    }
    const style2={
        borderRadius: '50%',
        width: '200px',
        marginBottom: '10px',
    }

    const onChangeFile = (e) => {
        setFileName(URL.createObjectURL(e.target.files[0]));
        setFile(e.target.files[0])
    }

    const onClickSave = async () => {
        if (!file) {
            alert("변경할 이미지를 선택하세요!");
            return;
        }
        if (!window.confirm("사진을 저장하실래요?")) {
            return;
        }

        // 사진저장 (업로드)
        setLoading(true);
        const res = await uploadBytes(ref(st, `/photo/${Date.now()}.jpg`), file);
        const url = await getDownloadURL(res.ref);
        await setDoc(doc(fs, `users/${uid}`), {...form, photo: url});
        setForm({...form, photo: url});
        setLoading(false);

    }

    return (
        <>
            <img src={form.photo || "http://via.placeholder.com/80x80"} style={style} onClick={handleShow}/>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>사진변경</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-center'>
                    <img src={fileName || "http://via.placeholder.com/200x200"} style={style2} />
                    <Form.Control type='file' onChange={onChangeFile}></Form.Control>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={onClickSave}>저장</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalPhoto;
