import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectAuth, LoginStatus } from '../Login/authslice'
import { fetchAPI } from '../../utils/api-helper'
import debounce from '../../utils/debounce'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export function Note () {
  const auth = useAppSelector(selectAuth)
  if (auth.status !== LoginStatus.LOGGED_IN) return null
  const {
    apiToken,
    user: { id: userId }
  } = auth

  const handleSave = e => {
    toast.dismiss() //dismiss all active toast 
    const note = e.target.value 
    localStorage.setItem('TempNote', note) //save the note in localstorage

    fetchAPI(`/users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ note })
    })
      .then(res => {
        toast('Note has been saved!', {
          toastId: 'saved'
        })
      })
      .catch(error => {
        toast('Error! Something has gone wrong with saving')
      })
  }

  return (
    <div>
      <NoteField
        userNote={auth.user.note}
        callback={debounce(e => handleSave(e), 500)} // debounce the handle save function with 500ms delay on key releases
      />
      {/* for notifications  */}
      <ToastContainer limit={1} />
    </div>
  )
}

function NoteField ({ userNote, callback }) {
  return (
    <>
      <textarea
        defaultValue={
          userNote ?? localStorage.getItem('TempNote') ?? 'Write a new note!' // in order check if it exists, if usernote doesnt, then check storage and fall back on default
        }
        onChange={callback} //callback when entering values
      ></textarea>
      {/** If the user has not got a note from the api, i.e. failure, it will grab from the localstorage*/}
      {!userNote && localStorage.getItem('TempNote') ? (
        <p>Saved from last draft</p>
      ) : null}
    </>
  )
}
