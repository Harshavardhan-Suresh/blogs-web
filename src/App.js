import './App.css';
import React from 'react';
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [id, setId] = useState("");
  const [listofblogs, setListOfBlogs] = useState([]);
  const [status, setStatus] = useState("all");
  
  const create = () => {
    setStatus("add");
  }

  const addBlog = () => {
    if (title !== "" && content !== "" && description !== "") {
      Axios.post("http://localhost:3001/addBlog", {
        title: title,
        description: description,
        content : content  
      }).then((response) => {
        setListOfBlogs([
          ...listofblogs,
          { _id: response.data._id, title : title, description : description, content : content },
        ]);
      });;   
      setStatus("all");
    }
    else {
      alert("kindly fill all the fields");
    }
  };

  
  const all = () => {
    setStatus("all");   
  };

  const edit = (id) => {
    for (let val of listofblogs) {
      if (val._id === id) {
        setContent(val.content);
        setDescription(val.description);
        setTitle(val.title);
        setId(val._id);
      }
    }
    setStatus("edit");   
  };

  const del = (id) => {
    Axios.delete(`http://localhost:3001/delete/${id}`).then(() => {
      setListOfBlogs(listofblogs.filter((val) => {
        return val._id !== id;
      }))
    });
    
  };

  const upd = () => {
    Axios.post("http://localhost:3001/addBlog", {
      title: title,
      description: description,
      content : content  
    }).then((response) => {
      // setListOfBlogs([
      //   ...listofblogs,
      //   { _id: response.data._id, title : title, description : description, content : content },
      // ]);
      setListOfBlogs((oldList) => {
        let temp = oldList.map((val) => {
          if (val._id !== id) {
            return val;
          }
          else {
            return {_id: response.data._id, title : title, description : description, content : content }
          }
        })
        return temp
      }) 
    });   
    Axios.delete(`http://localhost:3001/delete/${id}`);
      //correct id -> id
    // for (let val of listofblogs) {
    //   if (val._id === id) {
    //     val.content = content;
    //     val.description = description;
    //     val.title = title;
        
    //   }
    // }
    setStatus("all");
  };

   

  useEffect(() => {
    console.log("fetching data");
    Axios.get("http://localhost:3001/read").then((response) => {
      setListOfBlogs(response.data);
    }).catch(() => {
      console.log("doesn't work");
    });   
  }, []);

  if (status === "all") {
    
    return (
      <div className="App1">
        <button onClick={create} className="newBlock1">
          <div>Add new Blog</div>  
        </button>
          {listofblogs.map((val, index) => {
            return (<div key={index} className="blogs"> 
              <div className="title">{val.title}</div> 
              <div className="description">{val.description}</div> 
              <div className="content">{val.content}</div>
              <div>
                <button className="edit" onClick={() =>
                    {edit(val._id)}
                  }>
                  Edit  
                </button>
                <button className="delete" onClick={() =>
                    {del(val._id)}
                  }>
                  Delete  
                </button>
              </div>
              
            </div>)
          })}
      </div>
    );
  }
  else if (status === "add"){
    return (
      <div className="App">
        
        <div className="inputs">  
          <div className="blog">
            <button onClick={all} className="newBlock1">
              All blogs
            </button>
          </div>
          <div className="label">
          <label for="title" className="">Title</label>
          </div>
          <div className="textbox">  
            <input type="text" onChange={(event) => {
              setTitle(event.target.value);
            }} />    
          </div>
          
          <div className="label">
          <label for="description">Description</label>
          </div>
          <div className="textbox">  
            <input type="text" onChange={(event) => {
              setDescription(event.target.value);
            }} /> 
          </div>
          <div className="label">
          <label for="title">Content</label>
          </div>
          <div className="textarea">   
            <textarea required name="markdown" onChange={(event) => {
              setContent(event.target.value);
            }}></textarea>
          </div>
          <div className="addblog">
            <button className="delete" onClick={all}>
              cancel  
            </button>
            <button className="edit submit" onClick={addBlog}>
              submit  
            </button>
          </div>
        </div>
        
      </div>);
  }
  else if (status === "edit"){
    return (  
      <div className="App">
        <div className="inputs">  
          <div className="label">
          <label for="title" className="">Title</label>
          </div>
          <div className="textbox">  
            <input type="text"  defaultValue={title} onChange={(event) => {
              setTitle(event.target.value);
            }} />    
          </div>
          
          <div className="label">
          <label for="description">Description</label>
          </div>
          <div className="textbox">  
            <input type="text" defaultValue={description} onChange={(event) => {
              setDescription(event.target.value);
            }} /> 
          </div>
          <div className="label">
          <label for="title">Content</label>
          </div>
          <div className="textarea">   
            <textarea required name="markdown" onChange={(event) => {
              setContent(event.target.value);
            }}>{content}</textarea>
          </div>
          
          <div className="addblog">
            <div>
              <button onClick={all} className="delete">
                cancel  
              </button>
              </div>
            <div>
              <button className="edit submit" onClick={upd}>
                submit 
              </button>
            </div>  
          </div>
          
        </div>
        
      </div>);
  }
}

export default App;
