import React, { FC } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import {
  Index,
  ExerciseList,
  ExercisePublish,
  ExerciseModify,
  CourseList,
  CoursePublish,
  CourseModify,
  ExamList,
  ExamPublish,
  ExamModify,
  MarkPaper,
  ClassDashboard
} from '@/admin/pages'
import {
  RestrictRoute
} from '@/admin/components'

import './index.scss'

const ContentMain: FC = () => {
  return (
    <div className="main__container">
      <Routes>
        <Route path="" element={Index} />
        {/* 内容管理 */}
        <Route path="content/exercise-list" element={
          <RestrictRoute><ExerciseList /></RestrictRoute>
        } />
        <Route path="content/exercise-publish" element={
          <RestrictRoute><ExercisePublish /></RestrictRoute>
        } />
        <Route path="content/exercise-modify/:id" element={
          <RestrictRoute><ExerciseModify /></RestrictRoute>
        } />
        <Route path="content/course-list" element={
          <RestrictRoute><CourseList /></RestrictRoute>
        } />
        <Route path="content/course-publish" element={
          <RestrictRoute><CoursePublish /></RestrictRoute>
        } />
        <Route path="content/course-modify/:id" element={
          <RestrictRoute><CourseModify /></RestrictRoute>
        } />
        <Route path="content/exam-list" element={
          <RestrictRoute><ExamList /></RestrictRoute>
        } />
        <Route path="content/exam-publish" element={
          <RestrictRoute><ExamPublish /></RestrictRoute>
        } />
        <Route path="content/exam-modify/:id" element={
          <RestrictRoute><ExamModify /></RestrictRoute>
        } />
        <Route path="content/mark-paper" element={
          <RestrictRoute><MarkPaper /></RestrictRoute>
        } />
        {/* 班级建设 */}
        <Route path="class/class-dashboard" element={
          <RestrictRoute><ClassDashboard /></RestrictRoute>
        } />

        <Route path="" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  )
}

export default ContentMain