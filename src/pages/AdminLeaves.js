import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, addDoc, updateDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { EDIT_LEAVE } from "../redux/types";
import LeaveBoxComponent from "../components/LeaveBoxComponent";

function AdminLeaves() {
  const dispatch = useDispatch();

  const admin = useSelector((state) => state?.AuthReducer?.admin);
  const leaves = useSelector((state) => state?.LeaveReducer?.leaves);

  const StatusHandler = async (id) => {
    try {
      await updateDoc(doc(db, "Leaves", id), {
        status: "accepted",
      });

      dispatch({
        type: EDIT_LEAVE,
        payload: id,
      });
    } catch (error) {
      alert("Something went wrong while upadting status");
    }
  };

  console.log("leaves", leaves);

  return (
    <>
      {leaves &&
        leaves?.length > 0 &&
        leaves.map((leave) => (
          <LeaveBoxComponent
            leave={leave}
            isAdmin={admin}
            editStatus={StatusHandler}
          />
        ))}
    </>
  );
}

export default AdminLeaves;
