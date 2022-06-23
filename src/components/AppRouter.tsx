import { Route, Routes } from "react-router-dom";
import Main from "../pages/main/Main";
import QuizList from "../pages/quiz/QuizList";
import QuizResult from "../pages/quiz/QuizResult";
import Landing from "../pages/prologue/Prologue";
import Ai from "../pages/ai/Ai";
import Map from "../pages/map/Map";
import Category from "../pages/trash/Category";
import Trash from "../pages/trash/Trash";
import Quiz from "../pages/quiz/Quiz";
import WrongQuiz from "../pages/quiz/WrongQuiz";
import LoginPage from "../pages/user/Users";
import UserPage from "../pages/user/UserPage";
import Game from "../pages/game/Game";
import Rank from "../pages/game/Rank";

//set router component
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/quiz/:id" element={<WrongQuiz />} />
      <Route path="/quizzes" element={<QuizList />} />
      <Route path="/quizzes/:type" element={<Quiz />} />
      <Route path="/quizzes/result" element={<QuizResult />} />
      <Route path="/prologue" element={<Landing />} />
      <Route path="/map" element={<Map />} />
      <Route path="/ai" element={<Ai />} />
      <Route path="/category/*" element={<Category />} />
      <Route path="/trash/:id" element={<Trash />} />
      <Route path="/user/:id" element={<UserPage />} />
      <Route path="/users/*" element={<LoginPage />} />
      <Route path="/game/play" element={<Game />} />
      <Route path="/game/ranking" element={<Rank />} />
    </Routes>
  );
}

export default AppRouter;
