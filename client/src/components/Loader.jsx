import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { LinearProgress } from "@mui/material";

const Loader = ({ open }) => {

    const progressComponentsArr = [<CircularProgress color="inherit" />, <LinearProgress style={{ width: "80%" }} />]

    let index = Math.floor(Math.random() * 2);
    return (
        <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            {progressComponentsArr[index]}
        </Backdrop>
    );
};

export default Loader;
