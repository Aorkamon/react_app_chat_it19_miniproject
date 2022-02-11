import './App.css';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import AuthProvider from './context/auth'
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar/>
        <Switch>
          <Route exact path= "/register" component={Register}/>
          <Route exact path= "/login" component={Login}/>
          <PrivateRoute exact path= "/Profile" component={Profile}/>
          <PrivateRoute exact path= "/" component={Home}/>
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
