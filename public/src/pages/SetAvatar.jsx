import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { setAvatarRoute } from '../utils/APIRoutes'
import loader from '../assets/loader.gif'
import { Buffer } from 'buffer'


export default function SetAvatar() {
  const api = 'https://api.multiavatar.com/45678945';
  const navigate = useNavigate()
  const [avatars, setAvatars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  }

  useEffect(() => {
    const chatNavigate = async () => {
      if (!localStorage.getItem('chat-app-user')) {
        navigate('/login')
      }
    }
    chatNavigate()
  }, [])

  async function fetchData() {
    const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`, { responseType: 'arraybuffer' })
    return Buffer.from(image.data).toString('base64')
  }
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please set profile picture", toastOptions)
    } else {
      const user = await JSON.parse(localStorage.getItem('chat-app-user'))
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar]
      })

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem('chat-app-user', JSON.stringify(user));
        navigate('/')
      } else {
        toast.error('Error occured while setting profile avatar. Please try later')
      }
    }
  };
  useEffect(() => {
    const data = [];
    let resolvedPromises;
    const fetchDataAndSetAvatar = async () => {
      const imageData = await fetchData()
      return imageData
    }

    const resolvePromise = async () => {
      for (let i = 0; i < 4; i++) {
        data.push(fetchDataAndSetAvatar())
        resolvedPromises = await Promise.all(data)
      }
      setAvatars(resolvedPromises)
    }
    resolvePromise()
    setIsLoading(false)
  }, [])
  return (
    <>
      {
        isLoading ? (<Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>) : <Container>
          <div className="title-container">
            <h1>Pick an avatar</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${selectedAvatar === index ? "selected" : ''}
                ` }>
                  <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={() => setSelectedAvatar(index)} />
                </div>
              )
            })
            }
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>set as profile picture</button>
        </Container >
      }

      <ToastContainer />
    </>
  )
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100vw;
.loader {
  max-inline-size: 100%;
}
.title-container {
  h1 {
    color: white;
  }
}
.avatars {
  display: flex;
  gap: 2rem;
  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4rem;
    border-radius: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
    img {
      height: 6rem;
    }
  }
  .selected {
    border: 0.4rem solid #4e0eff;
  }
}
.submit-btn {
  background-color: #997af0;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 1rem;
  text-transform: uppercase;
  transition: 0.3s;
  &:hover {
    background-color: #4e0eff;
  }
}
`