import './App.css'
import UserContext from './contexts/UserContext'
import MainApp from './MainApp'


function App() {

  return (
    <>
      <UserContext>
        <MainApp />
      </UserContext>
    </>
  )
}

export default App
