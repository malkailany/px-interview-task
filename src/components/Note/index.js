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
    toast.dismiss()
    const note = e.target.value
    localStorage.setItem('TempNote', note)

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
        callback={debounce(e => handleSave(e), 500)}
      />
      <ToastContainer limit={1} />
    </div>
  )
}

function NoteField ({ userNote, callback }) {
  return (
    <>
      <textarea
        defaultValue={
          userNote ?? localStorage.getItem('TempNote') ?? 'Default value'
        }
        onChange={callback}
      ></textarea>
      {/** If the user has not got a note */}
      {!userNote && localStorage.getItem('TempNote') ? (
        <p>Saved from last draft</p>
      ) : null}
    </>
  )
}
