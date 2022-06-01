import { Switch, Route, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import About from "./About";
import Home from "./Home";
import Login from "./Login";
import Reviews from "./Reviews";
import SignUp from "./SignUp";

function App() {
  const [bootcamps, setBootcamps] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentBootcamp, setCurrentBootcamp] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState("");

  const history = useHistory();

  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    return history.listen((location) => {
      console.log(`You changed the page to: ${location.pathname}`);
      setCurrentPath(location.pathname);
    });
  }, [history]);

  useEffect(() => {
    fetch("http://localhost:9292/bootcamps")
      .then((res) => res.json())
      .then((data) => setBootcamps(data));
  }, []);

  function handleReviewClick(bootcamp, name, average_review) {
    setCurrentBootcamp(bootcamp);
    history.push("/reviews");
    fetch(`http://localhost:9292/bootcamps/${name}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setReviews(data);
      });
  }

  function handleReviewDelete(reviewid) {
    console.log(currentBootcamp);
    console.log(reviewid);

    const updatedReviews = reviews.filter((review) => review.id !== reviewid);

    fetch(
      `http://localhost:9292/bootcamps/${currentBootcamp.name}/${reviewid}`,
      {
        method: "DELETE",
      }
    );
    setReviews(updatedReviews);
  }

  useEffect(() => {
    fetch("http://localhost:9292/login")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);
  const handleLogin = (loginInfo) => {
    setCurrentUser(loginInfo);
    setIsLoggedIn(true);
    history.push("/bootcamps");
  };
  const onSignUpClick = (signUpInfo) => {
    setUsers([...users, signUpInfo]);
  };

  console.log(currentUser);
  console.log(users);

  useEffect(() => {
    if (currentUser !== "") {
      const loggedInUser = users.filter(
        (user) => currentUser.username === user.username
      );
      setLoggedInUserId(loggedInUser[0].id);
    }
  }, [currentUser, users]);

  return (
    <div>
      <NavBar setIsLoggedIn={setIsLoggedIn} setCurrentUser={setCurrentUser} />
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/bootcamps">
          <Home
            bootcamps={bootcamps}
            handleReviewClick={handleReviewClick}
            currentUser={currentUser}
            isLoggedIn={isLoggedIn}
          />
        </Route>
        <Route path="/login">
          <Login
            users={users}
            handleLogin={handleLogin}
            isLoggedIn={isLoggedIn}
          />
        </Route>
        <Route path="/signup">
          <SignUp users={users} onSignUpClick={onSignUpClick} />
        </Route>
        <Route path="/reviews">
          <Reviews
            reviews={reviews}
            currentBootcamp={currentBootcamp}
            handleReviewDelete={handleReviewDelete}
            loggedInUserId={loggedInUserId}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
