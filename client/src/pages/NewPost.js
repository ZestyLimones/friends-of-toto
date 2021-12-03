import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import "../components/ProfileSettings/ProfileSettings.css";
import { NEW_POST } from "../utils/mutations";

import { uploadFile } from "react-s3";
import changePic from "../images/puppyPic.svg";
import { tabClasses } from "@mui/material";

const S3_BUCKET = process.env.REACT_APP_BUCKET_NAME;
const REGION = process.env.REACT_APP_REGION;
const ACCESS_KEY = process.env.REACT_APP_ACCESS_ID;
const SECRET_ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
const S3_URL = process.env.REACT_APP_URL;

const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    position: "relative",
  },
  overlay: {
    height: "100%",
    width: "100%",
    opacity: "0",
    "&:hover": {
      opacity: "1",
    },
  },
  media: {
    height: 345,
    maxWidth: 345,
  },
});

export default function NewPost() {
  const classes = useStyles();

  const [postText, setPostText] = useState({
    postText: "", 
   
  });
  const [postImage, setPostImage] = useState({
    postImage: "", 
   
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [newPost] = useMutation(NEW_POST);

  const inputEl = React.useRef(null);

  useEffect(() => {
    const handleUpload = async (file) => {
      uploadFile(file, config);
      setFileName(file.name);
    };
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() =>{
    if(postImage !== ""){newPost({
     variables: {postImage, postText} 
    })}
  }, [postImage])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostText({
      [name]: value,
    });
  };

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  const onImageClick = async () => {
    await inputEl.current.click();
  };

  const submitPost = () => {
    setPostImage(
      S3_URL + fileName
    );
   
  };
  return (
    <Card className={classes.root}>
      <input
        accept="image/*"
        id="new-post-pic-file"
        type="file"
        style={{ display: "none" }}
        ref={inputEl}
        onChange={handleFileInput}
      />
      <label htmlFor="new-post-pic-file">
        <CardActionArea
          sx={{
            ":hover": {
              "& .overlay": {
                opacity: "1",
              },
            },
          }}
          onClick={() => onImageClick()}
        >
          <CardMedia
            component="img"
            className={classes.media}
            image={postImage}
            title="new post"
          />
          <div
            style={{
              position: "absolute",
              top: "20px",
              color: "black",
              backgroundColor: "transparent",
            }}
            className={classes.overlay}
          >
            <img alt="" width="80px" src={`${changePic}`}></img>
          </div>
        </CardActionArea>
      </label>
      <CardContent>
        <TextField
          required
          id="filled"
          label="post description"
          multiline
          rows={5}
          value={postText}
          name="postText"
          variant="filled"
          onChange={handleChange}
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={submitPost}>
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}
