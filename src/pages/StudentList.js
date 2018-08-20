import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Button } from "react-bootstrap";
import { GET_STUDENTS } from "../redux/types";
import { ExcelRenderer } from "react-excel-renderer";
import { async } from "@firebase/util";

function StudentList() {
  const dispatch = useDispatch();
  const students = useSelector((state) => state?.StudentListReducer?.students);
  const inputFile = useRef();
  const [loading, setLoading] = useState(false);

  const getStudents = async () => {
    const Ref = collection(db, "registeredStudents");
    const students = await getDocs(Ref);
    let studentsArr = [];
    students.forEach((student) => {
      studentsArr.push({ id: student.id, ...student.data() });
    });

    dispatch({
      type: GET_STUDENTS,
      payload: studentsArr,
    });
  };

  const AddDataToDb = async (rows) => {
    let TestArrStr = ["cnic", "code ", "email", "name"];
    if (rows[0].join(",") === TestArrStr.join(",")) {
      let payloadArrExcel = [];
      let payloadToPushArr = [];
      let studentsArr = rows.slice(1);
      let promiseArr = [];

      studentsArr.forEach((student) => {
        payloadArrExcel.push({
          cnic: student[0],
          code: student[1],
          name: student[2],
          email: student[3],
        });
      });

      payloadArrExcel.forEach((data) => {
        students.forEach((data1) => {
          if (data1?.code.toString() !== data?.code.toString()) {
            payloadToPushArr.push({ ...data });
          }
        });
      });

      try {
        payloadToPushArr.forEach((payload) => {
          promiseArr.push(
            addDoc(collection(db, "registeredStudents"), {
              ...payload,
              code: payload?.code.toString(),
              cnic: payload?.cnic.toString(),
            })
          );
        });

        await Promise.all(promiseArr)
          .then((res) => {
            let arrId = [];

            res.forEach((re) => {
              arrId.push(re?.id);
            });

            let newData = payloadToPushArr.map((payload, i) => ({
              ...payload,
              code: payload?.code.toString(),
              cnic: payload?.cnic.toString(),
              id: arrId[i],
            }));

            dispatch({
              type: GET_STUDENTS,
              payload: [...students, ...newData],
            });
            setLoading(false);
          })

          .catch((err) => {
            console.log("err", err);
            setLoading(false);
            alert("Something went wrong while adding data");
          });
      } catch (error) {
        console.log("error", error);
        setLoading(false);
        alert("Something went wrong while adding data");
      }
    } else {
      setLoading(false);
      alert("Invalid Structure, hedading is important in excel ");
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  const ButtonExcelHandler = () => {
    setLoading(true);
    inputFile.current.click();
  };

  const selectFileHandler = (e) => {
    let file = e.target.files[0];
    if (
      file?.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Only Excel Sheets are allowed");
      setLoading(false);
    } else {
      ExcelRenderer(file, (err, resp) => {
        if (err) {
          console.log(err);
          setLoading(false);
          alert("Something went wrong");
        } else {
          AddDataToDb(resp.rows);
        }
      });
    }
  };

  return (
    <div>
      <input
        type="file"
        style={{ display: "none" }}
        ref={inputFile}
        onChange={selectFileHandler}
      />
      <Button
        style={{ margin: 10 }}
        onClick={ButtonExcelHandler}
        disabled={loading}
      >
        Add Students Excel
      </Button>
      <div style={{ width: "60rem", margin: "40px auto" }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>CODE</th>
              <th>CNIC</th>
              <th>NAME</th>
              <th>EMAIL</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr>
                <td>{student.code}</td>
                <td>{student.cnic}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default StudentList;
