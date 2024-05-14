import React, { useState } from "react";
import { setInitAvatarCustomizer } from "../actions/actions";
import { useDispatch, useSelector } from "react-redux";
import { FormControl, InputLabel, Select, option } from "@mui/material";

const BuildAvatar = () => {
  const darkMode = useSelector((state) => state.darkMode);
  const theme = useSelector((state) => state.theme);
  const initAvatarCustomizer = useSelector(
    (state) => state.initAvatarCustomizer
  );
  const dispatch = useDispatch();

  const handleSelectChange = (event) => {
    const { id, value } = event.target;
    dispatch(
      setInitAvatarCustomizer({
        ...initAvatarCustomizer,
        [id]: value,
      })
    );
  };

  return (
    <div>
      <div
        style={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginRight: "10px",
          }}
        >
          <InputLabel
            style={{ color: darkMode ? theme.light : theme.primary }}
            htmlFor="topType"
          >
            Head Covering
          </InputLabel>
          <select
            style={{
              borderRadius: 5,
              border: "1px solid #ccc",
              padding: "8px 12px",
              color: "#878787",
            }}
            id="topType"
            onChange={handleSelectChange}
          >
            <option value="NoHair">NoHair</option>
            <option value="Eyepatch">Eyepatch</option>
            <option value="Hat">Hat</option>
            <option value="Hijab">Hijab</option>
            <option value="Turban">Turban</option>
            <option value="WinterHat1">WinterHat1</option>
            <option value="WinterHat2">WinterHat2</option>
            <option value="WinterHat3">WinterHat3</option>
            <option value="WinterHat4">WinterHat4</option>
            <option value="LongHairBigHair">LongHairBigHair</option>
            <option value="LongHairBob">LongHairBob</option>
            <option value="LongHairBun">LongHairBun</option>
            <option value="LongHairCurly">LongHairCurly</option>
            <option value="LongHairCurvy">LongHairCurvy</option>
            <option value="LongHairDreads">LongHairDreads</option>
            <option value="LongHairFrida">LongHairFrida</option>
            <option value="LongHairFro">LongHairFro</option>
            <option value="LongHairFroBand">LongHairFroBand</option>
            <option value="LongHairNotTooLong">LongHairNotTooLong</option>
            <option value="LongHairShavedSides">LongHairShavedSides</option>
            <option value="LongHairMiaWallace">LongHairMiaWallace</option>
            <option value="LongHairStraight">LongHairStraight</option>
            <option value="LongHairStraight2">LongHairStraight2</option>
            <option value="LongHairStraightStrand">
              LongHairStraightStrand
            </option>
            <option value="ShortHairDreads01">ShortHairDreads01</option>
            <option value="ShortHairDreads02">ShortHairDreads02</option>
            <option value="ShortHairFrizzle">ShortHairFrizzle</option>
            <option value="ShortHairShaggyMullet">ShortHairShaggyMullet</option>
            <option value="ShortHairShortCurly">ShortHairShortCurly</option>
            <option value="ShortHairShortFlat">ShortHairShortFlat</option>
            <option value="ShortHairShortRound">ShortHairShortRound</option>
            <option value="ShortHairShortWaved">ShortHairShortWaved</option>
            <option value="ShortHairSides">ShortHairSides</option>
            <option value="ShortHairTheCaesar">ShortHairTheCaesar</option>
            <option value="ShortHairTheCaesarSidePart">
              ShortHairTheCaesarSidePart
            </option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <InputLabel
            style={{ color: darkMode ? theme.light : theme.primary }}
            htmlFor="accessoriesType"
          >
            Glasses
          </InputLabel>
          <select
            style={{
              borderRadius: 5,
              border: "1px solid #ccc",
              padding: "8px 12px",
              color: "#878787",
            }}
            id="accessoriesType"
            onChange={handleSelectChange}
          >
            <option value="Blank">Blank</option>
            <option value="Kurt">Kurt</option>
            <option value="Prescription01">Prescription01</option>
            <option value="Prescription02">Prescription02</option>
            <option value="Round">Round</option>
            <option value="Sunglasses">Sunglasses</option>
            <option value="Wayfarers">Wayfarers</option>
          </select>
        </div>
      </div>

      <div
        style={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginRight: "10px",
          }}
        >
          <InputLabel
            style={{ color: darkMode ? theme.light : theme.primary }}
            htmlFor="hairColor"
          >
            Hair Color
          </InputLabel>
          <select
            style={{
              borderRadius: 5,
              border: "1px solid #ccc",
              padding: "8px 12px",
              color: "#878787",
            }}
            id="hairColor"
            onChange={handleSelectChange}
          >
            <option value="Auburn">Auburn</option>
            <option value="Black">Black</option>
            <option value="Blonde">Blonde</option>
            <option value="BlondeGolden">BlondeGolden</option>
            <option value="Brown">Brown</option>
            <option value="BrownDark">BrownDark</option>
            <option value="PastelPink">PastelPink</option>
            <option value="Blue">Blue</option>
            <option value="Platinum">Platinum</option>
            <option value="Red">Red</option>
            <option value="SilverGray">SilverGray</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <InputLabel
            style={{ color: darkMode ? theme.light : theme.primary }}
            htmlFor="facialHairType"
          >
            Facial Hair
          </InputLabel>
          <select
            style={{
              borderRadius: 5,
              border: "1px solid #ccc",
              padding: "8px 12px",
              color: "#878787",
            }}
            id="facialHairType"
            onChange={handleSelectChange}
          >
            <option value="Blank">Blank</option>
            <option value="BeardMedium">BeardMedium</option>
            <option value="BeardLight">BeardLight</option>
            <option value="BeardMajestic">BeardMajestic</option>
            <option value="MoustacheFancy">MoustacheFancy</option>
            <option value="MoustacheMagnum">MoustacheMagnum</option>
          </select>
        </div>
      </div>
      <div
        style={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginRight: "10px",
          }}
        >
          <InputLabel
            style={{ color: darkMode ? theme.light : theme.primary }}
            htmlFor="clotheType"
          >
            Clothes
          </InputLabel>
          <select
            style={{
              borderRadius: 5,
              border: "1px solid #ccc",
              padding: "8px 12px",
              color: "#878787",
            }}
            id="clotheType"
            onChange={handleSelectChange}
          >
            <option value="BlazerShirt">BlazerShirt</option>
            <option value="BlazerSweater">BlazerSweater</option>
            <option value="CollarSweater">CollarSweater</option>
            <option value="GraphicShirt">GraphicShirt</option>
            <option value="Hoodie">Hoodie</option>
            <option value="Overall">Overall</option>
            <option value="ShirtCrewNeck">ShirtCrewNeck</option>
            <option value="ShirtScoopNeck">ShirtScoopNeck</option>
            <option value="ShirtVNeck">ShirtVNeck</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <InputLabel
            style={{ color: darkMode ? theme.light : theme.primary }}
            htmlFor="eyeType"
          >
            Eyes
          </InputLabel>
          <select
            style={{
              borderRadius: 5,
              border: "1px solid #ccc",
              padding: "8px 12px",
              color: "#878787",
            }}
            id="eyeType"
            onChange={handleSelectChange}
          >
            <option value="Close">Close</option>
            <option value="Cry">Cry</option>
            <option value="Default">Default</option>
            <option value="Dizzy">Dizzy</option>
            <option value="EyeRoll">EyeRoll</option>
            <option value="Happy">Happy</option>
            <option value="Hearts">Hearts</option>
            <option value="Side">Side</option>
            <option value="Squint">Squint</option>
            <option value="Surprised">Surprised</option>
            <option value="Wink">Wink</option>
            <option value="WinkWacky">WinkWacky</option>
          </select>
        </div>
      </div>
      <div
        style={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginRight: "10px",
          }}
        >
          <InputLabel
            style={{ color: darkMode ? theme.light : theme.primary }}
            htmlFor="eyebrowType"
          >
            Expression
          </InputLabel>
          <select
            style={{
              borderRadius: 5,
              border: "1px solid #ccc",
              padding: "8px 12px",
              color: "#878787",
            }}
            id="eyebrowType"
            onChange={handleSelectChange}
          >
            <option value="Angry">Angry</option>
            <option value="AngryNatural">AngryNatural</option>
            <option value="Default">Default</option>
            <option value="DefaultNatural">DefaultNatural</option>
            <option value="FlatNatural">FlatNatural</option>
            <option value="RaisedExcited">RaisedExcited</option>
            <option value="RaisedExcitedNatural">RaisedExcitedNatural</option>
            <option value="SadConcerned">SadConcerned</option>
            <option value="SadConcernedNatural">SadConcernedNatural</option>
            <option value="UnibrowNatural">UnibrowNatural</option>
            <option value="UpDown">UpDown</option>
            <option value="UpDownNatural">UpDownNatural</option>
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <InputLabel
            style={{ color: darkMode ? theme.light : theme.primary }}
            htmlFor="mouthType"
          >
            Mouth
          </InputLabel>
          <select
            style={{
              borderRadius: 5,
              border: "1px solid #ccc",
              padding: "8px 12px",
              color: "#878787",
            }}
            id="mouthType"
            onChange={handleSelectChange}
          >
            <option value="Concerned">Concerned</option>
            <option value="Default">Default</option>
            <option value="Disbelief">Disbelief</option>
            <option value="Eating">Eating</option>
            <option value="Grimace">Grimace</option>
            <option value="Sad">Sad</option>
            <option value="ScreamOpen">ScreamOpen</option>
            <option value="Serious">Serious</option>
            <option value="Smile">Smile</option>
            <option value="Tongue">Tongue</option>
            <option value="Twinkle">Twinkle</option>
            <option value="Vomit">Vomit</option>
          </select>
        </div>
      </div>
      <div
        style={{ display: "flex", flexDirection: "row", marginBottom: "10px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <InputLabel
            style={{ color: darkMode ? theme.light : theme.primary }}
            htmlFor="skinColor"
          >
            Skin Color
          </InputLabel>
          <select
            style={{
              borderRadius: 5,
              border: "1px solid #ccc",
              padding: "8px 12px",
              color: "#878787",
            }}
            id="skinColor"
            onChange={handleSelectChange}
          >
            <option value="Tanned">Tanned</option>
            <option value="Yellow">Yellow</option>
            <option value="Pale">Pale</option>
            <option value="Light">Light</option>
            <option value="Brown">Brown</option>
            <option value="DarkBrown">DarkBrown</option>
            <option value="Black">Black</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BuildAvatar;
