
import { createContext, useContext } from 'react'


import ExerciseStore from './exerciseStore'
import StudyStore from './studyStore'
import InfoStore from './infoStore'
import ChatroomStore from './chatroomStore'
import CourseStore from './courseStore'
import ForumStore from './forumStore'

export const store = {
  exerciseStore: new ExerciseStore(),
  studyStore: new StudyStore(),
  infoStore: new InfoStore(),
  chatroomStore: new ChatroomStore(),
  courseStore: new CourseStore(),
  forumStore: new ForumStore()
}

const StoreContext = createContext(store)

export const StoreProvider = StoreContext.Provider

export const useStore = () => useContext(StoreContext)