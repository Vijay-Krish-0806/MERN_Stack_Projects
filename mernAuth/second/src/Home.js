import React from 'react'
import  {useNavigate} from 'react-router-dom';

export default function Home() {
  const navigate=useNavigate();
  return (
    <>
    <center>
      <input type='text' placeholder='username'></input><br/>
      <button onClick={()=>{navigate('/Submit')}}>Submit</button>
    </center>
    </>
  )
}
