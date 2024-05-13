import React, { useState } from "react";
import "./components.css";

const LogoFont = (props) => {

  const logoStyle = {
    
  };

  return (
    <div
      style={{
        fontFamily: "LogoFont, sans-serif",
        color: props.color,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        margin: props.margins,
        letterSpacing: "3px",
        textAlign: props.align,
        transition: "color 0.3s ease",
      }}
    >
      {props.text}
    </div>
  );
};

export default LogoFont;
