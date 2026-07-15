import React from "react";
import "../auth.scss";

const Loading = () => {
    return (
        <div className="loading-container">
            <div className="loading-ring"></div>
            <div className="loading-bars">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <p className="loading-text">Please wait...</p>
        </div>
    );
};

export default Loading;