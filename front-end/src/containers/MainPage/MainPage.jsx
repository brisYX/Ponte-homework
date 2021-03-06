//@ts-check
import React, { useState, useEffect } from "react";
import axios from "axios";
import ChannelListItem from "../../Components/ChannelItem";
import PostItem from "../../Components/PostItem";

const MainPage = props => {
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [channels, setChannesl] = useState([]);
  const [members, setMembers] = useState([]);
  const [inputText, setinputText] = useState("");
  const [posts, setPost] = useState([]);
  const [currentChannelId, setCurretnChannelId] = useState("");

  useEffect(() => {
    axios
      .get("/api/user/me")
      .then(response => {
        setUserName(response.data.username);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
        props.history.push("/");
      });

    axios
      .get("/api/user/team")
      .then(response => {
        console.log(response.data);
        localStorage.setItem("teamId", response.data[0].id);
        setIsLoading(true);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("teamId")) {
      axios
        .get("/api/user/channels/" + localStorage.getItem("teamId"))
        .then(response => {
          console.log(response.data);
          setChannesl(response.data);
        })
        .catch(error => {
          console.log(error);
        });

      axios
        .get("/api/user/members/" + localStorage.getItem("teamId"))
        .then(response => {
          console.log("Members", response.data);
          setMembers(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [isLoading]);

  const getPosts = channelId => {
    axios
      .get("/api/user/posts/" + channelId)
      .then(response => {
        setPost(response.data.order);
        setCurretnChannelId(channelId);
        console.log(posts);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    const formData = {
      channel_id: currentChannelId,
      message: inputText
    };
    let myUrl = "/api/user/createPost";

    axios
      .post(myUrl, formData)
      .then(response => {
        console.log(response.data);
        getPosts(currentChannelId)
      })
      .catch(error => {
        console.log(error);
      });
  };

  const changeHandler = event => {
    setinputText(event.target.value);
  };

  let renderPosts = posts.map(postId => <PostItem key={postId} id={postId} />);

  let channelItem = channels.map(channel => (
    <ChannelListItem
      name={channel.display_name}
      key={channel.id}
      id={channel.id}
      getPosts={() => getPosts(channel.id)}
    />
  ));

  let content = (
    <>
      <div className="mx-auto px-auto h-100">
        <div className="row m-75">
          <div className="col-md-2 sidebar">
            <div className="d-flex justify-content-center">
              <h1>Üdvözlünk {userName}! </h1>
            </div>
            <div className="d-flex justify-content-center">
              <div className="d-flex flex-column bd-highlight mb-3">
                <h2>Csatornák</h2>
                {channelItem}
              </div>
            </div>
          </div>
          <div className="col-md-10">
            <div className="d-flex flex-column-reverse bd-highlight">
              {renderPosts}
            </div>
          </div>
        </div>
        <div className="row fixed-bottom">
          <div className="col-md-10 ml-auto align-self-end">
            <div className="d-flex justify-content-end ">
              <button className="btn btn-info mr-3 h-50" onClick={handleSubmit}>
                Send
              </button>
              <textarea
                onChange={changeHandler}
                value={inputText}
                placeholder="Write your message here!"
                className="mr-5 mb-5"
                name="textare"
                id="input"
                rows={2}
                cols={120}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return content;
};

export default MainPage;
